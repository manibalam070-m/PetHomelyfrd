import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-20">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-8xl mb-4"
        >🐾</motion.div>
        <h1 className="text-7xl md:text-9xl font-bold gradient-text mb-4">404</h1>
        <h2 className="text-2xl font-bold mb-2">Oops! Page Not Found</h2>
        <p className="text-gray-600 mb-8">Looks like this page ran away with our pets!</p>
        <Link to="/" className="btn-primary inline-block">Go Back Home</Link>
      </motion.div>
    </div>
  );
}