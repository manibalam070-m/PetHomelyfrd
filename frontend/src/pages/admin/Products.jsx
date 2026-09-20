import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, X, Star, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api.js';

const CATEGORIES = ['Dogs', 'Cats', 'Birds', 'Fish', 'Small Pets', 'Food', 'Toys', 'Accessories', 'Medicine', 'Grooming'];

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    name: '', description: '', price: '', discountPrice: '', category: 'Dogs',
    stock: '', brand: '', isFeatured: false, tags: '',
    imageUrl: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=500',
  });

  const load = () => {
    setLoading(true);
    api.get('/products?limit=100').then(({ data }) => setProducts(data.products)).finally(() => setLoading(false));
  };

  useEffect(() => {
    api.get('/products?limit=100')
      .then(({ data }) => setProducts(data.products))
      .finally(() => setLoading(false));
  }, []);

  const openModal = (p = null) => {
    if (p) {
      setEditing(p._id);
      setForm({
        name: p.name, description: p.description, price: p.price, discountPrice: p.discountPrice || '',
        category: p.category, stock: p.stock, brand: p.brand || '', isFeatured: p.isFeatured,
        tags: (p.tags || []).join(', '), imageUrl: p.images?.[0]?.url || '',
      });
    } else {
      setEditing(null);
      setForm({
        name: '', description: '', price: '', discountPrice: '', category: 'Dogs',
        stock: '', brand: '', isFeatured: false, tags: '',
        imageUrl: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=500',
      });
    }
    setShowModal(true);
  };

  const submit = async (e) => {
    e.preventDefault();
    const body = {
      ...form,
      price: Number(form.price),
      discountPrice: Number(form.discountPrice) || 0,
      stock: Number(form.stock),
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      images: [{ url: form.imageUrl, public_id: 'img_' + Date.now() }],
    };
    try {
      if (editing) {
        await api.put(`/products/${editing}`, body);
        toast.success('Product updated!');
      } else {
        await api.post('/products', body);
        toast.success('Product created!');
      }
      setShowModal(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const remove = async (id) => {
    if (!confirm('Delete this product?')) return;
    try { await api.delete(`/products/${id}`); toast.success('Deleted'); load(); }
    catch { toast.error('Failed'); }
  };

  return (
    <div className="pt-28 pb-20 px-4 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
          <h1 className="text-4xl font-bold">Manage <span className="gradient-text">Products</span></h1>
          <button onClick={() => openModal()} className="btn-primary flex items-center gap-2">
            <Plus className="w-5 h-5" /> Add Product
          </button>
        </div>

        {loading ? <div className="loader mx-auto" /> : (
          <div className="card overflow-x-auto">
            <table className="w-full">
              <thead className="bg-orange-50">
                <tr>
                  <th className="text-left p-4">Image</th>
                  <th className="text-left p-4">Name</th>
                  <th className="text-left p-4">Category</th>
                  <th className="text-left p-4">Price</th>
                  <th className="text-left p-4">Stock</th>
                  <th className="text-left p-4">Featured</th>
                  <th className="text-left p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p._id} className="border-t hover:bg-orange-50/50 transition">
                    <td className="p-4">
                      <img src={p.images?.[0]?.url} className="w-14 h-14 rounded-lg object-cover" alt="" />
                    </td>
                    <td className="p-4 font-semibold">{p.name}</td>
                    <td className="p-4"><span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs">{p.category}</span></td>
                    <td className="p-4 font-semibold text-primary-600">₹{p.discountPrice > 0 ? p.discountPrice : p.price}</td>
                    <td className="p-4">{p.stock}</td>
                    <td className="p-4">{p.isFeatured ? <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" /> : '—'}</td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Link to={`/product/${p._id}`} className="p-2 hover:bg-green-100 rounded-lg text-green-600 transition" title="View product">
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button onClick={() => openModal(p)} className="p-2 hover:bg-blue-100 rounded-lg text-blue-600 transition">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => remove(p._id)} className="p-2 hover:bg-red-100 rounded-lg text-red-600 transition">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <AnimatePresence>
          {showModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 30 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 30 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">{editing ? 'Edit' : 'Add'} Product</h2>
                  <button onClick={() => setShowModal(false)}><X /></button>
                </div>
                <form onSubmit={submit} className="space-y-4">
                  <input placeholder="Product Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" required />
                  <textarea placeholder="Description" rows="3" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field resize-none" required />
                  <div className="grid grid-cols-2 gap-4">
                    <input type="number" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="input-field" required />
                    <input type="number" placeholder="Discount Price (optional)" value={form.discountPrice} onChange={(e) => setForm({ ...form, discountPrice: e.target.value })} className="input-field" />
                    <input type="number" placeholder="Stock" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="input-field" required />
                    <input placeholder="Brand" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} className="input-field" />
                  </div>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-field">
                    {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                  <input placeholder="Image URL" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} className="input-field" />
                  {form.imageUrl && <img src={form.imageUrl} className="w-32 h-32 rounded-lg object-cover" alt="preview" />}
                  <input placeholder="Tags (comma separated)" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} className="input-field" />
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} className="accent-primary-500 w-5 h-5" />
                    <span>Feature on homepage</span>
                  </label>
                  <button type="submit" className="btn-primary w-full">{editing ? 'Update' : 'Create'} Product</button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}