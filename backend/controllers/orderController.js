import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Cart from '../models/Cart.js';
import ErrorHandler from '../utils/errorHandler.js';
import mongoose from 'mongoose';

export const createOrder = async (req, res, next) => {
  const session = await mongoose.startSession();
  try {
    const { orderItems, shippingAddress, paymentInfo } = req.body;
    if (!orderItems?.length) return next(new ErrorHandler('No order items', 400));

    const requestedItems = orderItems.map((item) => ({
      product: item.product,
      quantity: Number(item.quantity),
    }));
    if (requestedItems.some((item) => !Number.isInteger(item.quantity) || item.quantity < 1)) {
      return next(new ErrorHandler('Each item quantity must be a positive whole number', 400));
    }

    const productIds = requestedItems.map((item) => item.product);
    if (new Set(productIds.map(String)).size !== productIds.length) {
      return next(new ErrorHandler('Duplicate products are not allowed in an order', 400));
    }

    let createdOrder;
    await session.withTransaction(async () => {
      const products = await Product.find({ _id: { $in: productIds } }).session(session);
      const productById = new Map(products.map((product) => [String(product._id), product]));
      const normalizedItems = [];
      let itemsPrice = 0;

      for (const item of requestedItems) {
        const product = productById.get(String(item.product));
        if (!product) throw new ErrorHandler('Product not found', 404);
        if (product.stock < item.quantity) {
          throw new ErrorHandler(`Insufficient stock for ${product.name}`, 400);
        }
        const price = product.discountPrice > 0 ? product.discountPrice : product.price;
        itemsPrice += price * item.quantity;
        normalizedItems.push({
          product: product._id,
          name: product.name,
          image: product.images?.[0]?.url || '',
          price,
          quantity: item.quantity,
        });
        const updated = await Product.updateOne(
          { _id: product._id, stock: { $gte: item.quantity } },
          { $inc: { stock: -item.quantity } },
          { session },
        );
        if (updated.modifiedCount !== 1) throw new ErrorHandler(`Insufficient stock for ${product.name}`, 400);
      }

      const shippingPrice = itemsPrice > 499 ? 0 : 50;
      const taxPrice = Number((itemsPrice * 0.05).toFixed(2));
      const totalPrice = Number((itemsPrice + shippingPrice + taxPrice).toFixed(2));

      [createdOrder] = await Order.create([{
        user: req.user._id,
        orderItems: normalizedItems,
        shippingAddress,
        paymentInfo: { method: paymentInfo?.method || 'COD', status: 'Pending' },
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
      }], { session });

      await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] }, { session });
    });

    res.status(201).json({ success: true, order: createdOrder });
  } catch (error) { next(error); }
  finally { await session.endSession(); }
};

export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort('-createdAt');
    res.status(200).json({ success: true, orders });
  } catch (error) { next(error); }
};

export const getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (!order) return next(new ErrorHandler('Order not found', 404));
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return next(new ErrorHandler('Not authorized', 403));
    }
    res.status(200).json({ success: true, order });
  } catch (error) { next(error); }
};

// Admin
export const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().populate('user', 'name email').sort('-createdAt');
    const totalAmount = orders.reduce((s, o) => s + o.totalPrice, 0);
    res.status(200).json({ success: true, orders, totalAmount });
  } catch (error) { next(error); }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return next(new ErrorHandler('Order not found', 404));
    if (order.orderStatus === 'Delivered') return next(new ErrorHandler('Already delivered', 400));
    order.orderStatus = req.body.status;
    if (req.body.status === 'Delivered') order.deliveredAt = Date.now();
    await order.save();
    res.status(200).json({ success: true, order });
  } catch (error) { next(error); }
};

export const deleteOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return next(new ErrorHandler('Order not found', 404));
    await order.deleteOne();
    res.status(200).json({ success: true, message: 'Order deleted' });
  } catch (error) { next(error); }
};