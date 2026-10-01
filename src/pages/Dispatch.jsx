import React, { useState, useEffect } from 'react';
import { Send, Plus, Trash2, Warehouse as WarehouseIcon, Truck, UserCheck, ArrowRight, Info, AlertTriangle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { dispatchService } from '../services/dispatchService';
import { inventoryService } from '../services/inventoryService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Badge from '../components/common/Badge';

export default function Dispatch() {
  const { warehouses, items: catalogItems, vehicles, drivers, refreshAllData } = useApp();

  const [dispatches, setDispatches] = useState([]);
  const [loading, setLoading] = useState(true);

  // Available stock in selected warehouse
  const [availableStock, setAvailableStock] = useState([]);

  // Form State
  const [warehouseId, setWarehouseId] = useState('');
  const [vehicleId, setVehicleId] = useState('');
  const [driverId, setDriverId] = useState('');
  const [destination, setDestination] = useState('');
  const [recipient, setRecipient] = useState('');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState([{ itemId: '', quantity: 1 }]);

  // Submission Status
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const fetchDispatches = async () => {
    setLoading(true);
    try {
      const data = await dispatchService.getAll();
      setDispatches(data);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDispatches();
  }, []);

  // Fetch available inventory when warehouse is selected
  useEffect(() => {
    if (warehouseId) {
      inventoryService
        .getByWarehouse(warehouseId)
        .then((stock) => setAvailableStock(stock))
        .catch((err) => setErrorMsg(err.message));
    } else {
      setAvailableStock([]);
    }
  }, [warehouseId]);

  const addItemRow = () => {
    setItems([...items, { itemId: '', quantity: 1 }]);
  };

  const removeItemRow = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const dto = {
        warehouseId: Number(warehouseId),
        vehicleId: Number(vehicleId),
        driverId: Number(driverId),
        destination,
        recipient,
        notes,
        items: items.map((i) => ({
          itemId: Number(i.itemId),
          quantity: Number(i.quantity),
        })),
      };

      await dispatchService.create(dto);
      setSuccessMsg('Relief shipment dispatched successfully!');

      // Reset Form
      setWarehouseId('');
      setVehicleId('');
      setDriverId('');
      setDestination('');
      setRecipient('');
      setNotes('');
      setItems([{ itemId: '', quantity: 1 }]);

      fetchDispatches();
      refreshAllData();
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Map helper to find stock for an item in the selected warehouse
  const getStockForItem = (itemId) => {
    const inv = availableStock.find((s) => String(s.item?.id) === String(itemId));
    return inv ? inv.quantity : 0;
  };

  const selectedWarehouseObject = warehouses.find((wh) => String(wh.id) === String(warehouseId));
  const hasZeroStockInWarehouse = warehouseId && availableStock.every((inv) => inv.quantity === 0);

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Dispatch Relief Goods</h1>
          <p className="page-subtitle">Authorize emergency relief shipments from warehouse hubs to distribution sites.</p>
        </div>
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

      {/* Dispatch Creation Form */}
      <div className="card card-body" style={{ marginBottom: 'var(--space-6)' }}>
        <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
          <Send size={18} color="var(--color-primary)" />
          <span>New Dispatch Authorization</span>
        </h2>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div className="form-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
            <div className="form-group">
              <label className="form-label">Source Warehouse Hub <span>*</span></label>
              <select
                required
                className="form-control"
                value={warehouseId}
                onChange={(e) => setWarehouseId(e.target.value)}
              >
                <option value="">-- Select Source Warehouse --</option>
                {warehouses.map((wh) => (
                  <option key={wh.id} value={wh.id}>
                    {wh.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Assigned Vehicle <span>*</span></label>
              <select
                required
                className="form-control"
                value={vehicleId}
                onChange={(e) => setVehicleId(e.target.value)}
              >
                <option value="">-- Select Vehicle --</option>
                {vehicles.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.vehicleNumber} ({v.vehicleType})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Assigned Driver <span>*</span></label>
              <select
                required
                className="form-control"
                value={driverId}
                onChange={(e) => setDriverId(e.target.value)}
              >
                <option value="">-- Select Driver --</option>
                {drivers.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.phone})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Warehouse Stock Alert Helper */}
          {warehouseId && (availableStock.length === 0 || hasZeroStockInWarehouse) && (
            <div style={{ padding: 12, background: 'var(--color-warning-light)', borderRadius: 'var(--radius-md)', border: '1px solid #FFE0B2', fontSize: 'var(--font-size-xs)', color: 'var(--color-warning)' }}>
              <strong>Notice for {selectedWarehouseObject?.name}:</strong> No stock has been received into this warehouse hub yet. Go to <strong>Warehouses → View Details → Receive Stock</strong> to add stock before dispatching.
            </div>
          )}

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Destination District / Municipality <span>*</span></label>
              <input
                type="text"
                required
                className="form-control"
                placeholder="e.g. Jajarkot Earthquake Relief Camp"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Recipient / Coordinator Name <span>*</span></label>
              <input
                type="text"
                required
                className="form-control"
                placeholder="e.g. District Disaster Management Committee"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
              />
            </div>
          </div>

          {/* Dynamic Items Section */}
          <div style={{ marginTop: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <label className="form-label">Dispatched Relief Goods List</label>
              <button
                type="button"
                onClick={addItemRow}
                className="btn btn-ghost btn-sm"
                style={{ color: 'var(--color-primary)', fontWeight: 600 }}
              >
                <Plus size={16} /> Add Item Row
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {items.map((row, index) => {
                const availableQty = getStockForItem(row.itemId);
                const selectedCatItem = catalogItems.find((c) => String(c.id) === String(row.itemId));

                return (
                  <div key={index} className="dispatch-item-row">
                    <select
                      required
                      className="form-control"
                      value={row.itemId}
                      onChange={(e) => handleItemChange(index, 'itemId', e.target.value)}
                    >
                      <option value="">-- Choose Item from Catalog --</option>
                      {catalogItems.map((catItem) => {
                        const stockQty = getStockForItem(catItem.id);
                        return (
                          <option key={catItem.id} value={catItem.id}>
                            {catItem.name} ({catItem.category}) — {warehouseId ? `Available: ${stockQty} ${catItem.unit}` : 'Select warehouse above'}
                          </option>
                        );
                      })}
                    </select>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <input
                        type="number"
                        min="1"
                        required
                        className="form-control dispatch-qty-input"
                        placeholder="Qty"
                        value={row.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                      />
                      <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', whiteSpace: 'nowrap' }}>
                        {selectedCatItem?.unit || 'units'}
                      </span>
                    </div>

                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItemRow(index)}
                        className="btn btn-ghost btn-sm"
                        style={{ color: 'var(--color-danger)', padding: 4 }}
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Dispatch Instructions / Notes</label>
            <textarea
              rows="2"
              className="form-control"
              placeholder="Transit route instructions..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            ></textarea>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
            <button type="submit" disabled={submitting} className="btn btn-primary btn-lg">
              {submitting ? 'Authorizing Dispatch...' : 'Confirm & Dispatch Shipment'}
            </button>
          </div>
        </form>
      </div>

      {/* Historical Dispatches Section */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Dispatch Movement Log</h2>
          <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>{dispatches.length} Total</span>
        </div>

        {loading ? (
          <LoadingSpinner text="Fetching dispatch logs..." />
        ) : dispatches.length === 0 ? (
          <div className="empty-state">
            <Send size={32} />
            <h3 className="empty-state-title">No dispatches authorized yet</h3>
          </div>
        ) : (
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {dispatches.map((disp) => (
              <div key={disp.id} className="dispatch-record">
                <div className="dispatch-id">#DISP-{disp.id}</div>
                <div className="dispatch-header">
                  <div className="dispatch-route">
                    <span>{disp.warehouse?.name}</span>
                    <ArrowRight size={14} className="dispatch-arrow" />
                    <span>{disp.destination}</span>
                  </div>
                  <Badge variant="info">{disp.status}</Badge>
                </div>

                <div className="dispatch-items">
                  {disp.items?.map((di) => (
                    <span key={di.id} className="dispatch-item-tag">
                      {di.item?.name}: <strong>{di.quantity} {di.unit}</strong>
                    </span>
                  ))}
                </div>

                <div className="dispatch-footer">
                  <span>Vehicle: {disp.vehicle?.vehicleNumber}</span>
                  <span>•</span>
                  <span>Driver: {disp.driver?.name}</span>
                  <span>•</span>
                  <span>Recipient: {disp.recipient}</span>
                  <span>•</span>
                  <span>{disp.dispatchDateTime ? new Date(disp.dispatchDateTime).toLocaleString() : ''}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
