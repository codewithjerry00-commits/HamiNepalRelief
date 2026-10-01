import React, { useState, useEffect } from 'react';
import { Warehouse, Package, Truck, UserCheck, Send, AlertTriangle, TrendingUp, ArrowRight } from 'lucide-react';
import { dashboardService } from '../services/dashboardService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Badge from '../components/common/Badge';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const summary = await dashboardService.getSummary();
      setData(summary);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Loading dashboard metrics from backend..." />;
  }

  if (error) {
    return (
      <div className="card card-body" style={{ borderColor: 'var(--color-danger)', background: 'var(--color-danger-light)' }}>
        <h3 className="card-title" style={{ color: 'var(--color-danger)' }}>Unable to connect to backend server</h3>
        <p className="page-subtitle">{error}</p>
        <button onClick={fetchDashboardData} className="btn btn-primary btn-sm" style={{ marginTop: 12 }}>
          Retry Connection
        </button>
      </div>
    );
  }

  const statCards = [
    { title: 'Total Warehouses', value: data?.totalWarehouses || 0, icon: Warehouse, variant: 'primary' },
    { title: 'Item Catalog', value: data?.totalItems || 0, icon: Package, variant: 'success' },
    { title: 'Total Stock Units', value: (data?.totalStockQuantity || 0).toLocaleString(), icon: TrendingUp, variant: 'info' },
    { title: 'Active Fleet', value: `${data?.totalVehicles || 0} Veh / ${data?.totalDrivers || 0} Drv`, icon: Truck, variant: 'primary' },
    { title: 'Dispatches Sent', value: data?.totalDispatches || 0, icon: Send, variant: 'info' },
    { title: 'Low Stock Alerts', value: data?.lowStockCount || 0, icon: AlertTriangle, variant: 'warning' },
  ];

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Relief Inventory Overview</h1>
          <p className="page-subtitle">Real-time status of warehouses, stock levels, and dispatch activities.</p>
        </div>
      </div>

      {/* Stat Cards Grid */}
      <div className="stat-grid">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div key={index} className={`stat-card ${card.variant}`}>
              <div className={`stat-icon ${card.variant}`}>
                <Icon size={20} />
              </div>
              <div className="stat-value">{card.value}</div>
              <div className="stat-label">{card.title}</div>
            </div>
          );
        })}
      </div>

      {/* Two Column Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-6)' }}>
        {/* Low Stock Alerts */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <AlertTriangle size={18} color="var(--color-primary)" />
              <span>Low Stock Warnings</span>
            </h2>
            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>Items below min threshold</span>
          </div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {!data?.lowStockItems || data.lowStockItems.length === 0 ? (
              <p className="empty-state-desc">All inventory stock levels are healthy.</p>
            ) : (
              data.lowStockItems.map((inv) => (
                <div key={inv.id} className="low-stock-item">
                  <div className="low-stock-info">
                    <span className="low-stock-name">{inv.item?.name}</span>
                    <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>{inv.warehouse?.name}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span className="low-stock-qty">{inv.quantity} {inv.item?.unit}</span>
                    <div style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)' }}>Min: {inv.minimumStockLevel}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Dispatches */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Send size={18} color="var(--color-warning)" />
              <span>Recent Dispatches</span>
            </h2>
            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>Latest relief shipments</span>
          </div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {!data?.recentDispatches || data.recentDispatches.length === 0 ? (
              <p className="empty-state-desc">No dispatch records registered yet.</p>
            ) : (
              data.recentDispatches.map((dispatch) => (
                <div key={dispatch.id} className="dispatch-record" style={{ padding: 'var(--space-3)' }}>
                  <div className="dispatch-header">
                    <div className="dispatch-route">
                      <span>{dispatch.warehouse?.name}</span>
                      <ArrowRight size={14} className="dispatch-arrow" />
                      <span>{dispatch.destination}</span>
                    </div>
                    <Badge variant="info">{dispatch.status}</Badge>
                  </div>
                  <div className="dispatch-meta">
                    <span>Recipient: {dispatch.recipient}</span>
                    <span>•</span>
                    <span>Vehicle: {dispatch.vehicle?.vehicleNumber}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
