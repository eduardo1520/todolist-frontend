import api from './api';

export const activityService = {
  findAll: (projectId) => api.get(`/projects/${projectId}/activities`),
  create: (projectId, data) => api.post(`/projects/${projectId}/activities`, data),
  update: (projectId, id, data) => api.put(`/projects/${projectId}/activities/${id}`, data),
  updateStatus: (projectId, id, status) => api.patch(`/projects/${projectId}/activities/${id}/status`, { status }),
  delete: (projectId, id) => api.delete(`/projects/${projectId}/activities/${id}`),
};