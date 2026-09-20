import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Lock, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api.js';
import { loadUser } from '../slices/authSlice.js';

export default function Profile() {
  const { user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const [tab, setTab] = useState('profile');
  const [form, setForm] = useState({
    name: user?.name || '', email: user?.email || '', phone: user?.phone || '',
    street: user?.address?.street || '', city: user?.address?.city || '',
    state: user?.address?.state || '', zipCode: user?.address?.zipCode || '',
    country: user?.address?.country || 'India',
  });
  const [pw, setPw] = useState({ oldPassword: '', newPassword: '' });

  const saveProfile = async (e) => {
    e.preventDefault();
    try {
      await api.put('/auth/me/update', {
        name: form.name, email: form.email, phone: form.phone,
        address: { street: form.street, city: form.city, state: form.state, zipCode: form.zipCode, country: form.country },
      });
      await dispatch(loadUser()).unwrap();
      toast.success('Profile updated!');
    } catch (e) { toast.error(e.response?.data?.message || 'Failed'); }
  };

  const savePassword = async (e) => {
    e.preventDefault();
    try {
      await api.put('/auth/password/update', pw);
      toast.success('Password updated!');
      setPw({ oldPassword: '', newPassword: '' });
    } catch (e) { toast.error(e.response?.data?.message || 'Failed'); }
  };

  return (
    <div className="pt-28 pb-20 px-4 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-8 mb-6">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-500 to-teal-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
              {user?.name?.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{user?.name}</h1>
              <p className="text-gray-500">{user?.email}</p>
              <span className="inline-block mt-2 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-semibold uppercase">
                {user?.role}
              </span>
            </div>
          </div>
        </motion.div>

        <div className="flex gap-2 mb-6">
          {['profile', 'address', 'password'].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-6 py-2 rounded-full font-semibold capitalize transition ${
                tab === t ? 'bg-primary-500 text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-orange-50'
              }`}
            >{t}</button>
          ))}
        </div>

        <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card p-8">
          {tab === 'profile' && (
            <form onSubmit={saveProfile} className="space-y-4">
              <div className="relative"><User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field pl-11" placeholder="Name" />
              </div>
              <div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field pl-11" placeholder="Email" />
              </div>
              <div className="relative"><Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input-field pl-11" placeholder="Phone" />
              </div>
              <button type="submit" className="btn-primary flex items-center gap-2"><Save className="w-5 h-5" /> Save Profile</button>
            </form>
          )}

          {tab === 'address' && (
            <form onSubmit={saveProfile} className="space-y-4">
              {[
                ['street', 'Street Address'], ['city', 'City'], ['state', 'State'],
                ['zipCode', 'ZIP Code'], ['country', 'Country'],
              ].map(([k, label]) => (
                <div key={k} className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} className="input-field pl-11" placeholder={label} />
                </div>
              ))}
              <button type="submit" className="btn-primary flex items-center gap-2"><Save className="w-5 h-5" /> Save Address</button>
            </form>
          )}

          {tab === 'password' && (
            <form onSubmit={savePassword} className="space-y-4">
              <div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="password" value={pw.oldPassword} onChange={(e) => setPw({ ...pw, oldPassword: e.target.value })} className="input-field pl-11" placeholder="Old Password" required />
              </div>
              <div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="password" value={pw.newPassword} onChange={(e) => setPw({ ...pw, newPassword: e.target.value })} className="input-field pl-11" placeholder="New Password" required />
              </div>
              <button type="submit" className="btn-primary flex items-center gap-2"><Save className="w-5 h-5" /> Update Password</button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}