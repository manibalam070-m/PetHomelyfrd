import Product from '../models/Product.js';
import ErrorHandler from '../utils/errorHandler.js';

export const createReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return next(new ErrorHandler('Product not found', 404));

    const existing = product.reviews.find((r) => r.user.toString() === req.user._id.toString());
    if (existing) return next(new ErrorHandler('Already reviewed', 400));

    product.reviews.push({
      user: req.user._id, name: req.user.name,
      rating: Number(rating), comment,
    });
    product.numReviews = product.reviews.length;
    product.ratings = product.reviews.reduce((a, r) => a + r.rating, 0) / product.reviews.length;
    await product.save();
    res.status(201).json({ success: true, message: 'Review added' });
  } catch (error) { next(error); }
};

export const getProductReviews = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return next(new ErrorHandler('Product not found', 404));
    res.status(200).json({ success: true, reviews: product.reviews });
  } catch (error) { next(error); }
};

export const deleteReview = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) return next(new ErrorHandler('Product not found', 404));
    product.reviews = product.reviews.filter((r) => r._id.toString() !== req.params.id);
    product.numReviews = product.reviews.length;
    product.ratings = product.reviews.length
      ? product.reviews.reduce((a, r) => a + r.rating, 0) / product.reviews.length : 0;
    await product.save();
    res.status(200).json({ success: true, message: 'Review deleted' });
  } catch (error) { next(error); }
};