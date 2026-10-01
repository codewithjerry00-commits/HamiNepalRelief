import React, { useState, useEffect } from 'react';
import { Truck, Plus, Search, Edit2, Trash2, X } from 'lucide-react';
import { vehicleService } from '../services/vehicleService';
import { useApp } from '../context/AppContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ConfirmDialog from '../components/common/ConfirmDialog';
import Badge from '../components/common/Badge';

export default function Vehicles() {
  const { refreshAllData } = useApp();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [formData, setFormData] = useState({
    vehicleNumber: '',
    vehicleType: 'Heavy Truck',
    capacity: '',
    description: '',
  });

  // Delete State
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Status Alerts
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const data = await vehicleService.getAll();
      setVehicles(data);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const openAddModal = () => {
    setEditingVehicle(null);
    setFormData({
      vehicleNumber: '',
      vehicleType: 'Heavy Truck',
      capacity: '',
      description: '',
    });
    setErrorMsg(null);
    setIsModalOpen(true);
  };

  const openEditModal = (vehicle) => {
    setEditingVehicle(vehicle);
    setFormData({
      vehicleNumber: vehicle.vehicleNumber || '',
      vehicleType: vehicle.vehicleType || 'Heavy Truck',
      capacity: vehicle.capacity || '',
      description: vehicle.description || '',
    });
    setErrorMsg(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg(null);
    try {
      if (editingVehicle) {
        await vehicleService.update(editingVehicle.id, formData);
        setSuccessMsg('Vehicle updated successfully!');
      } else {
        await vehicleService.create(formData);
        setSuccessMsg('Vehicle added successfully!');
      }
      setIsModalOpen(false);
      fetchVehicles();
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
      await vehicleService.delete(deleteTarget.id);
      setSuccessMsg(`Vehicle ${deleteTarget.vehicleNumber} removed successfully!`);
      setDeleteTarget(null);
      fetchVehicles();
      refreshAllData();
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      setErrorMsg(err.message);
      setDeleteTarget(null);
    } finally {
      setDeleteLoading(false);
    }
  };

  const filteredVehicles = vehicles.filter(
    (v) =>
      v.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.vehicleType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Transport Vehicles</h1>
          <p className="page-subtitle">Manage relief logistics fleet for stock dispatches.</p>
        </div>
        <button onClick={openAddModal} className="btn btn-primary">
          <Plus size={18} />
          <span>Add Vehicle</span>
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

      {/* Search Filter */}
      <div className="filter-bar">
        <div className="input-with-icon" style={{ maxWidth: 360 }}>
          <Search size={16} />
          <input
            type="text"
            className="form-control"
            placeholder="Search vehicle number or type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Vehicle Grid */}
      {loading ? (
        <LoadingSpinner text="Fetching vehicles..." />
      ) : filteredVehicles.length === 0 ? (
        <div className="empty-state">
          <Truck size={32} />
          <h3 className="empty-state-title">No vehicles found</h3>
          <p className="empty-state-desc">Add a new transport vehicle to get started.</p>
        </div>
      ) : (
        <div className="warehouse-grid">
          {filteredVehicles.map((vehicle) => (
            <div key={vehicle.id} className="card card-body">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ fontSize: 'var(--font-size-base)', fontWeight: 700 }}>{vehicle.vehicleNumber}</h3>
                  <Badge variant="info" style={{ marginTop: 4 }}>{vehicle.vehicleType}</Badge>
                </div>
                <div style={{ display: 'flex', gap: 4 }}>
                  <button onClick={() => openEditModal(vehicle)} className="btn btn-ghost btn-sm" style={{ padding: 4 }}>
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => setDeleteTarget(vehicle)} className="btn btn-ghost btn-sm" style={{ padding: 4, color: 'var(--color-danger)' }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--color-border-light)', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
                <div>Capacity: <strong style={{ color: 'var(--color-text)' }}>{vehicle.capacity || 'N/A'}</strong></div>
                {vehicle.description && <div style={{ fontStyle: 'italic', marginTop: 4 }}>{vehicle.description}</div>}
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
                {editingVehicle ? 'Edit Vehicle' : 'Add Transport Vehicle'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="modal-close">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Vehicle Registration Number <span>*</span></label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    placeholder="e.g. BA 2 KHA 4521"
                    value={formData.vehicleNumber}
                    onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value })}
                  />
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Vehicle Type <span>*</span></label>
                    <select
                      className="form-control"
                      value={formData.vehicleType}
                      onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                    >
                      <option value="Heavy Truck">Heavy Truck</option>
                      <option value="Medium Truck">Medium Truck</option>
                      <option value="Pickup Van">Pickup Van</option>
                      <option value="Tractor">Tractor</option>
                      <option value="Cargo Aircraft">Cargo Aircraft</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Load Capacity</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. 10 Tons"
                      value={formData.capacity}
                      onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Description / Notes</label>
                  <textarea
                    rows="3"
                    className="form-control"
                    placeholder="Assigned routes..."
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
                  {submitting ? 'Saving...' : editingVehicle ? 'Update' : 'Add Vehicle'}
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
        title="Remove Vehicle"
        message={`Are you sure you want to remove vehicle ${deleteTarget?.vehicleNumber}?`}
      />
    </div>
  );
}
