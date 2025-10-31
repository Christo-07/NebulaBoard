import { useEffect, useState } from 'react';
import { get, del } from '../api/client';
import { useAuth } from '../context/AuthProvider';

export default function Users(){
  const { user } = useAuth();
  const [rows, setRows] = useState([]);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const loadUsers = async () => {
    setErr('');
    if (!user) return;
    const isAdmin = user?.role === 'ADMIN' ||
                    (Array.isArray(user?.authorities) && user.authorities.includes('ROLE_ADMIN')) ||
                    (Array.isArray(user?.roles) && user.roles.includes('ROLE_ADMIN'));
    if (!isAdmin) {
      // Show only current user
      setRows([user]);
      return;
    }
    try {
      const payload = await get('/users');
      const list = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.content) ? payload.content
        : Array.isArray(payload?.data)    ? payload.data
        : Array.isArray(payload?.items)   ? payload.items
        : [];
      setRows(list);
    } catch (e) {
      setErr(e.message || 'Failed to load users');
    }
  };

  useEffect(() => {
    loadUsers();
  }, [user]);

  const handleDeleteUser = async (userId, username) => {
    if (!confirm(`Are you sure you want to delete user "${username}"?`)) return;

    setLoading(true);
    try {
      await del(`/users/${userId}`);
      setErr('');
      // Reload users after deletion
      await loadUsers();
    } catch (e) {
      setErr(e.message || 'Failed to delete user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="stack gap">
      <header className="page-head">
        <h1 className="page-title">Users</h1>
      </header>

      {err && <div className="badge badge--danger">{err}</div>}

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr><td colSpan={4}><span className="badge">No users</span></td></tr>
            ) : rows.map((u, index) => (
              <tr key={u.id || u.username || index}>
                <td>{u.id}</td>
                <td>{u.username ?? u.name}</td>
                <td>{Array.isArray(u.roles) ? u.roles.join(', ') : (u.role ?? '—')}</td>
                <td>
                  {user?.id !== u.id && (
                    <button
                      className="btn btn--danger"
                      onClick={() => handleDeleteUser(u.id, u.username)}
                      disabled={loading}
                    >
                      {loading ? 'Deleting...' : 'Delete'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
