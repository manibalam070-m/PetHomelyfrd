import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../../services/api.js';

const STATUSES = ['Pending', 'Confirmed', 'Completed', 'Cancelled'];

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);
  const load = () => api.get('/appointments/admin/all').then(({ data }) => setAppointments(data.appointments));
  useEffect(() => { load(); }, []);

  const updateStatus = async (id, status) => {
    try { await api.put(`/appointments/admin/${id}`, { status }); toast.success('Updated'); load(); }
    catch { toast.error('Failed'); }
  };

  return (
    <div className="pt-28 pb-20 px-4 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Manage <span className="gradient-text">Appointments</span></h1>
        <div className="grid md:grid-cols-2 gap-4">
          {appointments.map((a, i) => (
            <motion.div key={a._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="card p-6">
              <div className="flex justify-between mb-3">
                <div>
                  <p className="font-bold text-lg">{a.ownerName}</p>
                  <p className="text-sm text-gray-500">{a.email} · {a.phone}</p>
                </div>
                <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold h-fit">{a.service}</span>
              </div>
              <div className="text-sm space-y-1 mb-4">
                <p>🐾 Pet: <span className="font-semibold">{a.petName} ({a.petType})</span></p>
                <p>📅 {new Date(a.date).toDateString()} at {a.time}</p>
                {a.notes && <p className="text-gray-500 italic">"{a.notes}"</p>}
              </div>
              <div className="flex flex-wrap gap-2">
                {STATUSES.map((s) => (
                  <button key={s} onClick={() => updateStatus(a._id, s)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                      a.status === s ? 'bg-primary-500 text-white' : 'bg-gray-100 hover:bg-orange-100'
                    }`}
                  >{s}</button>
                ))}
              </div>
            </motion.div>
          ))}
          {appointments.length === 0 && <div className="card p-12 text-center text-gray-500 md:col-span-2">No appointments yet</div>}
        </div>
      </div>
    </div>
  );
}