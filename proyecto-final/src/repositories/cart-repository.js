const Cart = require('../models/Cart');

const getCartById = async (cid) => {
  return await Cart.findById(cid).populate('products.product');
};

module.exports = {
  getCartById,
};