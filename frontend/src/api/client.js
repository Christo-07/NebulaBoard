// All requests go through Vite proxy to Spring Boot at 8080
const BASE_URL = '' // leave empty when using the proxy

function getToken() { return localStorage.getItem('token') }
function setToken(t) { t ? localStorage.setItem('token', t) : localStorage.removeItem('token') }

export async function authFetch(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) }
  const token = getToken()
  if (token) headers.Authorization = `Bearer ${token}`

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers })
  if (!res.ok) {
    // 401/403 → clear token (session expired, bad token, etc.)
    if (res.status === 401 || res.status === 403) setToken(null)
    let msg = `${res.status} ${res.statusText}`
    try {
      const text = await res.text()
      if (text) {
        try {
          const j = JSON.parse(text)
          msg = j.error || j.message || text
        } catch { msg = text }
      }
    } catch {}
    throw new Error(msg)
  }
  return res
}

/* -------- Auth -------- */
export async function login(username, password) {
  const r = await authFetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  })
  const data = await r.json()
  if (data?.token) setToken(data.token)
  return data
}

export async function me() {
  return authFetch('/api/auth/me', { method: 'GET' }).then(r => r.json())
}

export async function register(username, password) {
  return authFetch('/api/auth/register', {
    method:'POST',
    body: JSON.stringify({ username, password })
  }).then(r => r.json());
}

export function logout() { setToken(null) }

/* -------- Optional helpers -------- */
export const get = (p) => authFetch(p, { method: 'GET' }).then(r => r.json())
export const post = (p, b) => authFetch(p, { method: 'POST', body: JSON.stringify(b) }).then(r => r.json())
export const put = (p, b) => authFetch(p, { method: 'PUT', body: JSON.stringify(b) }).then(r => r.json())
export const patch = (p, b) => authFetch(p, { method: 'PATCH', body: JSON.stringify(b) }).then(r => r.json())
export const del = (p) => authFetch(p, { method: 'DELETE' }).then(r => r.text())

const api = { get, post, put, patch, delete: del }
export default api
