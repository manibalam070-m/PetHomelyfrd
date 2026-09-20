import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import ErrorHandler from '../utils/errorHandler.js';

export const getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });
    res.status(200).json({ success: true, cart });
  } catch (error) { next(error); }
};

export const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const product = await Product.findById(productId);
    if (!product) return next(new ErrorHandler('Product not found', 404));
    if (!Number.isInteger(Number(quantity)) || Number(quantity) < 1) {
      return next(new ErrorHandler('Quantity must be a positive whole number', 400));
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });

    const idx = cart.items.findIndex((i) => i.product.toString() === productId);
    const requestedQuantity = idx > -1 ? cart.items[idx].quantity + Number(quantity) : Number(quantity);
    if (product.stock < requestedQuantity) return next(new ErrorHandler('Insufficient stock', 400));
    if (idx > -1) cart.items[idx].quantity = requestedQuantity;
    else cart.items.push({ product: productId, quantity });

    await cart.save();
    await cart.populate('items.product');
    res.status(200).json({ success: true, cart });
  } catch (error) { next(error); }
};

export const updateCartItem = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    if (quantity < 1) return next(new ErrorHandler('Quantity must be at least 1', 400));
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return next(new ErrorHandler('Cart not found', 404));
    const item = cart.items.find((i) => i.product.toString() === productId);
    if (!item) return next(new ErrorHandler('Item not in cart', 404));
    const product = await Product.findById(productId);
    if (!product) return next(new ErrorHandler('Product not found', 404));
    if (product.stock < quantity) return next(new ErrorHandler('Insufficient stock', 400));
    item.quantity = quantity;
    await cart.save();
    await cart.populate('items.product');
    res.status(200).json({ success: true, cart });
  } catch (error) { next(error); }
};

export const removeFromCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return next(new ErrorHandler('Cart not found', 404));
    cart.items = cart.items.filter((i) => i.product.toString() !== req.params.productId);
    await cart.save();
    await cart.populate('items.product');
    res.status(200).json({ success: true, cart });
  } catch (error) { next(error); }
};

export const clearCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (cart) { cart.items = []; await cart.save(); }
    res.status(200).json({ success: true, message: 'Cart cleared' });
  } catch (error) { next(error); }
};