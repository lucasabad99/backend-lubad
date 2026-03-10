const Product = require('../models/Product');

const getProducts = async ({ limit, page, sort, query, category, status }) => {
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

const deleteProductById = async (pid) => {
  return await Product.findByIdAndDelete(pid);
};

const updateProductPartialById = async (pid, updates) => {
  return await Product.findByIdAndUpdate(
    pid,
    { $set: updates },
    { new: true, runValidators: true }
  );
};

module.exports = {
  getProducts,
  getProductById,
  deleteProductById,
  updateProductPartialById,
};