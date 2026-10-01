import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/navigation/Sidebar';
import BottomNav from './components/navigation/BottomNav';
import MobileHeader from './components/navigation/MobileHeader';
import Dashboard from './pages/Dashboard';
import Warehouses from './pages/Warehouses';
import WarehouseDetails from './pages/WarehouseDetails';
import Inventory from './pages/Inventory';
import Vehicles from './pages/Vehicles';
import Drivers from './pages/Drivers';
import Dispatch from './pages/Dispatch';
import Reports from './pages/Reports';

export default function App() {
  return (
    <div className="app-shell">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="main-content">
        {/* Mobile Header */}
        <MobileHeader />

        {/* Scrollable Page Body */}
        <div className="page-wrapper">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/warehouses" element={<Warehouses />} />
            <Route path="/warehouses/:id" element={<WarehouseDetails />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/vehicles" element={<Vehicles />} />
            <Route path="/drivers" element={<Drivers />} />
            <Route path="/dispatch" element={<Dispatch />} />
            <Route path="/reports" element={<Reports />} />
          </Routes>
        </div>

        {/* Mobile Bottom Navigation */}
        <BottomNav />
      </div>
    </div>
  );
}
