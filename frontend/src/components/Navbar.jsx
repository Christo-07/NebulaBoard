import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import '../styles/navbar.css';

export default function Navbar() {
  const { user } = useAuth();

  return (
    <div className="app-bar">
      <Link to="/" className="brand">
        NebulaBoard
      </Link>

      <div className="app-actions">
        <div className="search-bar">
          <input type="text" placeholder="Search..." />
        </div>
        {user && (
          <div className="user-menu">
            <div className="avatar">
              {user.username.charAt(0).toUpperCase()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


