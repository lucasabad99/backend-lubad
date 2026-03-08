// Controlador de carritos
const CartRepository = require('../repositories/cart-repository');

const getCartById = async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await CartRepository.getCartById(cid);
    if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
    res.json({ status: 'success', payload: cart });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

module.exports = {
  getCartById,
};