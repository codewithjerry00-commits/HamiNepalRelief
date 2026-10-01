import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Warehouse, MapPin, Phone, User, Plus, Package, ArrowLeft, X } from 'lucide-react';
import { warehouseService } from '../services/warehouseService';
import { inventoryService } from '../services/inventoryService';
import { itemService } from '../services/itemService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Badge from '../components/common/Badge';

export default function WarehouseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [warehouse, setWarehouse] = useState(null);
  const [inventoryList, setInventoryList] = useState([]);
  const [itemList, setItemList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Stock Receive Modal State
  const [isReceiveModalOpen, setIsReceiveModalOpen] = useState(false);
  const [receiveForm, setReceiveForm] = useState({
    itemId: '',
    quantity: '',
    minimumStockLevel: '10',
    notes: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [wh, inv, items] = await Promise.all([
        warehouseService.getById(id),
        inventoryService.getByWarehouse(id),
        itemService.getAll(),
      ]);
      setWarehouse(wh);
      setInventoryList(inv);
      setItemList(items);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleReceiveStock = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg(null);
    try {
      await inventoryService.receiveStock({
        warehouseId: Number(id),
        itemId: Number(receiveForm.itemId),
        quantity: Number(receiveForm.quantity),
        minimumStockLevel: Number(receiveForm.minimumStockLevel),
        notes: receiveForm.notes,
      });
      setSuccessMsg('Stock received and updated successfully!');
      setIsReceiveModalOpen(false);
      setReceiveForm({ itemId: '', quantity: '', minimumStockLevel: '10', notes: '' });
      fetchData();
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Fetching warehouse details..." />;
  }

  if (!warehouse) {
    return (
      <div className="empty-state">
        <h3 className="empty-state-title">Warehouse Not Found</h3>
        <button onClick={() => navigate('/warehouses')} className="btn btn-primary">
          Back to Warehouses
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Back Link */}
      <button onClick={() => navigate('/warehouses')} className="btn btn-ghost btn-sm" style={{ marginBottom: 16 }}>
        <ArrowLeft size={16} />
        <span>Back to Warehouses</span>
      </button>

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

      {/* Warehouse Header Card */}
      <div className="card card-body" style={{ marginBottom: 'var(--space-6)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 className="page-title">{warehouse.name}</h1>
          <p className="page-subtitle" style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
            <MapPin size={14} /> {warehouse.location}
          </p>
          <div style={{ display: 'flex', gap: 16, marginTop: 8, fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
            <span><User size={14} /> {warehouse.contactPerson || 'N/A'}</span>
            <span><Phone size={14} /> {warehouse.contactNumber || 'N/A'}</span>
          </div>
        </div>

        <button onClick={() => { setErrorMsg(null); setIsReceiveModalOpen(true); }} className="btn btn-primary">
          <Plus size={18} />
          <span>Receive Stock</span>
        </button>
      </div>

      {/* Stock Inventory Table */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Current Stock Inventory</h2>
          <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>{inventoryList.length} Items</span>
        </div>

        {inventoryList.length === 0 ? (
          <div className="empty-state">
            <Package size={32} />
            <p className="empty-state-desc">No inventory stock recorded in this warehouse yet.</p>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Item Name</th>
                  <th>Category</th>
                  <th style={{ textAlign: 'right' }}>Available Stock</th>
                  <th style={{ textAlign: 'right' }}>Min Threshold</th>
                  <th style={{ textAlign: 'center' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {inventoryList.map((inv) => (
                  <tr key={inv.id}>
                    <td style={{ fontWeight: 600 }}>{inv.item?.name}</td>
                    <td>{inv.item?.category}</td>
                    <td style={{ textAlign: 'right', fontWeight: 700 }}>
                      {inv.quantity} <span style={{ fontWeight: 400, fontSize: 'var(--font-size-xs)' }}>{inv.item?.unit}</span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      {inv.minimumStockLevel} <span style={{ fontWeight: 400, fontSize: 'var(--font-size-xs)' }}>{inv.item?.unit}</span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      {inv.quantity <= inv.minimumStockLevel ? (
                        <Badge variant="danger">Low Stock</Badge>
                      ) : (
                        <Badge variant="success">Sufficient</Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Receive Stock Modal */}
      {isReceiveModalOpen && (
        <div className="modal-overlay centered">
          <div className="modal">
            <div className="modal-header">
              <h3 className="modal-title">Receive Stock into {warehouse.name}</h3>
              <button onClick={() => setIsReceiveModalOpen(false)} className="modal-close">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleReceiveStock}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Select Item <span>*</span></label>
                  <select
                    required
                    className="form-control"
                    value={receiveForm.itemId}
                    onChange={(e) => setReceiveForm({ ...receiveForm, itemId: e.target.value })}
                  >
                    <option value="">-- Choose Item from Catalog --</option>
                    {itemList.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name} ({item.category}) - Unit: {item.unit}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Quantity Received <span>*</span></label>
                    <input
                      type="number"
                      min="1"
                      required
                      className="form-control"
                      placeholder="e.g. 500"
                      value={receiveForm.quantity}
                      onChange={(e) => setReceiveForm({ ...receiveForm, quantity: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Min Threshold</label>
                    <input
                      type="number"
                      min="0"
                      className="form-control"
                      placeholder="Default: 10"
                      value={receiveForm.minimumStockLevel}
                      onChange={(e) => setReceiveForm({ ...receiveForm, minimumStockLevel: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Shipment Notes</label>
                  <textarea
                    rows="2"
                    className="form-control"
                    placeholder="Donor org, batch number..."
                    value={receiveForm.notes}
                    onChange={(e) => setReceiveForm({ ...receiveForm, notes: e.target.value })}
                  ></textarea>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setIsReceiveModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="btn btn-primary">
                  {submitting ? 'Updating...' : 'Confirm Stock Receiving'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
