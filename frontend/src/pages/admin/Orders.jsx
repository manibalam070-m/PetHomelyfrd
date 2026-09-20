import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../../services/api.js';

const STATUSES = ['Processing', 'Confirmed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);

  const load = () => api.get('/orders/admin/all').then(({ data }) => setOrders(data.orders));
  useEffect(() => { load(); }, []);

  const updateStatus = async (id, status) => {
    try { await api.put(`/orders/admin/${id}`, { status }); toast.success('Updated'); load(); }
    catch { toast.error('Failed'); }
  };

  return (
    <div className="pt-28 pb-20 px-4 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Manage <span className="gradient-text">Orders</span></h1>
        <div className="space-y-4">
          {orders.map((o, i) => (
            <motion.div
              key={o._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="card p-6"
            >
              <div className="flex flex-wrap justify-between gap-4 mb-4">
                <div>
                  <p className="font-semibold">#{o._id.slice(-8).toUpperCase()}</p>
                  <p className="text-sm text-gray-500">{o.user?.name} · {o.user?.email}</p>
                  <p className="text-xs text-gray-400">{new Date(o.createdAt).toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg text-primary-600">₹{o.totalPrice.toFixed(2)}</p>
                  <p className="text-sm text-gray-500">{o.orderItems.length} items</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-sm text-gray-500">Status:</span>
                {STATUSES.map((s) => (
                  <button
                    key={s}
                    onClick={() => updateStatus(o._id, s)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                      o.orderStatus === s ? 'bg-primary-500 text-white' : 'bg-gray-100 hover:bg-orange-100 text-gray-600'
                    }`}
                  >{s}</button>
                ))}
              </div>
            </motion.div>
          ))}
          {orders.length === 0 && <div className="card p-12 text-center text-gray-500">No orders yet</div>}
        </div>
      </div>
    </div>
  );
}