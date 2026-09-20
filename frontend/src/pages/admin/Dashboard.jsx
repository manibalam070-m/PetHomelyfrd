import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, Users, ShoppingBag, Calendar, TrendingUp } from 'lucide-react';
import api from '../../services/api.js';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ products: 0, users: 0, orders: 0, revenue: 0, appointments: 0 });

  useEffect(() => {
    Promise.allSettled([
      api.get('/products?limit=1'),
      api.get('/auth/admin/users'),
      api.get('/orders/admin/all'),
      api.get('/appointments/admin/all'),
    ]).then(([p, u, o, a]) => {
      setStats({
        products: p.value?.data?.productsCount || 0,
        users: u.value?.data?.users?.length || 0,
        orders: o.value?.data?.orders?.length || 0,
        revenue: o.value?.data?.totalAmount || 0,
        appointments: a.value?.data?.appointments?.length || 0,
      });
    });
  }, []);

  const cards = [
    { Icon: Package, title: 'Products', value: stats.products, color: 'from-blue-500 to-cyan-500', link: '/admin/products' },
    { Icon: ShoppingBag, title: 'Orders', value: stats.orders, color: 'from-orange-500 to-red-500', link: '/admin/orders' },
    { Icon: Users, title: 'Users', value: stats.users, color: 'from-purple-500 to-pink-500', link: '/admin/users' },
    { Icon: Calendar, title: 'Appointments', value: stats.appointments, color: 'from-teal-500 to-green-500', link: '/admin/appointments' },
  ];

  return (
    <div className="pt-28 pb-20 px-4 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <h1 className="text-4xl font-bold mb-2">Admin <span className="gradient-text">Dashboard</span></h1>
          <p className="text-gray-600">Overview of your store performance</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {cards.map(({ Icon, title, value, color, link }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <Link to={link} className="card p-6 block">
                <div className={`w-14 h-14 bg-gradient-to-br ${color} rounded-2xl flex items-center justify-center mb-4 shadow-lg`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <p className="text-gray-500 text-sm">{title}</p>
                <p className="text-3xl font-bold">{value}</p>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="card p-8 bg-gradient-to-br from-primary-500 to-teal-500 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="opacity-90">Total Revenue</p>
              <p className="text-4xl font-bold mt-1">₹{stats.revenue.toFixed(2)}</p>
            </div>
            <TrendingUp className="w-16 h-16 opacity-50" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}