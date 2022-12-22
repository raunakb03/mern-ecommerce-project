const Product = require("../models/productModel");
const asyncHandler = require("express-async-handler");
const slugify = require('slugify')

// !@Function:   create a new product
// !@Method:     POST
// !@Route:      api/product
const createProduct = asyncHandler(async (req, res) => {
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title)
    }
    const newProduct = await Product.create(req.body);
    res.json({ newProduct });
  } catch (error) {
    throw new Error(error);
  }
});

// !@Function:   get a product
// !@Method:     GET
// !@Route:      api/product/:id
const getaProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const findProduct = await Product.findById(id);
    res.json({ findProduct })
  } catch (error) {
    throw new Error(error)
  }
})

// !@Function:   get all products
// !@Method:     GET
// !@Route:      api/product
const getAllProduct = asyncHandler(async (req, res) => {
  try {
    const getAllProducts = await Product.find();
    res.json(getAllProducts)
  } catch (error) {
    throw new Error(error);
  }
})

// !@Function:   update products
// !@Method:     PUT
// !@Route:      api/product/:id
const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const updateProduct = await Product.findOneAndUpdate({ id }, req.body, { new: true });
    res.json(updateProduct);
  } catch (error) {
    throw new Error(error);
  }
})

// !@Function:   delete products
// !@Method:     DELETE
// !@Route:      api/product/:id
const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const deleteProduct = await Product.findOneAndDelete(id);
    res.json(deleteProduct);
  } catch (error) {
    throw new Error(error);
  }
})

module.exports = { createProduct, getaProduct, getAllProduct, updateProduct, deleteProduct };
