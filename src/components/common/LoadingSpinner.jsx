import React from 'react';

export default function LoadingSpinner({ text = 'Loading...' }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon" style={{ animation: 'spin 1s linear infinite' }}>
        ⚙️
      </div>
      <p className="empty-state-desc">{text}</p>
    </div>
  );
}
