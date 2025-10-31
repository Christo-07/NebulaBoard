import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthProvider'
import { RequireAuth, RequireAdmin } from './components/ProtectedRoute'

import App from './App'           // your layout with header
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Projects from './pages/Projects'
import Board from './pages/Board'
import AdminHome from './pages/AdminHome'
import './styles/index.css'
import './styles/navbar.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<App />}>
            {/* public pages */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* protected pages */}
            <Route
              path="/app"
              element={<RequireAuth><Projects /></RequireAuth>}
            />
            <Route
              path="/app/projects/:id"
              element={<RequireAuth><Board /></RequireAuth>}
            />
            <Route
              path="/admin"
              element={<RequireAdmin><AdminHome /></RequireAdmin>}
            />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
)
