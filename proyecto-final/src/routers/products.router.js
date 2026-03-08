// Router profesional para productos
const express = require('express');
const { getProducts, getProductById } = require('../controllers/product-controller');
const router = express.Router();

router.get('/', getProducts);
router.get('/:pid', getProductById);

module.exports = router;
