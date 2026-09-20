import { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api.js';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const load = () => api.get('/auth/admin/users').then(({ data }) => setUsers(data.users));
  useEffect(() => { load(); }, []);

  const changeRole = async (id, role) => {
    try { await api.put(`/auth/admin/user/${id}`, { role }); toast.success('Updated'); load(); }
    catch { toast.error('Failed'); }
  };

  const remove = async (id) => {
    if (!confirm('Delete this user?')) return;
    try { await api.delete(`/auth/admin/user/${id}`); toast.success('Deleted'); load(); }
    catch { toast.error('Failed'); }
  };

  return (
    <div className="pt-28 pb-20 px-4 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Manage <span className="gradient-text">Users</span></h1>
        <div className="card overflow-x-auto">
          <table className="w-full">
            <thead className="bg-orange-50">
              <tr>
                <th className="text-left p-4">Avatar</th>
                <th className="text-left p-4">Name</th>
                <th className="text-left p-4">Email</th>
                <th className="text-left p-4">Role</th>
                <th className="text-left p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-t hover:bg-orange-50/50">
                  <td className="p-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-teal-500 text-white flex items-center justify-center font-bold">
                      {u.name?.charAt(0)}
                    </div>
                  </td>
                  <td className="p-4 font-semibold">{u.name}</td>
                  <td className="p-4 text-gray-600">{u.email}</td>
                  <td className="p-4">
                    <select value={u.role} onChange={(e) => changeRole(u._id, e.target.value)} className="input-field !py-1 !px-2 text-sm">
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="p-4">
                    <button onClick={() => remove(u._id)} className="p-2 hover:bg-red-100 rounded-lg text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}