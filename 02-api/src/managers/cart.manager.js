import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Manager as ProductManager } from './product.manager.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CARTS_PATH = path.join(__dirname, '../carts.json');

class CartManagerFS {
  constructor(path) {
    this.path = path;
  }

  async #readFile() {
    try {
      if (!fs.existsSync(this.path)) return [];
      const data = await fs.promises.readFile(this.path, 'utf-8');
      return JSON.parse(data || '[]');
    } catch (err) {
      console.error('Error reading carts:', err);
      return [];
    }
  }

  async #writeFile(carts) {
    await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2));
  }

  async getCarts() {
    return this.#readFile();
  }

  async getById(id) {
    const carts = await this.#readFile();
    const cid = Number(id);
    const cart = carts.find(c => c.id === cid);
    if (!cart) throw new Error('Cart not found');
    return cart;
  }

  async createCart() {
    const carts = await this.#readFile();
    const newId = carts.length ? Math.max(...carts.map(c => c.id)) + 1 : 1;
    const cart = { id: newId, products: [] };
    carts.push(cart);
    await this.#writeFile(carts);
    return cart;
  }

  async addProduct(cid, pid, quantity = 1) {
    const carts = await this.#readFile();
    const cartId = Number(cid);
    const productId = Number(pid);
    const qty = Number(quantity) || 1;

    const cartIndex = carts.findIndex(c => c.id === cartId);
    if (cartIndex === -1) throw new Error('Cart not found');

    await ProductManager.getById(productId);

    const products = carts[cartIndex].products || [];
    const existingIndex = products.findIndex(p => Number(p.product) === productId);

    if (existingIndex !== -1) {
      products[existingIndex].quantity += qty;
    } else {
      products.push({ product: productId, quantity: qty });
    }

    carts[cartIndex].products = products;
    await this.#writeFile(carts);
    return carts[cartIndex];
  }
}

export const CartManager = new CartManagerFS(CARTS_PATH);