import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';

export default function AdminRoute({ children }) {
  const { user, loading } = useAuth() || {};
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  const isAdmin = user?.role === 'ADMIN' ||
                  (Array.isArray(user?.authorities) && user.authorities.includes('ROLE_ADMIN'));
  if (!isAdmin) return <div style={{padding:16}}>You are not authorized to access the admin portal.</div>;
  return children;
}
