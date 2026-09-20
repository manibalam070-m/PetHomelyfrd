import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Phone, PawPrint } from 'lucide-react';
import toast from 'react-hot-toast';
import { register } from '../slices/authSlice.js';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await dispatch(register(form)).unwrap();
      toast.success('Account created! Welcome 🐾');
      navigate('/');
    } catch (err) {
      toast.error(err.message || 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-20 pb-10">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="card p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-teal-500 to-primary-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
              <PawPrint className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Join PetShop</h1>
            <p className="text-gray-500">Create your account today</p>
          </div>

          <form onSubmit={submit} className="space-y-4">
            {[
              { key: 'name', Icon: User, type: 'text', placeholder: 'Full Name' },
              { key: 'email', Icon: Mail, type: 'email', placeholder: 'Email address' },
              { key: 'phone', Icon: Phone, type: 'tel', placeholder: 'Phone number' },
              { key: 'password', Icon: Lock, type: 'password', placeholder: 'Password' },
            ].map(({ key, Icon, ...rest }) => (
              <div key={key} className="relative">
                <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  {...rest}
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  className="input-field pl-11"
                  required={key !== 'phone'}
                />
              </div>
            ))}
            <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}