import express from 'express';
import { Manager } from './managers/product.manager.js';
import { CartManager } from './managers/cart.manager.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//PRODUCTS 
app.get('/api/products', async (req, res) => {
  try {
    const products = await Manager.getProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/products/:pid', async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await Manager.getById(pid);
    res.json(product);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const created = await Manager.add(req.body);
    res.status(201).json(created);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/products/:pid', async (req, res) => {
  try {
    const { pid } = req.params;
    const updated = await Manager.update(pid, req.body);
    res.json(updated);
  } catch (error) {
    const code = /not found/i.test(error.message) ? 404 : 400;
    res.status(code).json({ error: error.message });
  }
});

app.delete('/api/products/:pid', async (req, res) => {
  try {
    const { pid } = req.params;
    const removed = await Manager.delete(pid);
    res.json(removed);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// CARTS
app.post('/api/carts', async (req, res) => {
  try {
    const created = await CartManager.createCart();
    res.status(201).json(created);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/carts/:cid', async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await CartManager.getById(cid);
    res.json(cart.products || []);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

app.post('/api/carts/:cid/product/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const updated = await CartManager.addProduct(cid, pid);
    res.status(201).json(updated);
  } catch (error) {
    const code = /not found/i.test(error.message) ? 404 : 400;
    res.status(code).json({ error: error.message });
  }
});

app.listen(8080, () => console.log('server running on port 8080'));
