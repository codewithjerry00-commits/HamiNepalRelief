import React from 'react';

export default function Badge({ children, label, variant = 'neutral' }) {
  return (
    <span className={`badge badge-${variant}`}>
      {children || label}
    </span>
  );
}
