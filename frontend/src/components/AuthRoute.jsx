import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';

export default function AuthRoute({ children }) {
  const { user, loading } = useAuth() || {};
  if (loading) return null;            // or a spinner
  if (!user) return <Navigate to="/login" replace />;
  return children;
}
