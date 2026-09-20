import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Heart, ShoppingCart, Truck, Shield, RotateCcw, Minus, Plus } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import api from '../services/api.js';
import { addToCart } from '../slices/cartSlice.js';
import { toggleWishlist } from '../slices/wishlistSlice.js';
import ProductCard from '../components/ProductCard.jsx';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((s) => s.auth);
  const wishlist = useSelector((s) => s.wishlist.products);

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  useEffect(() => {
    Promise.all([
      api.get(`/products/${id}`),
      api.get(`/products/${id}/related`),
    ]).then(([p, r]) => {
      setProduct(p.data.product);
      setRelated(r.data.products);
    }).catch(() => toast.error('Product not found'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center pt-20"><div className="loader" /></div>;
  if (!product) return <div className="pt-32 text-center">Product not found</div>;

  const inWishlist = wishlist.some((p) => p._id === product._id);
  const finalPrice = product.discountPrice > 0 ? product.discountPrice : product.price;

  const handleAdd = async () => {
    if (!isAuthenticated) { toast.error('Please login first'); return navigate('/login'); }
    try {
      await dispatch(addToCart({ productId: product._id, quantity: qty })).unwrap();
      toast.success('Added to cart!');
    } catch { toast.error('Failed'); }
  };

  const handleBuyNow = async () => {
    if (!isAuthenticated) { toast.error('Please login first'); return navigate('/login'); }
    await dispatch(addToCart({ productId: product._id, quantity: qty })).unwrap();
    navigate('/cart');
  };

  const submitReview = async () => {
    if (!isAuthenticated) { toast.error('Please login'); return; }
    try {
      await api.post(`/reviews/${product._id}`, { rating, comment });
      toast.success('Review submitted!');
      setComment('');
      const { data } = await api.get(`/products/${id}`);
      setProduct(data.product);
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed');
    }
  };

  return (
    <>
      <Helmet><title>{product.name} | PetShop</title></Helmet>
      <div className="pt-28 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 mb-20">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
              <div className="rounded-3xl overflow-hidden shadow-2xl mb-4">
                <img
                  src={product.images?.[activeImg]?.url || 'https://via.placeholder.com/600'}
                  alt={product.name}
                  className="w-full h-[500px] object-cover"
                />
              </div>
              <div className="flex gap-3">
                {product.images?.map((img, i) => (
                  <button key={i} onClick={() => setActiveImg(i)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition ${
                      activeImg === i ? 'border-primary-500 scale-105' : 'border-transparent'
                    }`}>
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}>
              <p className="text-primary-500 font-semibold mb-2">{product.category}</p>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{product.name}</h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-5 h-5 ${i < Math.round(product.ratings) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                  ))}
                </div>
                <span className="text-gray-500">({product.numReviews} reviews)</span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}
                </span>
              </div>

              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-4xl font-bold text-primary-600">₹{finalPrice}</span>
                {product.discountPrice > 0 && (
                  <>
                    <span className="text-xl text-gray-400 line-through">₹{product.price}</span>
                    <span className="bg-red-500 text-white px-2 py-1 rounded text-sm font-bold">
                      {Math.round(((product.price - finalPrice) / product.price) * 100)}% OFF
                    </span>
                  </>
                )}
              </div>

              <p className="text-gray-600 mb-6 leading-relaxed">{product.description}</p>

              <div className="flex items-center gap-4 mb-6">
                <span className="font-semibold">Quantity:</span>
                <div className="flex items-center gap-3 bg-gray-100 rounded-full p-1">
                  <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:bg-primary-500 hover:text-white transition">
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center font-bold">{qty}</span>
                  <button onClick={() => setQty(Math.min(product.stock, qty + 1))} className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:bg-primary-500 hover:text-white transition">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mb-8">
                <button onClick={handleAdd} disabled={product.stock === 0} className="btn-outline flex items-center gap-2 flex-1 justify-center disabled:opacity-50">
                  <ShoppingCart className="w-5 h-5" /> Add to Cart
                </button>
                <button onClick={handleBuyNow} disabled={product.stock === 0} className="btn-primary flex-1 disabled:opacity-50">
                  Buy Now
                </button>
                <button onClick={() => {
                  if (!isAuthenticated) return toast.error('Please login');
                  dispatch(toggleWishlist(product._id));
                }} className="w-14 h-14 rounded-full border-2 border-primary-500 flex items-center justify-center hover:bg-primary-50 transition">
                  <Heart className={`w-6 h-6 ${inWishlist ? 'fill-red-500 text-red-500' : 'text-primary-500'}`} />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                {[
                  { Icon: Truck, label: 'Free Shipping' },
                  { Icon: Shield, label: 'Secure' },
                  { Icon: RotateCcw, label: 'Easy Return' },
                ].map(({ Icon, label }, i) => (
                  <div key={i} className="glass p-3">
                    <Icon className="w-5 h-5 mx-auto mb-1 text-primary-500" />
                    <p className="text-xs font-semibold">{label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Reviews */}
          <div className="mb-20">
            <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                {product.reviews?.length > 0 ? product.reviews.map((r, i) => (
                  <div key={i} className="card p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold">{r.name}</p>
                      <div className="flex">
                        {[...Array(5)].map((_, j) => (
                          <Star key={j} className={`w-4 h-4 ${j < r.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm">{r.comment}</p>
                  </div>
                )) : <p className="text-gray-500">No reviews yet. Be the first to review!</p>}
              </div>
              <div className="card p-6">
                <h3 className="font-bold mb-4">Write a Review</h3>
                <div className="mb-4">
                  <label className="text-sm font-semibold mb-2 block">Rating</label>
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map((r) => (
                      <button key={r} onClick={() => setRating(r)}>
                        <Star className={`w-8 h-8 transition ${r <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                      </button>
                    ))}
                  </div>
                </div>
                <textarea value={comment} onChange={(e) => setComment(e.target.value)}
                  rows="4" placeholder="Share your experience..." className="input-field mb-4" />
                <button onClick={submitReview} className="btn-primary w-full">Submit Review</button>
              </div>
            </div>
          </div>

          {/* Related */}
          {related.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {related.map((p) => <ProductCard key={p._id} product={p} />)}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}