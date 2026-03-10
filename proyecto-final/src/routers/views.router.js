const express = require('express');
const Product = require('../models/Product');
const Cart = require('../models/Cart');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query, category, status } = req.query;
    let filter = {};

    if (category) {
      filter.category = category;
    } else if (typeof status !== 'undefined') {
      filter.status = status === 'true';
    } else if (query) {
      if (query === 'true' || query === 'false') {
        filter.status = query === 'true';
      } else {
        filter.category = query;
      }
    }

    const sortOption = sort ? { price: sort === 'asc' ? 1 : -1 } : {};

    const result = await Product.paginate(filter, {
      limit: parseInt(limit, 10),
      page: parseInt(page, 10),
      sort: sortOption,
      lean: true,
    });

    const buildLink = (targetPage) => {
      const params = new URLSearchParams();
      params.set('page', targetPage);
      params.set('limit', String(limit));
      if (sort) params.set('sort', sort);
      if (query) params.set('query', query);
      return `/?${params.toString()}`;
    };

    res.render('index', {
      products: result.docs,
      totalPages: result.totalPages,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage ? buildLink(result.prevPage) : null,
      nextLink: result.hasNextPage ? buildLink(result.nextPage) : null,
    });
  } catch (error) {
    res.status(500).send(`Error al renderizar productos: ${error.message}`);
  }
});

router.get('/products/:pid/view', async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await Product.findById(pid).lean();
    if (!product) return res.status(404).send('Producto no encontrado');
    res.render('productDetails', { product });
  } catch (error) {
    res.status(500).send(`Error al renderizar producto: ${error.message}`);
  }
});

router.get('/carts/:cid/view', async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await Cart.findById(cid).populate('products.product').lean();
    if (!cart) return res.status(404).send('Carrito no encontrado');
    res.render('cart', { cart });
  } catch (error) {
    res.status(500).send(`Error al renderizar carrito: ${error.message}`);
  }
});

module.exports = router;
