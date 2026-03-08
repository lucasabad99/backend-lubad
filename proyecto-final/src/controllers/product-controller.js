// Controlador de productos
const ProductRepository = require('../repositories/product-repository');

const getProducts = async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;
    const result = await ProductRepository.getProducts({ limit, page, sort, query });
    res.json(result);
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await ProductRepository.getProductById(pid);
    if (!product) return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
    res.json({ status: 'success', payload: product });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
};