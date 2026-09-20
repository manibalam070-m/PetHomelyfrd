import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Heart, User, Menu, X, Search, LogOut, PawPrint } from 'lucide-react';
import { logout } from '../slices/authSlice.js';
import toast from 'react-hot-toast';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/shop', label: 'Shop' },
  { to: '/services', label: 'Services' },
  { to: '/appointment', label: 'Book Appointment' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((s) => s.auth);
  const cartCount = useSelector((s) => s.cart.items.reduce((t, i) => t + i.quantity, 0));
  const wishCount = useSelector((s) => s.wishlist.products.length);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/shop?keyword=${encodeURIComponent(searchTerm.trim())}`);
      setSearchOpen(false);
      setSearchTerm('');
    }
  };

  const handleLogout = async () => {
    await dispatch(logout());
    toast.success('Logged out successfully!');
    navigate('/');
  };

  return (
    <>
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-white/90 backdrop-blur-lg shadow-lg py-3' : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <motion.div whileHover={{ rotate: 20, scale: 1.1 }} transition={{ type: 'spring' }}>
              <PawPrint className="w-8 h-8 text-primary-600" />
            </motion.div>
            <span className="text-2xl font-display font-bold gradient-text">PetShop</span>
          </Link>

          <ul className="hidden lg:flex items-center gap-8">
            {navLinks.map((l) => (
              <li key={l.to}>
                <NavLink
                  to={l.to}
                  className={({ isActive }) =>
                    `relative font-medium transition-colors group ${
                      isActive ? 'text-primary-600' : 'text-gray-700 hover:text-primary-600'
                    }`
                  }
                >
                  {l.label}
                  <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-primary-500 transition-all group-hover:w-full" />
                </NavLink>
              </li>
            ))}
            {user?.role === 'admin' && (
              <li>
                <NavLink to="/admin" className="font-semibold text-primary-600 hover:text-primary-700">Admin</NavLink>
              </li>
            )}
          </ul>

          <div className="flex items-center gap-3">
            <button onClick={() => setSearchOpen(!searchOpen)} className="p-2 hover:bg-orange-100 rounded-full transition">
              <Search className="w-5 h-5 text-gray-700" />
            </button>
            {isAuthenticated && (
              <>
                <Link to="/wishlist" className="relative p-2 hover:bg-orange-100 rounded-full transition">
                  <Heart className="w-5 h-5 text-gray-700" />
                  {wishCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold animate-pulse">
                      {wishCount}
                    </span>
                  )}
                </Link>
                <Link to="/cart" className="relative p-2 hover:bg-orange-100 rounded-full transition">
                  <ShoppingCart className="w-5 h-5 text-gray-700" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold animate-pulse">
                      {cartCount}
                    </span>
                  )}
                </Link>
                <div className="relative group">
                  <Link to="/profile" className="flex items-center gap-2 p-2 hover:bg-orange-100 rounded-full transition">
                    <User className="w-5 h-5 text-gray-700" />
                  </Link>
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="px-3 py-2 border-b">
                      <p className="font-semibold text-sm">{user?.name}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    <Link to="/profile" className="block px-3 py-2 text-sm hover:bg-orange-50 rounded-lg">My Profile</Link>
                    <Link to="/my-orders" className="block px-3 py-2 text-sm hover:bg-orange-50 rounded-lg">My Orders</Link>
                    {user?.role === 'admin' && (
                      <Link to="/admin" className="block px-3 py-2 text-sm hover:bg-orange-50 rounded-lg font-semibold text-primary-600">
                        Admin Dashboard
                      </Link>
                    )}
                    <button onClick={handleLogout} className="w-full text-left px-3 py-2 text-sm hover:bg-red-50 rounded-lg text-red-600 flex items-center gap-2">
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                </div>
              </>
            )}
            {!isAuthenticated && (
              <Link to="/login" className="hidden sm:inline-block btn-primary !py-2 !px-5 text-sm">
                Sign In
              </Link>
            )}
            <button onClick={() => setOpen(!open)} className="lg:hidden p-2">
              {open ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Search bar */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-gray-200 bg-white/95 backdrop-blur overflow-hidden"
            >
              <form onSubmit={handleSearch} className="max-w-3xl mx-auto p-4 flex gap-2">
                <input
                  autoFocus
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search for pet products, food, toys..."
                  className="input-field"
                />
                <button type="submit" className="btn-primary !py-3">Search</button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile menu */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween' }}
              className="lg:hidden fixed top-0 right-0 h-screen w-72 bg-white shadow-2xl p-6 z-50"
            >
              <button onClick={() => setOpen(false)} className="absolute top-4 right-4">
                <X className="w-6 h-6" />
              </button>
              <ul className="mt-12 space-y-4">
                {navLinks.map((l) => (
                  <li key={l.to}>
                    <NavLink to={l.to} onClick={() => setOpen(false)}
                      className="block py-3 px-4 rounded-xl hover:bg-orange-50 font-medium">
                      {l.label}
                    </NavLink>
                  </li>
                ))}
                {isAuthenticated && user?.role === 'admin' && (
                  <li><Link to="/admin" onClick={() => setOpen(false)} className="block py-3 px-4 rounded-xl bg-orange-50 font-semibold text-primary-600">Admin Dashboard</Link></li>
                )}
                {!isAuthenticated && (
                  <li>
                    <Link to="/login" onClick={() => setOpen(false)} className="btn-primary block text-center">
                      Sign In
                    </Link>
                  </li>
                )}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
}