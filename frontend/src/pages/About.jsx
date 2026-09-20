import { motion } from 'framer-motion';
import { Heart, Award, Users } from 'lucide-react';

export default function About() {
  return (
    <div className="pt-28 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <h1 className="section-title">About <span className="gradient-text">PetShop</span></h1>
          <p className="text-gray-600 max-w-2xl mx-auto">Since 2010, we've been dedicated to providing the best products and services for your beloved pets.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <motion.img
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            src="https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800"
            alt=""
            className="rounded-3xl shadow-2xl"
          />
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }}>
            <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
            <p className="text-gray-600 mb-4">
              We believe every pet deserves the best. From premium nutrition to expert grooming,
              we curate only the finest products from trusted brands worldwide.
            </p>
            <p className="text-gray-600 mb-6">
              Our team of pet lovers and certified veterinarians work tirelessly to ensure
              every product we offer meets the highest standards of quality and safety.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { num: '10K+', label: 'Happy Pets' },
                { num: '5K+', label: 'Products' },
                { num: '15+', label: 'Years Experience' },
                { num: '50+', label: 'Expert Staff' },
              ].map((s, i) => (
                <div key={i} className="glass p-4 text-center">
                  <p className="text-2xl font-bold text-primary-600">{s.num}</p>
                  <p className="text-sm text-gray-600">{s.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            { Icon: Heart, title: 'Pet First', desc: 'Every decision starts with what\'s best for pets' },
            { Icon: Award, title: 'Premium Quality', desc: 'Only trusted brands and verified products' },
            { Icon: Users, title: 'Expert Team', desc: 'Certified vets and grooming professionals' },
          ].map(({ Icon, title, desc }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
              className="card p-8 text-center hover:-translate-y-2 transition-transform"
            >
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary-500 to-teal-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                <Icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">{title}</h3>
              <p className="text-gray-600">{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}