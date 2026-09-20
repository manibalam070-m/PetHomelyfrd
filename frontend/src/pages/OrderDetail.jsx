import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, CheckCircle2, MapPin, CreditCard } from 'lucide-react';
import api from '../services/api.js';

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/orders/${id}`).then(({ data }) => setOrder(data.order)).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="pt-32 min-h-screen flex justify-center"><div className="loader" /></div>;
  if (!order) return <div className="pt-32 text-center">Order not found</div>;

  const steps = ['Processing', 'Confirmed', 'Shipped', 'Out for Delivery', 'Delivered'];
  const currentStep = steps.indexOf(order.orderStatus);

  return (
    <div className="pt-28 pb-20 px-4 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-8 mb-6">
          <div className="flex flex-wrap justify-between items-start gap-4 mb-8">
            <div>
              <p className="text-sm text-gray-500">Order ID</p>
              <p className="font-bold text-lg">#{order._id.slice(-8).toUpperCase()}</p>
              <p className="text-sm text-gray-500 mt-1">{new Date(order.createdAt).toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Total Amount</p>
              <p className="font-bold text-2xl text-primary-600">₹{order.totalPrice.toFixed(2)}</p>
            </div>
          </div>

          {/* Progress tracker */}
          <div className="relative flex justify-between mb-8">
            <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 -z-0" />
            <div
              className="absolute top-5 left-0 h-0.5 bg-primary-500 transition-all duration-700"
              style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
            />
            {steps.map((s, i) => (
              <div key={s} className="relative flex flex-col items-center z-10">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  i <= currentStep ? 'bg-primary-500 text-white' : 'bg-white border-2 border-gray-300 text-gray-400'
                }`}>
                  {i < currentStep ? <CheckCircle2 className="w-5 h-5" /> : i + 1}
                </div>
                <p className={`text-xs mt-2 font-medium text-center ${i <= currentStep ? 'text-primary-600' : 'text-gray-400'}`}>{s}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="card p-6">
            <h2 className="font-bold mb-4 flex items-center gap-2"><MapPin className="w-5 h-5 text-primary-500" /> Shipping Address</h2>
            <p className="font-semibold">{order.shippingAddress.fullName}</p>
            <p className="text-gray-600 text-sm">{order.shippingAddress.phone}</p>
            <p className="text-gray-600 text-sm">
              {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.zipCode}, {order.shippingAddress.country}
            </p>
          </div>

          <div className="card p-6">
            <h2 className="font-bold mb-4 flex items-center gap-2"><CreditCard className="w-5 h-5 text-primary-500" /> Payment</h2>
            <p className="text-sm"><span className="text-gray-500">Method:</span> {order.paymentInfo?.method || 'COD'}</p>
            <p className="text-sm"><span className="text-gray-500">Status:</span> {order.paymentInfo?.status || 'Pending'}</p>
          </div>
        </div>

        <div className="card p-6 mt-6">
          <h2 className="font-bold mb-4 flex items-center gap-2"><Package className="w-5 h-5 text-primary-500" /> Order Items</h2>
          <div className="space-y-3">
            {order.orderItems.map((item, i) => (
              <div key={i} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                <img src={item.image} alt="" className="w-16 h-16 rounded-lg object-cover" />
                <div className="flex-1">
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-gray-500">₹{item.price} × {item.quantity}</p>
                </div>
                <p className="font-bold">₹{(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>
          <div className="border-t mt-4 pt-4 space-y-2 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>₹{order.itemsPrice.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>₹{order.shippingPrice.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Tax</span><span>₹{order.taxPrice.toFixed(2)}</span></div>
            <div className="flex justify-between font-bold text-lg"><span>Total</span><span className="text-primary-600">₹{order.totalPrice.toFixed(2)}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}