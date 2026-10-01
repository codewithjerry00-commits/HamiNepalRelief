import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

export default function ConfirmDialog({ isOpen, onClose, onConfirm, title, message, confirmText = 'Delete', loading = false }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay centered">
      <div className="modal">
        <div className="modal-header">
          <div className="flex items-center gap-2">
            <AlertTriangle size={20} color="var(--color-danger)" />
            <h3 className="modal-title">{title || 'Confirm Action'}</h3>
          </div>
          <button onClick={onClose} className="modal-close">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <p className="text-sm text-secondary">
            {message || 'Are you sure you want to proceed? This action cannot be undone.'}
          </p>
        </div>

        <div className="modal-footer">
          <button type="button" onClick={onClose} disabled={loading} className="btn btn-secondary btn-sm">
            Cancel
          </button>
          <button type="button" onClick={onConfirm} disabled={loading} className="btn btn-primary btn-sm">
            {loading ? 'Processing...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
