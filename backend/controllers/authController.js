import User from '../models/User.js';
import Cart from '../models/Cart.js';
import Wishlist from '../models/Wishlist.js';
import ErrorHandler from '../utils/errorHandler.js';
import sendToken from '../utils/sendToken.js';
import sendEmail from '../utils/sendEmail.js';
import crypto from 'crypto';

export const register = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) return next(new ErrorHandler('Please fill all fields', 400));

    const exists = await User.findOne({ email });
    if (exists) return next(new ErrorHandler('User already exists', 400));

    const user = await User.create({ name, email, password, phone });
    await Cart.create({ user: user._id, items: [] });
    await Wishlist.create({ user: user._id, products: [] });

    try {
      await sendEmail({
        email: user.email,
        subject: 'Welcome to PetShop 🐾',
        message: `<h1>Welcome ${user.name}!</h1><p>Thank you for joining our pet family.</p>`,
      });
    } catch (e) { console.log('Email error:', e.message); }

    sendToken(user, 201, res);
  } catch (error) { next(error); }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return next(new ErrorHandler('Please enter email & password', 400));

    const user = await User.findOne({ email }).select('+password');
    if (!user) return next(new ErrorHandler('Invalid credentials', 401));

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return next(new ErrorHandler('Invalid credentials', 401));

    sendToken(user, 200, res);
  } catch (error) { next(error); }
};

export const logout = (req, res) => {
  res.cookie('token', null, { expires: new Date(Date.now()), httpOnly: true })
    .status(200).json({ success: true, message: 'Logged out' });
};

export const getMe = async (req, res) => {
  res.status(200).json({ success: true, user: req.user });
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, email, phone, address, pets } = req.body;
    const user = await User.findById(req.user._id);
    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (address) user.address = address;
    if (pets) user.pets = pets;
    await user.save();
    res.status(200).json({ success: true, user });
  } catch (error) { next(error); }
};

export const updatePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');
    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) return next(new ErrorHandler('Old password incorrect', 400));
    user.password = newPassword;
    await user.save();
    sendToken(user, 200, res);
  } catch (error) { next(error); }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return next(new ErrorHandler('User not found', 404));

    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 30 * 60 * 1000;
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;
    await sendEmail({
      email: user.email,
      subject: 'PetShop Password Reset',
      message: `<a href="${resetUrl}">Reset Password</a>`,
    });
    res.status(200).json({ success: true, message: `Email sent to ${user.email}` });
  } catch (error) { next(error); }
};

export const resetPassword = async (req, res, next) => {
  try {
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });
    if (!user) return next(new ErrorHandler('Invalid or expired token', 400));
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    sendToken(user, 200, res);
  } catch (error) { next(error); }
};

// Admin
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json({ success: true, users });
  } catch (error) { next(error); }
};

export const updateUserRole = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return next(new ErrorHandler('User not found', 404));
    user.role = req.body.role;
    await user.save();
    res.status(200).json({ success: true, user });
  } catch (error) { next(error); }
};

export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return next(new ErrorHandler('User not found', 404));
    await user.deleteOne();
    res.status(200).json({ success: true, message: 'User deleted' });
  } catch (error) { next(error); }
};