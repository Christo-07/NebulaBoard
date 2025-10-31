import { useState, useCallback } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthProvider'
import '../styles/Login.css'

export default function Login() {
  const { login } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault()
    if (busy) return
    setBusy(true)
    setError('')
    try {
      await login(username, password)
      navigate('/app', { replace: true })
    } catch (err) {
      setError(err?.message || 'Login failed')
    } finally {
      setBusy(false)
    }
  }, [login, username, password, busy, navigate])

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-form-container">
          <form className="login-form" onSubmit={handleSubmit} autoComplete="off">
            <h2>Welcome back</h2>
            <p>Sign in to your NebulaBoard account</p>
            {error && <div className="login-error">{error}</div>}
            <div className="input-group">
              <label htmlFor="username">Username</label>
              <input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </div>
            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <div className="form-options">
              <div className="remember-me">
                <input type="checkbox" id="remember" name="remember" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
                <label htmlFor="remember">Remember me</label>
              </div>
              <Link to="/forgot-password" className="forgot-password-link">Forgot password?</Link>
            </div>
            <button disabled={busy} type="submit" className="login-button">
              {busy ? <div className="spinner"></div> : 'Sign in'}
            </button>
            <div className="muted-link">
              Don’t have an account? <Link to="/register">Register</Link>
            </div>
          </form>
        </div>
        <div className="login-image-container">
          <img src="https://placehold.co/600x800/0f1216/white?text=NebulaBoard" alt="NebulaBoard" />
        </div>
      </div>
    </div>
  )
}
