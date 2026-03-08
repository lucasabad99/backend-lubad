// Router profesional para carritos
const express = require('express');
const { getCartById } = require('../controllers/cart-controller');
const Cart = require('../models/Cart');
const router = express.Router();

// DELETE api/carts/:cid/products/:pid
router.delete('/:cid/products/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ status: 'error', error: 'Carrito no encontrado' });
    cart.products = cart.products.filter(p => p.product.toString() !== pid);
    await cart.save();
    res.json({ status: 'success', cart });
  } catch (error) {
    res.status(500).json({ status: 'error', error: error.message });
  }
});

// PUT api/carts/:cid
router.put('/:cid', async (req, res) => {
  try {
    const { cid } = req.params;
    const { products } = req.body;
    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ status: 'error', error: 'Carrito no encontrado' });
    cart.products = products;
    await cart.save();
    res.json({ status: 'success', cart });
  } catch (error) {
    res.status(500).json({ status: 'error', error: error.message });
  }
});

// PUT api/carts/:cid/products/:pid
router.put('/:cid/products/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ status: 'error', error: 'Carrito no encontrado' });
    const productInCart = cart.products.find(p => p.product.toString() === pid);
    if (!productInCart) return res.status(404).json({ status: 'error', error: 'Producto no encontrado en carrito' });
    productInCart.quantity = quantity;
    await cart.save();
    res.json({ status: 'success', cart });
  } catch (error) {
    res.status(500).json({ status: 'error', error: error.message });
  }
});

// DELETE api/carts/:cid
router.delete('/:cid', async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ status: 'error', error: 'Carrito no encontrado' });
    cart.products = [];
    await cart.save();
    res.json({ status: 'success', cart });
  } catch (error) {
    res.status(500).json({ status: 'error', error: error.message });
  }
});

// GET api/carts/:cid (con populate)
router.get('/:cid', getCartById);

module.exports = router;
