import Wishlist from '../models/Wishlist.js';
import ErrorHandler from '../utils/errorHandler.js';

export const getWishlist = async (req, res, next) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id }).populate('products');
    if (!wishlist) wishlist = await Wishlist.create({ user: req.user._id, products: [] });
    res.status(200).json({ success: true, wishlist });
  } catch (error) { next(error); }
};

export const toggleWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body;
    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) wishlist = await Wishlist.create({ user: req.user._id, products: [] });

    const idx = wishlist.products.findIndex((p) => p.toString() === productId);
    let added;
    if (idx > -1) { wishlist.products.splice(idx, 1); added = false; }
    else { wishlist.products.push(productId); added = true; }

    await wishlist.save();
    await wishlist.populate('products');
    res.status(200).json({ success: true, wishlist, added });
  } catch (error) { next(error); }
};