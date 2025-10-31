import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { authFetch } from '../api/client';

export const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const me = await authFetch('/api/auth/me').then(r => r.json());
        setUser(me);
      } catch (e) {
        // If the token is invalid or expired, clear it
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = async (username, password) => {
    const loginResponse = await authFetch('/api/auth/login', {
      method:'POST',
      body: JSON.stringify({ username, password })
    }).then(r => r.json());
    if (loginResponse.token) {
      localStorage.setItem('token', loginResponse.token);
    }
    localStorage.setItem('username', username);
    const me = await authFetch('/api/auth/me').then(r => r.json());
    setUser(me);
    return me;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      logout,
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

export const isAdmin = (user) =>
  user?.role === 'ADMIN' ||
  (Array.isArray(user?.authorities) && user.authorities.includes('ROLE_ADMIN'));
