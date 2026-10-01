import api from './api';

export const inventoryService = {
  getAll: async (params = {}) => {
    const response = await api.get('/inventory', { params });
    return response.data;
  },
  getByWarehouse: async (warehouseId) => {
    const response = await api.get(`/inventory/warehouse/${warehouseId}`);
    return response.data;
  },
  getLowStock: async () => {
    const response = await api.get('/inventory/low-stock');
    return response.data;
  },
  getTransactions: async () => {
    const response = await api.get('/inventory/transactions');
    return response.data;
  },
  receiveStock: async (data) => {
    const response = await api.post('/inventory/receive', data);
    return response.data;
  },
};
