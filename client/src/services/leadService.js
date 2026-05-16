import api from '../utils/axios';

const leadService = {
  getAll: (params) => api.get('/leads', { params }),
  getById: (id) => api.get(`/leads/${id}`),
  create: (data) => api.post('/leads', data),
  update: (id, data) => api.put(`/leads/${id}`, data),
  delete: (id) => api.delete(`/leads/${id}`),
  
  getActivities: (id) => api.get(`/leads/${id}/activities`),
  addActivity: (id, data) => api.post(`/leads/${id}/activities`, data),
};

export default leadService;
