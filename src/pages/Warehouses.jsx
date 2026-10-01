import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Warehouse as WarehouseIcon, Plus, MapPin, Phone, User, Edit2, Trash2, ChevronRight, X } from 'lucide-react';
import { warehouseService } from '../services/warehouseService';
import { useApp } from '../context/AppContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ConfirmDialog from '../components/common/ConfirmDialog';

export default function Warehouses() {
  const navigate = useNavigate();
  const { refreshAllData } = useApp();

  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    contactPerson: '',
    contactNumber: '',
    description: '',
  });

  // Delete State
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Status Alerts
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchWarehouses = async () => {
    setLoading(true);
    try {
      const data = await warehouseService.getAll();
      setWarehouses(data);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const openAddModal = () => {
    setEditingWarehouse(null);
    setFormData({
      name: '',
      location: '',
      contactPerson: '',
      contactNumber: '',
      description: '',
    });
    setErrorMsg(null);
    setIsModalOpen(true);
  };

  const openEditModal = (e, warehouse) => {
    e.stopPropagation();
    setEditingWarehouse(warehouse);
    setFormData({
      name: warehouse.name || '',
      location: warehouse.location || '',
      contactPerson: warehouse.contactPerson || '',
      contactNumber: warehouse.contactNumber || '',
      description: warehouse.description || '',
    });
    setErrorMsg(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg(null);
    try {
      if (editingWarehouse) {
        await warehouseService.update(editingWarehouse.id, formData);
        setSuccessMsg('Warehouse updated successfully!');
      } else {
        await warehouseService.create(formData);
        setSuccessMsg('Warehouse created successfully!');
      }
      setIsModalOpen(false);
      fetchWarehouses();
      refreshAllData();
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await warehouseService.delete(deleteTarget.id);
      setSuccessMsg(`Warehouse ${deleteTarget.name} deleted successfully!`);
      setDeleteTarget(null);
      fetchWarehouses();
      refreshAllData();
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      setErrorMsg(err.message);
      setDeleteTarget(null);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Relief Warehouses</h1>
          <p className="page-subtitle">Manage active storage facilities and distribution hubs.</p>
        </div>
        <button onClick={openAddModal} className="btn btn-primary">
          <Plus size={18} />
          <span>Add Warehouse</span>
        </button>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="toast success" style={{ position: 'relative', bottom: 'auto', left: 'auto', transform: 'none', width: '100%', marginBottom: 16 }}>
          <span>✓</span> {successMsg}
        </div>
      )}

      {errorMsg && (
        <div className="toast error" style={{ position: 'relative', bottom: 'auto', left: 'auto', transform: 'none', width: '100%', marginBottom: 16 }}>
          <span>✕</span> {errorMsg}
        </div>
      )}

      {/* Warehouse Grid */}
      {loading ? (
        <LoadingSpinner text="Fetching warehouses..." />
      ) : warehouses.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <WarehouseIcon size={32} />
          </div>
          <h3 className="empty-state-title">No warehouses registered</h3>
          <p className="empty-state-desc">Create your first warehouse facility to manage inventory.</p>
        </div>
      ) : (
        <div className="warehouse-grid">
          {warehouses.map((wh) => (
            <div key={wh.id} className="warehouse-card" onClick={() => navigate(`/warehouses/${wh.id}`)}>
              <div className="warehouse-card-accent"></div>
              <div className="warehouse-card-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h3 className="warehouse-name">{wh.name}</h3>
                  <div style={{ display: 'flex', gap: 4 }} onClick={(e) => e.stopPropagation()}>
                    <button onClick={(e) => openEditModal(e, wh)} className="btn btn-ghost btn-sm" style={{ padding: 4 }}>
                      <Edit2 size={16} />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); setDeleteTarget(wh); }} className="btn btn-ghost btn-sm" style={{ padding: 4, color: 'var(--color-danger)' }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="warehouse-location">
                  <MapPin size={14} />
                  <span>{wh.location}</span>
                </div>

                <div className="warehouse-stats">
                  <div className="warehouse-stat">
                    <span className="warehouse-stat-label">Contact</span>
                    <span className="warehouse-stat-value" style={{ fontSize: 'var(--font-size-sm)' }}>
                      {wh.contactPerson || 'N/A'}
                    </span>
                  </div>
                  <div className="warehouse-stat">
                    <span className="warehouse-stat-label">Phone</span>
                    <span className="warehouse-stat-value" style={{ fontSize: 'var(--font-size-sm)' }}>
                      {wh.contactNumber || 'N/A'}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 'var(--font-size-xs)', fontWeight: 600, color: 'var(--color-primary)' }}>
                  <span>View Details</span>
                  <ChevronRight size={16} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="modal-overlay centered">
          <div className="modal">
            <div className="modal-header">
              <h3 className="modal-title">
                {editingWarehouse ? 'Edit Warehouse' : 'Add Warehouse Facility'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="modal-close">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Warehouse Name <span>*</span></label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    placeholder="e.g. Kathmandu Central Hub"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Location / Address <span>*</span></label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    placeholder="e.g. Balaju Industrial Area, Kathmandu"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Contact Person</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Ram Shrestha"
                      value={formData.contactPerson}
                      onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Contact Number</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="+977-98XXXXXXXX"
                      value={formData.contactNumber}
                      onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    rows="3"
                    className="form-control"
                    placeholder="Facility specs..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  ></textarea>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="btn btn-primary">
                  {submitting ? 'Saving...' : editingWarehouse ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleteLoading}
        title="Delete Warehouse"
        message={`Are you sure you want to delete warehouse ${deleteTarget?.name}?`}
      />
    </div>
  );
}
