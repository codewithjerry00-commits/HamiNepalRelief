import React, { useState, useEffect } from 'react';
import { Package, Plus, Search, Edit2, Trash2, X } from 'lucide-react';
import { inventoryService } from '../services/inventoryService';
import { itemService } from '../services/itemService';
import { useApp } from '../context/AppContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ConfirmDialog from '../components/common/ConfirmDialog';
import Badge from '../components/common/Badge';

export default function Inventory() {
  const { warehouses, refreshAllData } = useApp();

  const [inventoryList, setInventoryList] = useState([]);
  const [itemList, setItemList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWarehouse, setSelectedWarehouse] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Add Item Modal
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [itemFormData, setItemFormData] = useState({
    name: '',
    category: 'Food',
    unit: 'pcs',
    description: '',
  });

  // Delete Target Item
  const [deleteTargetItem, setDeleteTargetItem] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Status Alerts
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchInventoryAndItems = async () => {
    setLoading(true);
    try {
      const [inv, items] = await Promise.all([
        inventoryService.getAll({
          warehouseId: selectedWarehouse || undefined,
          category: selectedCategory || undefined,
          search: searchTerm || undefined,
        }),
        itemService.getAll(),
      ]);
      setInventoryList(inv);
      setItemList(items);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventoryAndItems();
  }, [selectedWarehouse, selectedCategory, searchTerm]);

  const openAddItemModal = () => {
    setEditingItem(null);
    setItemFormData({
      name: '',
      category: 'Food',
      unit: 'pcs',
      description: '',
    });
    setErrorMsg(null);
    setIsItemModalOpen(true);
  };

  const openEditItemModal = (e, item) => {
    e.stopPropagation();
    setEditingItem(item);
    setItemFormData({
      name: item.name || '',
      category: item.category || 'Food',
      unit: item.unit || 'pcs',
      description: item.description || '',
    });
    setErrorMsg(null);
    setIsItemModalOpen(true);
  };

  const handleItemSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg(null);
    try {
      if (editingItem) {
        await itemService.update(editingItem.id, itemFormData);
        setSuccessMsg('Item updated in catalog successfully!');
      } else {
        await itemService.create(itemFormData);
        setSuccessMsg('New item added to catalog!');
      }
      setIsItemModalOpen(false);
      fetchInventoryAndItems();
      refreshAllData();
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteItem = async () => {
    if (!deleteTargetItem) return;
    setDeleteLoading(true);
    try {
      await itemService.delete(deleteTargetItem.id);
      setSuccessMsg(`Item ${deleteTargetItem.name} deleted from catalog!`);
      setDeleteTargetItem(null);
      fetchInventoryAndItems();
      refreshAllData();
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      setErrorMsg(err.message);
      setDeleteTargetItem(null);
    } finally {
      setDeleteLoading(false);
    }
  };

  const categories = ['Food', 'Shelter', 'Medical', 'Bedding', 'Sanitation', 'Clothing', 'Tools'];

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Inventory Stock & Catalog</h1>
          <p className="page-subtitle">Track available stock across warehouses or manage relief item catalog.</p>
        </div>
        <button onClick={openAddItemModal} className="btn btn-primary">
          <Plus size={18} />
          <span>Add New Item</span>
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

      {/* Filter Bar */}
      <div className="filter-bar">
        <div className="input-with-icon">
          <Search size={16} />
          <input
            type="text"
            className="form-control"
            placeholder="Search item or warehouse..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-selects">
          <select
            value={selectedWarehouse}
            onChange={(e) => setSelectedWarehouse(e.target.value)}
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
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="form-control"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Stock Table */}
      <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="card-header">
          <h2 className="card-title">Warehouse Stock Inventory</h2>
          <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
            {inventoryList.length} Stock Entries
          </span>
        </div>

        {loading ? (
          <LoadingSpinner text="Fetching inventory records..." />
        ) : inventoryList.length === 0 ? (
          <div className="empty-state">
            <Package size={32} />
            <h3 className="empty-state-title">No stock entries found</h3>
            <p className="empty-state-desc">Receive stock in a warehouse facility to populate inventory levels.</p>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Item Name</th>
                  <th>Category</th>
                  <th>Warehouse Hub</th>
                  <th style={{ textAlign: 'right' }}>Available Stock</th>
                  <th style={{ textAlign: 'center' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {inventoryList.map((inv) => (
                  <tr key={inv.id}>
                    <td style={{ fontWeight: 600 }}>{inv.item?.name}</td>
                    <td>
                      <Badge variant="neutral">{inv.item?.category}</Badge>
                    </td>
                    <td>{inv.warehouse?.name}</td>
                    <td style={{ textAlign: 'right', fontWeight: 700 }}>
                      {inv.quantity} <span style={{ fontWeight: 400, fontSize: 'var(--font-size-xs)' }}>{inv.item?.unit}</span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      {inv.quantity <= inv.minimumStockLevel ? (
                        <Badge variant="danger">Low Stock</Badge>
                      ) : (
                        <Badge variant="success">In Stock</Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Item Definitions Catalog */}
      <div className="card card-body">
        <h2 className="card-title" style={{ marginBottom: 16 }}>Item Definitions Catalog</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
          {itemList.map((item) => (
            <div key={item.id} style={{ padding: 12, background: 'var(--color-surface-2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 'var(--font-size-sm)' }}>{item.name}</div>
                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
                  {item.category} • {item.unit}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 4 }}>
                <button onClick={(e) => openEditItemModal(e, item)} className="btn btn-ghost btn-sm" style={{ padding: 4 }}>
                  <Edit2 size={14} />
                </button>
                <button onClick={() => setDeleteTargetItem(item)} className="btn btn-ghost btn-sm" style={{ padding: 4, color: 'var(--color-danger)' }}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add / Edit Item Modal */}
      {isItemModalOpen && (
        <div className="modal-overlay centered">
          <div className="modal">
            <div className="modal-header">
              <h3 className="modal-title">
                {editingItem ? 'Edit Relief Item' : 'Add New Item to Catalog'}
              </h3>
              <button onClick={() => setIsItemModalOpen(false)} className="modal-close">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleItemSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Item Name <span>*</span></label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    placeholder="e.g. Emergency Tents (4-person)"
                    value={itemFormData.name}
                    onChange={(e) => setItemFormData({ ...itemFormData, name: e.target.value })}
                  />
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Category <span>*</span></label>
                    <select
                      className="form-control"
                      value={itemFormData.category}
                      onChange={(e) => setItemFormData({ ...itemFormData, category: e.target.value })}
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Unit <span>*</span></label>
                    <input
                      type="text"
                      required
                      className="form-control"
                      placeholder="e.g. pcs, bags, boxes"
                      value={itemFormData.unit}
                      onChange={(e) => setItemFormData({ ...itemFormData, unit: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    rows="2"
                    className="form-control"
                    placeholder="Specs..."
                    value={itemFormData.description}
                    onChange={(e) => setItemFormData({ ...itemFormData, description: e.target.value })}
                  ></textarea>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setIsItemModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="btn btn-primary">
                  {submitting ? 'Saving...' : editingItem ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deleteTargetItem)}
        onClose={() => setDeleteTargetItem(null)}
        onConfirm={handleDeleteItem}
        loading={deleteLoading}
        title="Delete Catalog Item"
        message={`Are you sure you want to delete ${deleteTargetItem?.name} from item definitions?`}
      />
    </div>
  );
}
