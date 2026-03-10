// Controlador de productos
const ProductRepository = require('../repositories/product-repository');

const getProducts = async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query, category, status } = req.query;
    const result = await ProductRepository.getProducts({ limit, page, sort, query, category, status });
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

const deleteProductById = async (req, res) => {
  try {
    const { pid } = req.params;
    const deletedProduct = await ProductRepository.deleteProductById(pid);
    if (!deletedProduct) return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
    res.json({ status: 'success', payload: deletedProduct });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

const updateProductPartialById = async (req, res) => {
  try {
    const { pid } = req.params;
    const updates = req.body;

    if (!updates || Object.keys(updates).length === 0) {
      return res.status(400).json({ status: 'error', message: 'Debe enviar al menos un campo para actualizar' });
    }

    const updatedProduct = await ProductRepository.updateProductPartialById(pid, updates);
    if (!updatedProduct) return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });

    res.json({ status: 'success', payload: updatedProduct });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  deleteProductById,
  updateProductPartialById,
};