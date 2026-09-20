import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api.js';

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders/my-orders')
      .then(({ data }) => setOrders(data.orders))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  const statusColor = (s) => ({
    Processing: 'bg-yellow-100 text-yellow-700',
    Confirmed: 'bg-blue-100 text-blue-700',
    Shipped: 'bg-indigo-100 text-indigo-700',
    'Out for Delivery': 'bg-purple-100 text-purple-700',
    Delivered: 'bg-green-100 text-green-700',
    Cancelled: 'bg-red-100 text-red-700',
  }[s] || 'bg-gray-100 text-gray-700');

  if (loading) return <div className="pt-32 min-h-screen flex justify-center"><div className="loader" /></div>;

  return (
    <div className="pt-28 pb-20 px-4 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <h1 className="section-title mb-10">My Orders</h1>
        {orders.length === 0 ? (
          <div className="card p-12 text-center">
            <p className="text-5xl mb-4">📦</p>
            <h2 className="text-xl font-bold mb-2">No orders yet</h2>
            <Link to="/shop" className="btn-primary inline-block mt-4">Start Shopping</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, i) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="card p-6"
              >
                <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Order #{order._id.slice(-8).toUpperCase()}</p>
                    <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className={`px-4 py-1 rounded-full text-xs font-bold uppercase ${statusColor(order.orderStatus)}`}>
                    {order.orderStatus}
                  </span>
                </div>
                <div className="flex flex-wrap gap-3 mb-4">
                  {order.orderItems.slice(0, 3).map((item, j) => (
                    <div key={j} className="flex items-center gap-2">
                      <img src={item.image} alt="" className="w-12 h-12 rounded-lg object-cover" />
                      <div className="text-sm">
                        <p className="font-medium line-clamp-1 max-w-[150px]">{item.name}</p>
                        <p className="text-gray-500">x{item.quantity}</p>
                      </div>
                    </div>
                  ))}
                  {order.orderItems.length > 3 && <span className="self-center text-sm text-gray-500">+{order.orderItems.length - 3} more</span>}
                </div>
                <div className="flex justify-between items-center border-t pt-4">
                  <p className="font-bold text-lg text-primary-600">₹{order.totalPrice.toFixed(2)}</p>
                  <Link to={`/order/${order._id}`} className="btn-outline !py-2 !px-4 text-sm">View Details</Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}