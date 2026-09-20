import Category from '../models/Category.js';
import ErrorHandler from '../utils/errorHandler.js';

export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ isActive: true });
    res.status(200).json({ success: true, categories });
  } catch (error) { next(error); }
};

export const createCategory = async (req, res, next) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json({ success: true, category });
  } catch (error) { next(error); }
};

export const updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!category) return next(new ErrorHandler('Category not found', 404));
    res.status(200).json({ success: true, category });
  } catch (error) { next(error); }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return next(new ErrorHandler('Category not found', 404));
    await category.deleteOne();
    res.status(200).json({ success: true, message: 'Deleted' });
  } catch (error) { next(error); }
};