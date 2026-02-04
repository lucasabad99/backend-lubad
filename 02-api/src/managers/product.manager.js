import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PRODUCTS_PATH = path.join(__dirname, "../products.json");

class ProductManager {
  constructor(path) {
    this.path = path;
  }

  async getProducts() {
    try {
      if (!fs.existsSync(this.path)) return [];
      const data = await fs.promises.readFile(this.path, "utf-8");
      return JSON.parse(data || "[]");
    } catch (error) {
      console.error("Error reading products:", error);
      return [];
    }
  }

  async getById(id) {
    const products = await this.getProducts();
    const pid = Number(id);
    const product = products.find((p) => p.id === pid);
    if (!product) throw new Error("Product not found");
    return product;
  }

  async add(body) {
    const products = await this.getProducts();
    const newId = products.length ? Math.max(...products.map((p) => p.id)) + 1 : 1;

    const product = {
      id: newId,
      title: body.title,
      description: body.description,
      code: body.code,
      price: Number(body.price),
      status: body.status === undefined ? true : Boolean(body.status),
      stock: Number(body.stock),
      category: body.category,
      thumbnails: Array.isArray(body.thumbnails) ? body.thumbnails : [],
    };

    products.push(product);
    await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
    return product;
  }

  async update(id, body) {
    const products = await this.getProducts();
    const pid = Number(id);
    const index = products.findIndex((p) => p.id === pid);
    if (index === -1) throw new Error("Product not found");
    const { id: _ignored, ...updates } = body; // no permitir cambiar id
    products[index] = { ...products[index], ...updates };
    await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
    return products[index];
  }

  async delete(id) {
    const products = await this.getProducts();
    const pid = Number(id);
    const index = products.findIndex((p) => p.id === pid);
    if (index === -1) throw new Error("Product not found");
    const [removed] = products.splice(index, 1);
    await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
    return removed;
  }
}

export const Manager = new ProductManager(PRODUCTS_PATH);