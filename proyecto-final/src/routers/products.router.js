const express = require('express');
const { getProducts, getProductById, deleteProductById, updateProductPartialById } = require('../controllers/product-controller');
const router = express.Router();

router.get('/', getProducts);
router.get('/:pid', getProductById);
router.patch('/:pid', updateProductPartialById);
router.delete('/:pid', deleteProductById);

module.exports = router;
