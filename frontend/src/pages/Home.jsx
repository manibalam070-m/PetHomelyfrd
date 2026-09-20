import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, Truck, Shield, Headphones, RefreshCw, Star } from 'lucide-react';
import api from '../services/api.js';
import ProductCard from '../components/ProductCard.jsx';

const categories = [
  { name: 'Dogs', emoji: '🐕', image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=500&q=80&auto=format&fit=crop' },
  { name: 'Cats', emoji: '🐈', image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=500&q=80&auto=format&fit=crop' },
  { name: 'Birds', emoji: '🦜', image: 'https://images.unsplash.com/photo-1452570053594-1b985d6ea890?w=500&q=80&auto=format&fit=crop' },
  { name: 'Fish', emoji: '🐠', image: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=500&q=80&auto=format&fit=crop' },
  { name: 'Small Pets', emoji: '🐹', image: 'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=500&q=80&auto=format&fit=crop' },
  { name: 'Accessories', emoji: '🎀', image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=500&q=80&auto=format&fit=crop' },
];

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/products/featured')
      .then(({ data }) => setFeatured(data.products || []))
      .catch(() => setFeatured([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Helmet>
        <title>PetShop 🐾 - Premium Pet Store</title>
      </Helmet>

      {/* HERO */}
      <section className="hero-shell relative min-h-[760px] flex items-center overflow-hidden pt-24">
        <div className="absolute inset-0 pointer-events-none opacity-40" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'80\' height=\'80\' viewBox=\'0 0 80 80\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' stroke=\'%23a48f72\' stroke-opacity=\'.22\' stroke-width=\'1\'%3E%3Cpath d=\'M0 40h80M40 0v80\'/%3E%3C/g%3E%3C/svg%3E")' }} />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 grid lg:grid-cols-[0.9fr_1.1fr] gap-14 items-center py-20">
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="eyebrow inline-flex items-center gap-2 bg-white/65 backdrop-blur px-4 py-3 rounded-full text-primary-700 mb-6 border border-white/60"
            >
              <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" /> Thoughtful care, delivered
            </motion.span>
            <h1 className="font-display text-5xl md:text-7xl lg:text-[5.7rem] font-bold mb-6 leading-[0.96] tracking-tight text-stone-900">
              Better days<br />start with <span className="text-primary-600">pets.</span>
            </h1>
            <p className="text-lg md:text-xl text-stone-700 mb-8 max-w-lg leading-relaxed">
              Well-made essentials, honest advice, and a little more joy for every furry, feathery, and scaly friend.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/shop" className="btn-primary flex items-center gap-2">
                Shop Now <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/services" className="btn-outline">Our Services</Link>
            </div>
            <div className="mt-10 flex items-center gap-6">
              <div className="flex -space-x-3">
                {['photo-1558788353-f76d92427f16', 'photo-1548199973-03cce0bbc87b', 'photo-1583337130417-3346a1be7dee', 'photo-1601758228041-f3b2795255f1'].map((photo) => (
                  <img key={photo} src={`https://images.unsplash.com/${photo}?w=100&q=80&auto=format&fit=crop`} alt="" className="w-10 h-10 rounded-full object-cover border-2 border-white" />
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
                </div>
                <p className="text-sm text-gray-600"><b>10,000+</b> Happy Pet Parents</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative lg:pl-6"
          >
            <div className="hero-image-frame relative rounded-[2.2rem] overflow-hidden border-[10px] border-white/80 animate-float">
              <img src="https://images.unsplash.com/photo-1558788353-f76d92427f16?w=1200&q=88&auto=format&fit=crop" alt="Golden retriever enjoying a sunny day" className="w-full aspect-[1.08] object-cover" />
              <div className="absolute inset-x-0 bottom-0 p-6 pt-20 bg-gradient-to-t from-black/70 to-transparent text-white">
                <p className="eyebrow text-white/75 mb-2">A good life, well supplied</p>
                <p className="font-display text-2xl font-bold">Made for their everyday.</p>
              </div>
            </div>
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="absolute -bottom-4 -left-4 glass p-4 shadow-xl"
            >
              <p className="font-bold text-primary-600 text-2xl">50K+</p>
              <p className="text-xs text-gray-600">Products</p>
            </motion.div>
            <motion.div
              animate={{ y: [0, 15, 0] }}
              transition={{ repeat: Infinity, duration: 3, delay: 0.5 }}
              className="absolute -top-4 -right-4 glass p-4 shadow-xl"
            >
              <p className="font-bold text-teal-600 text-2xl">4.9★</p>
              <p className="text-xs text-gray-600">Rated</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="overflow-hidden border-y border-stone-200 bg-stone-900 text-stone-100 py-4">
        <div className="marquee-track flex w-max items-center gap-10 whitespace-nowrap">
          {[...Array(2)].flatMap((_, group) => ['NUTRITION', 'PLAY', 'GROOMING', 'WELLNESS', 'GOOD TIMES'].map((item) => (
            <span key={`${group}-${item}`} className="flex items-center gap-10 text-xs font-bold tracking-[0.22em] text-stone-300">
              {item}<span className="text-primary-400 text-lg">✦</span>
            </span>
          )))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-16 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { Icon: Truck, title: 'Free Shipping', desc: 'On orders over ₹499' },
            { Icon: Shield, title: 'Secure Payment', desc: '100% protected' },
            { Icon: RefreshCw, title: 'Easy Returns', desc: '30-day policy' },
            { Icon: Headphones, title: '24/7 Support', desc: 'Always here for you' },
          ].map(({ Icon, title, desc }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass p-6 text-center hover:shadow-xl transition-all hover:-translate-y-1"
            >
              <div className="w-14 h-14 mx-auto bg-gradient-to-br from-primary-500 to-orange-500 rounded-full flex items-center justify-center mb-3 shadow-lg">
                <Icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-bold mb-1">{title}</h3>
              <p className="text-sm text-gray-600">{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <h2 className="section-title">Shop by <span className="gradient-text">Category</span></h2>
            <p className="text-gray-600">Find everything your pet loves in one place</p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.05, rotate: 3 }}
              >
                <Link to={`/shop?category=${cat.name}`} className="group block card p-6 text-center">
                  <div className="relative w-full aspect-square rounded-2xl overflow-hidden mb-4 shadow-lg">
                    <img src={cat.image} alt={cat.name} className="w-full h-full object-cover transition duration-700 group-hover:scale-110" />
                    <span className="absolute bottom-2 left-2 bg-white/90 rounded-full px-2 py-1 text-sm">{cat.emoji}</span>
                  </div>
                  <p className="font-display font-bold text-lg">{cat.name}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED */}
      <section className="py-20 px-4 bg-gradient-to-br from-white/60 to-orange-50/60">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="section-title">Featured <span className="gradient-text">Products</span></h2>
            <p className="text-gray-600">Handpicked favorites loved by pets</p>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => <div key={i} className="h-80 shimmer rounded-2xl" />)}
            </div>
          ) : featured.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {featured.map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          ) : (
            <div className="text-center py-10 text-gray-500">
              No featured products yet. Add some from the admin panel!
            </div>
          )}
          <div className="text-center mt-10">
            <Link to="/shop" className="btn-primary inline-flex items-center gap-2">
              View All Products <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="max-w-6xl mx-auto rounded-3xl overflow-hidden shadow-2xl relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary-600 via-orange-600 to-teal-600" />
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=1600)', backgroundSize: 'cover' }} />
          <div className="relative px-8 md:px-16 py-16 text-center text-white">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Book a Grooming Session Today!</h2>
            <p className="text-white/90 mb-8 max-w-2xl mx-auto">
              Give your pet the spa treatment they deserve. Professional groomers, safe products, love guaranteed.
            </p>
            <Link to="/appointment" className="bg-white text-primary-600 font-bold px-8 py-4 rounded-full hover:scale-105 transition shadow-xl inline-block">
              Book Now →
            </Link>
          </div>
        </motion.div>
      </section>
    </>
  );
}