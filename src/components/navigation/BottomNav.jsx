import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Warehouse, Package, Truck, UserCheck, Send, FileBarChart } from 'lucide-react';

export default function BottomNav() {
  const navItems = [
    { path: '/', label: 'Home', icon: LayoutDashboard },
    { path: '/warehouses', label: 'Warehouses', icon: Warehouse },
    { path: '/inventory', label: 'Stock', icon: Package },
    { path: '/vehicles', label: 'Vehicles', icon: Truck },
    { path: '/drivers', label: 'Drivers', icon: UserCheck },
    { path: '/dispatch', label: 'Dispatch', icon: Send },
    { path: '/reports', label: 'Reports', icon: FileBarChart },
  ];

  return (
    <nav className="bottom-nav">
      <div className="bottom-nav-inner">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
