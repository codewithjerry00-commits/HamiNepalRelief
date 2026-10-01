import api from './api';

export const dispatchService = {
  getAll: async () => {
    const response = await api.get('/dispatches');
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/dispatches/${id}`);
    return response.data;
  },
  create: async (data) => {
    const response = await api.post('/dispatches', data);
    return response.data;
  },
};
