import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, User, Mail, Phone, PawPrint } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api.js';

export default function Appointment() {
  const [form, setForm] = useState({
    ownerName: '', email: '', phone: '', petName: '', petType: 'Dog',
    service: 'Grooming', date: '', time: '', notes: '',
  });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/appointments', form);
      toast.success('Appointment booked! Check your email 🐾');
      setForm({ ownerName: '', email: '', phone: '', petName: '', petType: 'Dog', service: 'Grooming', date: '', time: '', notes: '' });
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to book');
    }
    setLoading(false);
  };

  return (
    <div className="pt-28 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <h1 className="section-title">Book an <span className="gradient-text">Appointment</span></h1>
          <p className="text-gray-600">Schedule a service for your beloved pet</p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={submit}
          className="card p-8"
        >
          <div className="grid md:grid-cols-2 gap-4">
            <div className="relative"><User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input placeholder="Your Name" value={form.ownerName} onChange={(e) => setForm({ ...form, ownerName: e.target.value })} className="input-field pl-11" required />
            </div>
            <div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field pl-11" required />
            </div>
            <div className="relative"><Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input-field pl-11" required />
            </div>
            <div className="relative"><PawPrint className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input placeholder="Pet Name" value={form.petName} onChange={(e) => setForm({ ...form, petName: e.target.value })} className="input-field pl-11" required />
            </div>
            <select value={form.petType} onChange={(e) => setForm({ ...form, petType: e.target.value })} className="input-field">
              <option value="Dog">Dog</option>
              <option value="Cat">Cat</option>
              <option value="Bird">Bird</option>
              <option value="Fish">Fish</option>
              <option value="Small Pet">Small Pet</option>
            </select>
            <select value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })} className="input-field">
              {['Grooming', 'Veterinary Checkup', 'Vaccination', 'Training', 'Boarding', 'Day Care'].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
            <div className="relative"><Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="input-field pl-11" required min={new Date().toISOString().split('T')[0]} />
            </div>
            <div className="relative"><Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} className="input-field pl-11" required />
            </div>
          </div>
          <textarea rows="4" placeholder="Additional notes..." value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="input-field resize-none mt-4" />
          <button type="submit" disabled={loading} className="btn-primary w-full mt-6 disabled:opacity-50">
            {loading ? 'Booking...' : 'Book Appointment'}
          </button>
        </motion.form>
      </div>
    </div>
  );
}