import { Router } from 'express';
import { Manager } from '../managers/product.manager.js';

export function createViewsRouter(io) {
  const router = Router();

  router.get('/', async (req, res) => {
    const products = await Manager.getProducts();
    res.render('home', { products });
  });

  router.get('/realtimeproducts', async (req, res) => {
    // page will connect via socket.io and receive live updates
    res.render('realTimeProducts');
  });

  return router;
}
