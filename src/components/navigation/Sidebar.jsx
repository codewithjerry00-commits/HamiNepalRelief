import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Warehouse, Package, Truck, UserCheck, Send, FileBarChart, Heart } from 'lucide-react';

export default function Sidebar() {
  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/warehouses', label: 'Warehouses', icon: Warehouse },
    { path: '/inventory', label: 'Inventory', icon: Package },
    { path: '/vehicles', label: 'Vehicles', icon: Truck },
    { path: '/drivers', label: 'Drivers', icon: UserCheck },
    { path: '/dispatch', label: 'Dispatch', icon: Send },
    { path: '/reports', label: 'Reports', icon: FileBarChart },
  ];

  return (
    <aside className="sidebar">
      {/* Brand Header */}
      <div className="sidebar-brand">
        <div className="brand-icon">
          <Heart size={22} color="white" />
        </div>
        <div className="brand-text">
          <span className="brand-name">Hami Nepal</span>
          <span className="brand-subtitle">Relief Inventory Tracker</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className="sidebar-footer">
        <p style={{ fontWeight: 600, color: 'var(--color-primary)' }}>Emergency Hotline</p>
        <p style={{ marginTop: 2, fontWeight: 700, color: 'var(--color-text)' }}>+977-1-4XXXXXX</p>
        <p style={{ marginTop: 2 }}>Kathmandu Control</p>
      </div>
    </aside>
  );
}
