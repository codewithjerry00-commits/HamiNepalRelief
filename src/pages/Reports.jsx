import React, { useState, useEffect } from 'react';
import { FileBarChart, Download, Filter, Search, FileText } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { reportService } from '../services/reportService';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function Reports() {
  const { warehouses, vehicles, drivers } = useApp();

  const [dispatches, setDispatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  // Filters
  const [warehouseId, setWarehouseId] = useState('');
  const [vehicleId, setVehicleId] = useState('');
  const [driverId, setDriverId] = useState('');
  const [destination, setDestination] = useState('');

  const fetchReport = async () => {
    setLoading(true);
    try {
      const data = await reportService.getDispatchReport({
        warehouseId: warehouseId || undefined,
        vehicleId: vehicleId || undefined,
        driverId: driverId || undefined,
        destination: destination || undefined,
      });
      setDispatches(data);
    } catch (err) {
      console.error('Failed to fetch report:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [warehouseId, vehicleId, driverId, destination]);

  const handleExportDispatchExcel = async () => {
    setExporting(true);
    try {
      await reportService.exportDispatchExcel({
        warehouseId: warehouseId || undefined,
        vehicleId: vehicleId || undefined,
        driverId: driverId || undefined,
        destination: destination || undefined,
      });
    } catch (err) {
      alert('Failed to export Excel report: ' + err.message);
    } finally {
      setExporting(false);
    }
  };

  const handleExportInventoryExcel = async () => {
    setExporting(true);
    try {
      await reportService.exportInventoryExcel();
    } catch (err) {
      alert('Failed to export Inventory report: ' + err.message);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Dispatch & Inventory Reports</h1>
          <p className="page-subtitle">Generate operational audit reports and export to Microsoft Excel (.xlsx).</p>
        </div>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <button onClick={handleExportInventoryExcel} disabled={exporting} className="btn btn-secondary">
            <Download size={16} />
            <span>Export Stock Excel</span>
          </button>

          <button onClick={handleExportDispatchExcel} disabled={exporting} className="btn btn-primary">
            <Download size={16} />
            <span>Export Dispatch Excel</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="card card-body" style={{ marginBottom: 'var(--space-6)' }}>
        <h3 className="section-title" style={{ fontSize: 'var(--font-size-sm)', marginBottom: 12 }}>
          <Filter size={16} color="var(--color-primary)" /> Filter Report Criteria
        </h3>

        <div className="form-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
          <select
            value={warehouseId}
            onChange={(e) => setWarehouseId(e.target.value)}
            className="form-control"
          >
            <option value="">All Warehouses</option>
            {warehouses.map((wh) => (
              <option key={wh.id} value={wh.id}>
                {wh.name}
              </option>
            ))}
          </select>

          <select
            value={vehicleId}
            onChange={(e) => setVehicleId(e.target.value)}
            className="form-control"
          >
            <option value="">All Transport Vehicles</option>
            {vehicles.map((v) => (
              <option key={v.id} value={v.id}>
                {v.vehicleNumber}
              </option>
            ))}
          </select>

          <select
            value={driverId}
            onChange={(e) => setDriverId(e.target.value)}
            className="form-control"
          >
            <option value="">All Drivers</option>
            {drivers.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>

          <div className="input-with-icon">
            <Search size={16} />
            <input
              type="text"
              className="form-control"
              placeholder="Search destination..."
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Report Table */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Dispatch Audit Log</h2>
          <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>{dispatches.length} Matching Records</span>
        </div>

        {loading ? (
          <LoadingSpinner text="Generating report data..." />
        ) : dispatches.length === 0 ? (
          <div className="empty-state">
            <FileBarChart size={32} />
            <h3 className="empty-state-title">No dispatch records match filters</h3>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Date & Time</th>
                  <th>Warehouse</th>
                  <th>Vehicle</th>
                  <th>Driver</th>
                  <th>Destination & Recipient</th>
                  <th>Dispatched Cargo Items</th>
                </tr>
              </thead>
              <tbody>
                {dispatches.map((disp) => (
                  <tr key={disp.id}>
                    <td style={{ fontWeight: 700, color: 'var(--color-text-muted)' }}>#{disp.id}</td>
                    <td style={{ whiteSpace: 'nowrap' }}>
                      {disp.dispatchDateTime ? new Date(disp.dispatchDateTime).toLocaleString() : ''}
                    </td>
                    <td style={{ fontWeight: 600 }}>{disp.warehouse?.name}</td>
                    <td>{disp.vehicle?.vehicleNumber}</td>
                    <td>{disp.driver?.name}</td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{disp.destination}</div>
                      <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>Recipient: {disp.recipient}</div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                        {disp.items?.map((di) => (
                          <span key={di.id} className="dispatch-item-tag">
                            {di.item?.name}: <strong>{di.quantity} {di.unit}</strong>
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
