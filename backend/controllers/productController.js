import Product from '../models/Product.js';
import ErrorHandler from '../utils/errorHandler.js';
import APIFeatures from '../utils/apiFeatures.js';

export const getProducts = async (req, res, next) => {
  try {
    const resPerPage = Number(req.query.limit) || 12;
    const productsCount = await Product.countDocuments();
    const apiFeatures = new APIFeatures(Product.find(), req.query).search().filter().sort();
    let products = await apiFeatures.query.clone();
    const filteredCount = products.length;
    apiFeatures.paginate(resPerPage);
    products = await apiFeatures.query;

    res.status(200).json({
      success: true, products, productsCount, filteredCount,
      resPerPage, currentPage: Number(req.query.page) || 1,
    });
  } catch (error) { next(error); }
};

export const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return next(new ErrorHandler('Product not found', 404));
    res.status(200).json({ success: true, product });
  } catch (error) { next(error); }
};

export const getFeaturedProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ isFeatured: true }).limit(8);
    res.status(200).json({ success: true, products });
  } catch (error) { next(error); }
};

export const getRelatedProducts = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return next(new ErrorHandler('Product not found', 404));
    const related = await Product.find({
      category: product.category, _id: { $ne: product._id },
    }).limit(4);
    res.status(200).json({ success: true, products: related });
  } catch (error) { next(error); }
};

// Admin
export const createProduct = async (req, res, next) => {
  try {
    req.body.user = req.user._id;
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, product });
  } catch (error) { next(error); }
};

export const updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);
    if (!product) return next(new ErrorHandler('Product not found', 404));
    product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.status(200).json({ success: true, product });
  } catch (error) { next(error); }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return next(new ErrorHandler('Product not found', 404));
    await product.deleteOne();
    res.status(200).json({ success: true, message: 'Product deleted' });
  } catch (error) { next(error); }
};