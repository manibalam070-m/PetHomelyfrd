import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { updateCartQty, removeCartItem } from '../slices/cartSlice.js';
import toast from 'react-hot-toast';

export default function Cart() {
  const { items } = useSelector((s) => s.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const subtotal = items.reduce((t, i) => t + (i.product.discountPrice > 0 ? i.product.discountPrice : i.product.price) * i.quantity, 0);
  const shipping = subtotal > 499 ? 0 : 50;
  const tax = subtotal * 0.05;
  const total = subtotal + shipping + tax;

  const updateQty = async (productId, qty) => {
    if (qty < 1) return;
    try { await dispatch(updateCartQty({ productId, quantity: qty })).unwrap(); }
    catch { toast.error('Failed'); }
  };

  const remove = async (productId) => {
    try { await dispatch(removeCartItem(productId)).unwrap(); toast.success('Removed'); }
    catch { toast.error('Failed'); }
  };

  if (items.length === 0) {
    return (
      <div className="pt-32 pb-20 px-4 min-h-screen">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-lg mx-auto card p-12 text-center">
          <ShoppingBag className="w-24 h-24 mx-auto text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-6">Add some products to get started!</p>
          <Link to="/shop" className="btn-primary inline-flex items-center gap-2">
            Shop Now <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-20 px-4 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="section-title mb-10">Shopping <span className="gradient-text">Cart</span></h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, i) => {
              const p = item.product;
              const price = p.discountPrice > 0 ? p.discountPrice : p.price;
              return (
                <motion.div
                  key={p._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="card p-4 flex flex-col sm:flex-row gap-4 items-center"
                >
                  <img src={p.images?.[0]?.url} alt={p.name} className="w-24 h-24 rounded-xl object-cover" />
                  <div className="flex-1">
                    <Link to={`/product/${p._id}`} className="font-semibold text-lg hover:text-primary-600 transition">{p.name}</Link>
                    <p className="text-sm text-gray-500">{p.category}</p>
                    <p className="font-bold text-primary-600 mt-1">₹{price}</p>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-100 rounded-full p-1">
                    <button onClick={() => updateQty(p._id, item.quantity - 1)} className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:bg-primary-500 hover:text-white transition">
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center font-bold">{item.quantity}</span>
                    <button onClick={() => updateQty(p._id, item.quantity + 1)} className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:bg-primary-500 hover:text-white transition">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="font-bold text-lg min-w-[100px] text-right">₹{(price * item.quantity).toFixed(2)}</p>
                  <button onClick={() => remove(p._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-full transition">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </motion.div>
              );
            })}
          </div>

          <div className="lg:col-span-1">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-6 sticky top-28">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between"><span>Shipping</span><span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span></div>
                <div className="flex justify-between"><span>Tax (5%)</span><span>₹{tax.toFixed(2)}</span></div>
                <div className="border-t pt-3 flex justify-between font-bold text-lg">
                  <span>Total</span><span className="text-primary-600">₹{total.toFixed(2)}</span>
                </div>
              </div>
              <button onClick={() => navigate('/checkout')} className="btn-primary w-full flex items-center justify-center gap-2">
                Proceed to Checkout <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}