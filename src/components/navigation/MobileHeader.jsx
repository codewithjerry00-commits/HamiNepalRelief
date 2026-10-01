import React from 'react';
import { Heart, Settings } from 'lucide-react';

export default function MobileHeader() {
  return (
    <header className="mobile-header">
      <div className="mobile-header-brand">
        <div className="brand-icon" style={{ width: 32, height: 32, borderRadius: 8 }}>
          <Heart size={16} color="white" />
        </div>
        <div className="brand-text">
          <span className="brand-name" style={{ fontSize: '0.75rem' }}>Hami Nepal</span>
          <span className="brand-subtitle" style={{ fontSize: '0.6rem' }}>
            Relief Inventory Tracker
          </span>
        </div>
      </div>
      <button className="btn btn-ghost btn-sm" style={{ padding: 6 }}>
        <Settings size={20} color="var(--color-text-secondary)" />
      </button>
    </header>
  );
}
