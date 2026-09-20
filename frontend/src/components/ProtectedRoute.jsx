import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useSelector((s) => s.auth);
  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="loader" /></div>;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}