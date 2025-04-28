import React from 'react';
import { NavLink } from 'react-router-dom';

function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <img src="/images/logo1.png" alt="Logo" className="logo" />
      </div>
      <ul className="sidebar-menu">
        <li>
          <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>
            <i className="fas fa-tachometer-alt"></i>
            <span>Dashboard</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/transactions" className={({ isActive }) => isActive ? 'active' : ''}>
            <i className="fas fa-exchange-alt"></i>
            <span>Transactions</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/analytics" className={({ isActive }) => isActive ? 'active' : ''}>
            <i className="fas fa-chart-bar"></i>
            <span>Analytics</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/settings" className={({ isActive }) => isActive ? 'active' : ''}>
            <i className="fas fa-cog"></i>
            <span>Settings</span>
          </NavLink>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
