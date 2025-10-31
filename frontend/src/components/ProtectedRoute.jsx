import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthProvider'

export function RequireAuth({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div style={{ padding: 24 }}>Loading…</div>
  return user ? children : <Navigate to="/login" replace />
}

export function RequireAdmin({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div style={{ padding: 24 }}>Loading…</div>
  return user?.roles?.includes('ROLE_ADMIN') ? children : <Navigate to="/app" replace />
}
