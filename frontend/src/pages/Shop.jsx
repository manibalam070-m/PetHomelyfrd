import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SlidersHorizontal, X } from 'lucide-react';
import api from '../services/api.js';
import ProductCard from '../components/ProductCard.jsx';

const categories = ['Dogs', 'Cats', 'Birds', 'Fish', 'Small Pets', 'Food', 'Toys', 'Accessories', 'Medicine', 'Grooming'];

export default function Shop() {
  const [params, setParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState({
    keyword: params.get('keyword') || '',
    category: params.get('category') || '',
    minPrice: '', maxPrice: '', sort: '', page: 1,
  });

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const query = new URLSearchParams();
        Object.entries(filters).forEach(([k, v]) => { if (v) query.set(k, v); });
        const { data } = await api.get(`/products?${query}`);
        setProducts(data.products || []);
      } catch { setProducts([]); }
      setLoading(false);
    };
    fetchProducts();
  }, [filters]);

  const updateFilter = (key, val) => {
    const nf = { ...filters, [key]: val, page: 1 };
    setFilters(nf);
    const p = new URLSearchParams();
    Object.entries(nf).forEach(([k, v]) => { if (v) p.set(k, v); });
    setParams(p);
  };

  return (
    <div className="pt-28 pb-20 px-4 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="section-title mb-10">
          Our <span className="gradient-text">Products</span>
        </motion.h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className={`lg:w-64 ${showFilter ? 'block' : 'hidden lg:block'}`}>
            <div className="card p-6 sticky top-28">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold flex items-center gap-2"><SlidersHorizontal className="w-4 h-4" /> Filters</h3>
                <button onClick={() => setShowFilter(false)} className="lg:hidden"><X className="w-5 h-5" /></button>
              </div>

              <div className="mb-6">
                <label className="text-sm font-semibold mb-2 block">Search</label>
                <input
                  value={filters.keyword}
                  onChange={(e) => updateFilter('keyword', e.target.value)}
                  placeholder="Search..."
                  className="input-field text-sm"
                />
              </div>

              <div className="mb-6">
                <label className="text-sm font-semibold mb-2 block">Category</label>
                <div className="space-y-2">
                  <button
                    onClick={() => updateFilter('category', '')}
                    className={`block w-full text-left text-sm px-3 py-2 rounded-lg transition ${
                      !filters.category ? 'bg-primary-500 text-white' : 'hover:bg-orange-50'
                    }`}
                  >All</button>
                  {categories.map((c) => (
                    <button
                      key={c}
                      onClick={() => updateFilter('category', c)}
                      className={`block w-full text-left text-sm px-3 py-2 rounded-lg transition ${
                        filters.category === c ? 'bg-primary-500 text-white' : 'hover:bg-orange-50'
                      }`}
                    >{c}</button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="text-sm font-semibold mb-2 block">Price Range</label>
                <div className="flex gap-2">
                  <input type="number" placeholder="Min" value={filters.minPrice}
                    onChange={(e) => updateFilter('minPrice', e.target.value)} className="input-field text-sm !py-2" />
                  <input type="number" placeholder="Max" value={filters.maxPrice}
                    onChange={(e) => updateFilter('maxPrice', e.target.value)} className="input-field text-sm !py-2" />
                </div>
              </div>

              <button onClick={() => setFilters({ keyword: '', category: '', minPrice: '', maxPrice: '', sort: '', page: 1 })}
                className="w-full btn-outline !py-2 text-sm">
                Clear All
              </button>
            </div>
          </aside>

          {/* Products */}
          <div className="flex-1">
            <div className="flex flex-wrap justify-between items-center mb-6 gap-3">
              <button onClick={() => setShowFilter(true)} className="lg:hidden btn-outline !py-2 !px-4 text-sm flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4" /> Filters
              </button>
              <p className="text-sm text-gray-500">{products.length} products found</p>
              <select value={filters.sort} onChange={(e) => updateFilter('sort', e.target.value)} className="input-field !py-2 text-sm max-w-[200px]">
                <option value="">Sort: Newest</option>
                <option value="price">Price: Low to High</option>
                <option value="-price">Price: High to Low</option>
                <option value="-ratings">Top Rated</option>
              </select>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => <div key={i} className="h-80 shimmer rounded-2xl" />)}
              </div>
            ) : products.length === 0 ? (
              <div className="card p-12 text-center">
                <p className="text-4xl mb-4">🔍</p>
                <h3 className="text-xl font-bold mb-2">No products found</h3>
                <p className="text-gray-500">Try adjusting your filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((p) => <ProductCard key={p._id} product={p} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}