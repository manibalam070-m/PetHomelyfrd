import { Link } from 'react-router-dom';
import { PawPrint, MessageCircle, Camera, AtSign, PlayCircle, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <PawPrint className="w-8 h-8 text-primary-500" />
            <span className="text-2xl font-display font-bold gradient-text">PetShop</span>
          </div>
          <p className="text-gray-400 mb-4">Your trusted partner for premium pet care, products, and services since 2010.</p>
          <div className="flex gap-3">
            {[MessageCircle, Camera, AtSign, PlayCircle].map((Icon, i) => (
              <a key={i} href="#" className="w-10 h-10 rounded-full bg-gray-800 hover:bg-primary-500 flex items-center justify-center transition-all duration-300 hover:scale-110">
                <Icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-gray-400">
            <li><Link to="/shop" className="hover:text-primary-500 transition">Shop</Link></li>
            <li><Link to="/services" className="hover:text-primary-500 transition">Services</Link></li>
            <li><Link to="/appointment" className="hover:text-primary-500 transition">Book Appointment</Link></li>
            <li><Link to="/about" className="hover:text-primary-500 transition">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-primary-500 transition">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-4">Categories</h4>
          <ul className="space-y-2 text-gray-400">
            <li><Link to="/shop?category=Dogs" className="hover:text-primary-500 transition">Dogs</Link></li>
            <li><Link to="/shop?category=Cats" className="hover:text-primary-500 transition">Cats</Link></li>
            <li><Link to="/shop?category=Birds" className="hover:text-primary-500 transition">Birds</Link></li>
            <li><Link to="/shop?category=Fish" className="hover:text-primary-500 transition">Fish</Link></li>
            <li><Link to="/shop?category=Accessories" className="hover:text-primary-500 transition">Accessories</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
          <ul className="space-y-3 text-gray-400">
            <li className="flex items-start gap-3"><MapPin className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" /> 123 Pet Street, Mumbai, India</li>
            <li className="flex items-center gap-3"><Phone className="w-5 h-5 text-primary-500" /> +91 98765 43210</li>
            <li className="flex items-center gap-3"><Mail className="w-5 h-5 text-primary-500" /> hello@petshop.com</li>
          </ul>
          <div className="mt-4">
            <p className="text-sm text-gray-400 mb-2">Subscribe to our newsletter</p>
            <form className="flex gap-2">
              <input type="email" placeholder="Your email" className="flex-1 px-3 py-2 bg-gray-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
              <button className="bg-primary-500 hover:bg-primary-600 px-4 rounded-lg transition">→</button>
            </form>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-800 py-6 text-center text-gray-400 text-sm">
        © {new Date().getFullYear()} PetShop. Made with ❤️ for pets. All rights reserved.
      </div>
    </footer>
  );
}