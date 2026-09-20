import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { CreditCard, Truck, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api.js';
import { clearCart } from '../slices/cartSlice.js';

export default function Checkout() {
  const { items } = useSelector((s) => s.cart);
  const { user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [payment, setPayment] = useState('COD');
  const [address, setAddress] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    zipCode: user?.address?.zipCode || '',
    country: user?.address?.country || 'India',
  });

  const subtotal = items.reduce((t, i) => t + (i.product.discountPrice > 0 ? i.product.discountPrice : i.product.price) * i.quantity, 0);
  const shipping = subtotal > 499 ? 0 : 50;
  const tax = subtotal * 0.05;
  const total = subtotal + shipping + tax;

  const handlePlaceOrder = async () => {
    if (!address.street || !address.city || !address.zipCode) {
      toast.error('Please complete shipping address'); setStep(1); return;
    }
    setLoading(true);
    try {
      const orderItems = items.map((i) => ({
        product: i.product._id,
        name: i.product.name,
        image: i.product.images?.[0]?.url,
        price: i.product.discountPrice > 0 ? i.product.discountPrice : i.product.price,
        quantity: i.quantity,
      }));

      const { data } = await api.post('/orders', {
        orderItems,
        shippingAddress: address,
        paymentInfo: { method: payment, status: payment === 'COD' ? 'Pending' : 'Paid' },
        itemsPrice: subtotal,
        taxPrice: tax,
        shippingPrice: shipping,
        totalPrice: total,
      });

      await dispatch(clearCart()).unwrap();
      toast.success('Order placed successfully! 🎉');
      navigate(`/order/${data.order._id}`);
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-28 pb-20 px-4 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="section-title mb-10">Checkout</h1>

        {/* Steps */}
        <div className="flex items-center justify-center gap-4 mb-12">
          {[
            { n: 1, label: 'Shipping' },
            { n: 2, label: 'Payment' },
            { n: 3, label: 'Review' },
          ].map((s) => (
            <div key={s.n} className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                step >= s.n ? 'bg-primary-500 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                {step > s.n ? <CheckCircle2 className="w-6 h-6" /> : s.n}
              </div>
              <span className={`hidden sm:block font-semibold ${step >= s.n ? 'text-primary-600' : 'text-gray-400'}`}>{s.label}</span>
              {s.n < 3 && <div className={`w-12 h-0.5 ${step > s.n ? 'bg-primary-500' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {step === 1 && (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="card p-6">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Truck /> Shipping Address</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    ['fullName', 'Full Name'],
                    ['phone', 'Phone'],
                    ['street', 'Street Address'],
                    ['city', 'City'],
                    ['state', 'State'],
                    ['zipCode', 'ZIP Code'],
                    ['country', 'Country'],
                  ].map(([key, label]) => (
                    <input
                      key={key}
                      placeholder={label}
                      value={address[key]}
                      onChange={(e) => setAddress({ ...address, [key]: e.target.value })}
                      className="input-field"
                      style={key === 'street' ? { gridColumn: 'span 2' } : {}}
                    />
                  ))}
                </div>
                <button onClick={() => setStep(2)} className="btn-primary mt-6">Continue to Payment</button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="card p-6">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><CreditCard /> Payment Method</h2>
                <div className="space-y-3">
                  {[
                    { v: 'COD', label: 'Cash on Delivery', desc: 'Pay when delivered' },
                    { v: 'Card', label: 'Credit / Debit Card', desc: 'Visa, MasterCard, RuPay' },
                    { v: 'UPI', label: 'UPI Payment', desc: 'PhonePe, GPay, Paytm' },
                  ].map((opt) => (
                    <label key={opt.v} className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition ${
                      payment === opt.v ? 'border-primary-500 bg-orange-50' : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      <input type="radio" checked={payment === opt.v} onChange={() => setPayment(opt.v)} className="accent-primary-500 w-5 h-5" />
                      <div>
                        <p className="font-semibold">{opt.label}</p>
                        <p className="text-sm text-gray-500">{opt.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
                <div className="flex gap-3 mt-6">
                  <button onClick={() => setStep(1)} className="btn-outline">Back</button>
                  <button onClick={() => setStep(3)} className="btn-primary">Review Order</button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="card p-6">
                <h2 className="text-xl font-bold mb-6">Review Your Order</h2>
                <div className="space-y-3 mb-6">
                  {items.map((i) => (
                    <div key={i.product._id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <img src={i.product.images?.[0]?.url} className="w-16 h-16 rounded-lg object-cover" alt="" />
                      <div className="flex-1">
                        <p className="font-semibold">{i.product.name}</p>
                        <p className="text-sm text-gray-500">Qty: {i.quantity}</p>
                      </div>
                      <p className="font-bold">₹{((i.product.discountPrice > 0 ? i.product.discountPrice : i.product.price) * i.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-4 mb-6">
                  <p className="font-semibold mb-2">Ship to:</p>
                  <p className="text-sm text-gray-600">{address.fullName}, {address.phone}</p>
                  <p className="text-sm text-gray-600">{address.street}, {address.city}, {address.state} - {address.zipCode}, {address.country}</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setStep(2)} className="btn-outline">Back</button>
                  <button onClick={handlePlaceOrder} disabled={loading} className="btn-primary flex-1 disabled:opacity-50">
                    {loading ? 'Placing Order...' : `Place Order - ₹${total.toFixed(2)}`}
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          <div>
            <div className="card p-6 sticky top-28">
              <h3 className="font-bold mb-4">Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span>Items ({items.length})</span><span>₹{subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between"><span>Shipping</span><span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span></div>
                <div className="flex justify-between"><span>Tax</span><span>₹{tax.toFixed(2)}</span></div>
                <div className="border-t pt-2 flex justify-between font-bold text-base">
                  <span>Total</span><span className="text-primary-600">₹{total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}