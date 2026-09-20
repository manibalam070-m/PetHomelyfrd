import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../slices/cartSlice.js';
import { toggleWishlist } from '../slices/wishlistSlice.js';
import toast from 'react-hot-toast';

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((s) => s.auth);
  const wishlist = useSelector((s) => s.wishlist.products);
  const inWishlist = wishlist.some((p) => p._id === product._id);
  const discount = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const handleAddCart = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) return toast.error('Please login first');
    try {
      await dispatch(addToCart({ productId: product._id, quantity: 1 })).unwrap();
      toast.success('Added to cart!');
    } catch { toast.error('Failed to add'); }
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) return toast.error('Please login first');
    try {
      await dispatch(toggleWishlist(product._id)).unwrap();
      toast.success(inWishlist ? 'Removed from wishlist' : 'Added to wishlist');
    } catch { toast.error('Failed'); }
  };

  return (
    <motion.div
      whileHover={{ y: -10 }}
      transition={{ type: 'spring', stiffness: 300 }}
      className="card group"
    >
      <Link to={`/product/${product._id}`}>
        <div className="relative overflow-hidden h-56">
          <img
            src={product.images?.[0]?.url || 'https://via.placeholder.com/400'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          {discount > 0 && (
            <span className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
              -{discount}%
            </span>
          )}
          <button
            onClick={handleWishlist}
            className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/90 backdrop-blur flex items-center justify-center hover:bg-white transition"
          >
            <Heart className={`w-5 h-5 transition ${inWishlist ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
          </button>
        </div>
        <div className="p-5">
          <p className="text-xs uppercase text-primary-500 font-semibold mb-1">{product.category}</p>
          <h3 className="font-semibold text-lg mb-2 line-clamp-1 group-hover:text-primary-600 transition">
            {product.name}
          </h3>
          <div className="flex items-center gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-4 h-4 ${i < Math.round(product.ratings) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
            ))}
            <span className="text-sm text-gray-500 ml-1">({product.numReviews})</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              {product.discountPrice > 0 ? (
                <>
                  <span className="text-xl font-bold text-primary-600">₹{product.discountPrice}</span>
                  <span className="text-sm text-gray-400 line-through ml-2">₹{product.price}</span>
                </>
              ) : (
                <span className="text-xl font-bold text-primary-600">₹{product.price}</span>
              )}
            </div>
            <button
              onClick={handleAddCart}
              className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-500 to-orange-500 text-white flex items-center justify-center hover:scale-110 transition shadow-lg"
            >
              <ShoppingCart className="w-5 h-5" />
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}