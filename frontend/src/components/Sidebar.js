import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AlphagnitoLogo from './AlphagnitoLogo';

const navItems = [
  { to: '/dashboard', icon: 'fa-th-large', label: 'Dashboard' },
  { to: '/agents', icon: 'fa-user-tie', label: 'Agents' },
  { to: '/inspectors', icon: 'fa-search', label: 'Inspectors' },
  { to: '/properties', icon: 'fa-building', label: 'Properties' },
  { to: '/inspections', icon: 'fa-clipboard-check', label: 'Inspections' },
  { to: '/reports', icon: 'fa-chart-bar', label: 'Reports' },
  { to: '/audit-logs', icon: 'fa-history', label: 'Audit Logs' },
  { to: '/settings', icon: 'fa-cog', label: 'Settings' },
];

const Sidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <AlphagnitoLogo size={30} />
        <span>Alphagnito</span>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
          >
            <span className="nav-icon"><i className={`fas ${item.icon}`} /></span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button
          className="nav-item"
          style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', color: '#8fa3c4' }}
          onClick={handleLogout}
        >
          <span className="nav-icon"><i className="fas fa-sign-out-alt" /></span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
