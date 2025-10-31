// frontend/src/components/Header.jsx
import React from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthProvider'

export default function Header() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function onLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  const isAdmin = !!user?.roles?.some(r => r === 'ROLE_ADMIN' || r === 'ADMIN')

  return (
    <header className="app-bar">
      <Link to="/" className="brand">
        NebulaBoard
      </Link>

      <nav className="app-actions">
        <NavLink to="/app" aria-current={({isActive}) => isActive ? 'page' : undefined}>
          Projects
        </NavLink>
        {isAdmin && (
          <NavLink to="/admin" aria-current={({isActive}) => isActive ? 'page' : undefined}>
            Admin
          </NavLink>
        )}

        {user ? (
          <>
            <span className="badge">
              {user.username} · {isAdmin ? 'ADMIN' : 'USER'}
            </span>
            <button className="btn btn--ghost" onClick={onLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link className="btn btn--ghost" to="/login">Login</Link>
            <Link className="btn btn--primary" to="/register">Register</Link>
          </>
        )}
      </nav>
    </header>
  )
}
