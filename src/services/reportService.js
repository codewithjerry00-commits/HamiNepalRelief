import api from './api';

export const reportService = {
  getDispatchReport: async (params = {}) => {
    const response = await api.get('/reports/dispatches', { params });
    return response.data;
  },
  exportDispatchExcel: async (params = {}) => {
    const response = await api.get('/reports/dispatches/export/excel', {
      params,
      responseType: 'blob',
    });
    // Trigger browser file download
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'dispatch_report.xlsx');
    document.body.appendChild(link);
    link.click();
    link.remove();
  },
  exportInventoryExcel: async () => {
    const response = await api.get('/reports/inventory/export/excel', {
      responseType: 'blob',
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'inventory_report.xlsx');
    document.body.appendChild(link);
    link.click();
    link.remove();
  },
};
