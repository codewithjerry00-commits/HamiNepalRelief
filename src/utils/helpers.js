// Utility helpers for formatting and data processing

export const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export const formatTime = (timeStr) => {
  if (!timeStr) return '—';
  const [h, m] = timeStr.split(':');
  const hour = parseInt(h);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${m} ${ampm}`;
};

export const getStockStatus = (available, receivedQty) => {
  if (available <= 0) return { label: 'Out of Stock', className: 'badge-danger' };
  const ratio = available / (receivedQty || 1);
  if (ratio <= 0.2) return { label: 'Low Stock', className: 'badge-warning' };
  return { label: 'In Stock', className: 'badge-success' };
};

export const formatNumber = (num) => {
  if (num == null) return '0';
  return num.toLocaleString('en-IN');
};

export const generateDispatchId = (count) => {
  const num = String(count + 1).padStart(3, '0');
  return `DISP-${num}`;
};

export const getWarehouseStats = (warehouseId, inventory) => {
  const warehouseInv = inventory.filter(inv => inv.warehouseId === warehouseId);
  const totalStock = warehouseInv.reduce(
    (sum, inv) => sum + (inv.receivedQty - inv.dispatchedQty), 0
  );
  const itemTypes = warehouseInv.length;
  return { totalStock, itemTypes };
};

export const getCategoryColor = (category) => {
  const map = {
    Food: '#E65100',
    Water: '#1565C0',
    Clothing: '#6A1B9A',
    Medical: '#2E7D32',
    Shelter: '#4E342E',
    Hygiene: '#00695C',
  };
  return map[category] || '#455A64';
};
