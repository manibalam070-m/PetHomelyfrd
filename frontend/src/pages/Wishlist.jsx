import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import ProductCard from '../components/ProductCard.jsx';

export default function Wishlist() {
  const { products } = useSelector((s) => s.wishlist);

  return (
    <div className="pt-28 pb-20 px-4 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="section-title mb-10 flex items-center justify-center gap-3">
          My <span className="gradient-text">Wishlist</span> <Heart className="w-8 h-8 fill-red-500 text-red-500" />
        </h1>
        {products.length === 0 ? (
          <div className="card p-12 text-center max-w-lg mx-auto">
            <Heart className="w-20 h-20 mx-auto text-gray-300 mb-4" />
            <h2 className="text-xl font-bold mb-2">Your wishlist is empty</h2>
            <p className="text-gray-500 mb-6">Add products you love!</p>
            <Link to="/shop" className="btn-primary inline-block">Explore Products</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {products.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}