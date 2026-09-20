import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Scissors, HeartPulse, Syringe, GraduationCap, Home, Sun } from 'lucide-react';

const services = [
  { Icon: Scissors, title: 'Grooming', desc: 'Professional grooming with premium products', price: 'From ₹499' },
  { Icon: HeartPulse, title: 'Vet Checkup', desc: 'Complete health examination by certified vets', price: 'From ₹699' },
  { Icon: Syringe, title: 'Vaccination', desc: 'All essential vaccines for your pet', price: 'From ₹399' },
  { Icon: GraduationCap, title: 'Training', desc: 'Obedience and behavior training sessions', price: 'From ₹999' },
  { Icon: Home, title: 'Boarding', desc: 'Safe & comfortable overnight stay', price: 'From ₹799/night' },
  { Icon: Sun, title: 'Day Care', desc: 'Supervised care during the day', price: 'From ₹399/day' },
];

export default function Services() {
  return (
    <div className="pt-28 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <h1 className="section-title">Our <span className="gradient-text">Services</span></h1>
          <p className="text-gray-600 max-w-2xl mx-auto">Complete care for your furry friends under one roof</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map(({ Icon, title, desc, price }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -10 }}
              className="card p-8 text-center group"
            >
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-primary-500 to-teal-500 rounded-3xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition">
                <Icon className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">{title}</h3>
              <p className="text-gray-600 mb-4">{desc}</p>
              <p className="text-2xl font-bold text-primary-600 mb-4">{price}</p>
              <Link to="/appointment" className="btn-outline !py-2 !px-6 text-sm inline-block">Book Now</Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}