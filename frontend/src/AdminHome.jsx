// frontend/src/pages/admin/AdminHome.jsx
import Header from './layout/Header'
import { useAuth } from '../context/AuthProvider'
import { Link } from 'react-router-dom'
import './styles/AdminHome.css'

export default function AdminHome() {
  const { user } = useAuth()

  return (
    <div className="bg-light min-vh-100">
      <Header />
      <main className="container py-4">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h1 className="h3 mb-0">Admin Portal</h1>
          <span className="badge text-bg-secondary">
            {user?.username} · {user?.roles?.[0] || 'ROLE_ADMIN'}
          </span>
        </div>

        <div className="row g-3">
          <div className="col-md-6">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <h5 className="card-title">Projects</h5>
                <p className="text-muted">
                  Use the standard Projects UI to create and manage projects.
                </p>
                <Link to="/app" className="btn btn-primary">Go to Projects</Link>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <h5 className="card-title">User Management (future)</h5>
                <p className="text-muted mb-0">
                  Placeholder for admin-only features (manage users, roles, reports, etc.)
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="alert alert-info mt-4 mb-0">
          Admin-only actions (create/move/edit/delete) are enforced by the backend and will
          only show in the UI for admins.
        </div>
      </main>
    </div>
  )
}
