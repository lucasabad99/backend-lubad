import express from 'express';
import http from 'http';
import { Server as IOServer } from 'socket.io';
import { engine } from 'express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';
import { Manager } from './managers/product.manager.js';
import { CartManager } from './managers/cart.manager.js';
import { createViewsRouter } from './routes/views.router.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Handlebars setup
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Static files for client-side socket script
app.use(express.static(path.join(__dirname, '..', 'public')));

// API endpoints (unchanged logic)
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
    // Optionally emit via io if available
    const io = app.get('io');
    if (io) io.emit('products', await Manager.getProducts());
    res.status(201).json(created);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/products/:pid', async (req, res) => {
  try {
    const { pid } = req.params;
    const updated = await Manager.update(pid, req.body);
    const io = app.get('io');
    if (io) io.emit('products', await Manager.getProducts());
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
    const io = app.get('io');
    if (io) io.emit('products', await Manager.getProducts());
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

// Views router (will handle / and /realtimeproducts)
// createViewsRouter expects the io instance; we'll attach io after http server created

const httpServer = http.createServer(app);
const io = new IOServer(httpServer);
// make io available to routes/handlers that might want to emit
app.set('io', io);

// Socket logic: on connection send current products and handle create/delete via sockets
io.on('connection', async (socket) => {
  console.log('socket connected:', socket.id);
  socket.emit('products', await Manager.getProducts());

  socket.on('newProduct', async (payload) => {
    try {
      await Manager.add(payload);
      io.emit('products', await Manager.getProducts());
    } catch (err) {
      socket.emit('error', err.message);
    }
  });

  socket.on('deleteProduct', async (pid) => {
    try {
      await Manager.delete(pid);
      io.emit('products', await Manager.getProducts());
    } catch (err) {
      socket.emit('error', err.message);
    }
  });
});

// mount views router
app.use('/', createViewsRouter(io));

httpServer.listen(8080, () => console.log('server running on port 8080'));
