import React, { useState, useEffect } from 'react';
import { UserCheck, Plus, Search, Edit2, Trash2, X } from 'lucide-react';
import { driverService } from '../services/driverService';
import { useApp } from '../context/AppContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ConfirmDialog from '../components/common/ConfirmDialog';
import Badge from '../components/common/Badge';

export default function Drivers() {
  const { refreshAllData } = useApp();
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    licenseNumber: '',
    description: '',
  });

  // Delete State
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Status Alerts
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchDrivers = async () => {
    setLoading(true);
    try {
      const data = await driverService.getAll();
      setDrivers(data);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const openAddModal = () => {
    setEditingDriver(null);
    setFormData({
      name: '',
      phone: '',
      licenseNumber: '',
      description: '',
    });
    setErrorMsg(null);
    setIsModalOpen(true);
  };

  const openEditModal = (driver) => {
    setEditingDriver(driver);
    setFormData({
      name: driver.name || '',
      phone: driver.phone || '',
      licenseNumber: driver.licenseNumber || '',
      description: driver.description || '',
    });
    setErrorMsg(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg(null);
    try {
      if (editingDriver) {
        await driverService.update(editingDriver.id, formData);
        setSuccessMsg('Driver updated successfully!');
      } else {
        await driverService.create(formData);
        setSuccessMsg('Driver registered successfully!');
      }
      setIsModalOpen(false);
      fetchDrivers();
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
      await driverService.delete(deleteTarget.id);
      setSuccessMsg(`Driver ${deleteTarget.name} removed successfully!`);
      setDeleteTarget(null);
      fetchDrivers();
      refreshAllData();
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      setErrorMsg(err.message);
      setDeleteTarget(null);
    } finally {
      setDeleteLoading(false);
    }
  };

  const filteredDrivers = drivers.filter(
    (d) =>
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (d.licenseNumber && d.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Transport Drivers</h1>
          <p className="page-subtitle">Registered driver personnel for relief distribution convoys.</p>
        </div>
        <button onClick={openAddModal} className="btn btn-primary">
          <Plus size={18} />
          <span>Add Driver</span>
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
            placeholder="Search driver name, phone, or license..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Driver Grid */}
      {loading ? (
        <LoadingSpinner text="Fetching drivers..." />
      ) : filteredDrivers.length === 0 ? (
        <div className="empty-state">
          <UserCheck size={32} />
          <h3 className="empty-state-title">No drivers found</h3>
          <p className="empty-state-desc">Register a new driver to start managing dispatch personnel.</p>
        </div>
      ) : (
        <div className="warehouse-grid">
          {filteredDrivers.map((driver) => (
            <div key={driver.id} className="card card-body">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ fontSize: 'var(--font-size-base)', fontWeight: 700 }}>{driver.name}</h3>
                  <Badge variant="success" style={{ marginTop: 4 }}>Active Driver</Badge>
                </div>
                <div style={{ display: 'flex', gap: 4 }}>
                  <button onClick={() => openEditModal(driver)} className="btn btn-ghost btn-sm" style={{ padding: 4 }}>
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => setDeleteTarget(driver)} className="btn btn-ghost btn-sm" style={{ padding: 4, color: 'var(--color-danger)' }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--color-border-light)', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div>Phone: <strong style={{ color: 'var(--color-text)' }}>{driver.phone}</strong></div>
                <div>License: <strong style={{ color: 'var(--color-text)' }}>{driver.licenseNumber || 'N/A'}</strong></div>
                {driver.description && <div style={{ fontStyle: 'italic', marginTop: 4 }}>{driver.description}</div>}
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
                {editingDriver ? 'Edit Driver' : 'Register New Driver'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="modal-close">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Driver Full Name <span>*</span></label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    placeholder="e.g. Bikram Thapa"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Phone Number <span>*</span></label>
                    <input
                      type="text"
                      required
                      className="form-control"
                      placeholder="+977-98XXXXXXXX"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">License Number</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="DL-XXXXX"
                      value={formData.licenseNumber}
                      onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Notes / Experience</label>
                  <textarea
                    rows="3"
                    className="form-control"
                    placeholder="Terrain experience..."
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
                  {submitting ? 'Saving...' : editingDriver ? 'Update' : 'Save Driver'}
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
        title="Remove Driver"
        message={`Are you sure you want to remove driver ${deleteTarget?.name}?`}
      />
    </div>
  );
}
