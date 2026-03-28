import React from 'react';
import { useAuth } from '../context/AuthContext';

const Topbar = ({ searchPlaceholder = 'Search agents, inspectors etc' }) => {
  const { user } = useAuth();
  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

  return (
    <header className="topbar">
      <div className="topbar-search">
        <i className="fas fa-search search-icon" />
        <input type="text" placeholder={searchPlaceholder} />
      </div>
      <div className="topbar-right">
        <button className="topbar-icon-btn">
          <i className="fas fa-bell" />
        </button>
        <div className="user-avatar">
          <div className="avatar-circle">{initials}</div>
          <div className="user-info">
            <div className="user-name">{user?.name || 'User'}</div>
            <div className="user-role">{user?.role || 'user'}</div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
