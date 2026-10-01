import React from 'react';
import Sidebar from '../navigation/Sidebar';
import BottomNav from '../navigation/BottomNav';
import MobileHeader from '../navigation/MobileHeader';

export default function AppLayout({ children }) {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <MobileHeader />
        <main className="page-wrapper">
          {children}
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
