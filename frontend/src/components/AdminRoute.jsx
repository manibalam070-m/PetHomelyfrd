import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

export default function AdminRoute({ children }) {
  const { isAuthenticated, user, loading } = useSelector((s) => s.auth);
  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="loader" /></div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== 'admin') return <Navigate to="/" replace />;
  return children;
}