import { NavLink } from 'react-router-dom';

const linkClass = ({ isActive }) =>
  'side-link' + (isActive ? ' is-active' : '');

export default function AdminSidebar(){
  return (
    <aside className="admin-sidebar" aria-label="Sidebar">
      <nav className="side-nav">
        <NavLink to="/app" end className={linkClass}>Dashboard</NavLink>
        <NavLink to="/app/projects" className={linkClass}>Boards</NavLink>
        <NavLink to="/app/users" className={linkClass}>Users</NavLink>
      </nav>
    </aside>
  );
}
