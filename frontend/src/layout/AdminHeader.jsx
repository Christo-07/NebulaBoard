import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';

export default function AdminHeader(){
  const { user, logout } = useAuth() || {};
  return (
    <header className="admin-header">
      <div className="admin-brand">
        <Link to="/app" className="brand-link">Admin</Link>
      </div>
      <nav className="admin-topnav">
        <Link to="/app" className="btn">Home</Link>
        <Link to="/app/projects" className="btn">Boards</Link>
        <Link to="/app/users" className="btn">Users</Link>
        {user ? (
          <button className="btn" onClick={logout}>Logout</button>
        ) : (
          <Link className="btn" to="/login">Login</Link>
        )}
      </nav>
    </header>
  );
}
