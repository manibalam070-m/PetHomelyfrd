import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const submit = (e) => {
    e.preventDefault();
    toast.success('Message sent! We\'ll get back soon 🐾');
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <div className="pt-28 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <h1 className="section-title">Get in <span className="gradient-text">Touch</span></h1>
          <p className="text-gray-600">We'd love to hear from you</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} className="space-y-6">
            {[
              { Icon: MapPin, title: 'Visit Us', lines: ['123 Pet Street', 'Mumbai, MH 400001', 'India'] },
              { Icon: Phone, title: 'Call Us', lines: ['+91 98765 43210', '+91 98765 43211'] },
              { Icon: Mail, title: 'Email Us', lines: ['hello@petshop.com', 'support@petshop.com'] },
            ].map(({ Icon, title, lines }, i) => (
              <div key={i} className="card p-6 flex gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-orange-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="font-bold mb-1">{title}</h3>
                  {lines.map((l, j) => <p key={j} className="text-gray-600 text-sm">{l}</p>)}
                </div>
              </div>
            ))}
          </motion.div>

          <motion.form
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            onSubmit={submit}
            className="card p-8 space-y-4"
          >
            <h2 className="text-2xl font-bold mb-2">Send a Message</h2>
            <input placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" required />
            <input type="email" placeholder="Your email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field" required />
            <textarea rows="5" placeholder="Your message..." value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="input-field resize-none" required />
            <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
              <Send className="w-5 h-5" /> Send Message
            </button>
          </motion.form>
        </div>
      </div>
    </div>
  );
}