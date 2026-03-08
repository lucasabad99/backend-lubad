// Repositorio de productos
const Product = require('../models/Product');

const getProducts = async ({ limit, page, sort, query }) => {
  const filter = query ? { $or: [ { category: query }, { status: query } ] } : {};
  const sortOption = sort ? { price: sort === 'asc' ? 1 : -1 } : {};
  const options = {
    limit: parseInt(limit),
    page: parseInt(page),
    sort: sortOption,
  };
  const result = await Product.paginate(filter, options);
  return {
    status: 'success',
    payload: result.docs,
    totalPages: result.totalPages,
    prevPage: result.prevPage,
    nextPage: result.nextPage,
    page: result.page,
    hasPrevPage: result.hasPrevPage,
    hasNextPage: result.hasNextPage,
    prevLink: result.hasPrevPage ? `/products?page=${result.prevPage}` : null,
    nextLink: result.hasNextPage ? `/products?page=${result.nextPage}` : null,
  };
};

const getProductById = async (pid) => {
  return await Product.findById(pid);
};

module.exports = {
  getProducts,
  getProductById,
};