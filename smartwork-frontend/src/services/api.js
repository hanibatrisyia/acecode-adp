import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api'
});

API.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const login        = (data)           => API.post('/auth/login', data);
export const logout       = ()               => API.post('/auth/logout');
export const resetPassword = (data)          => API.post('/auth/reset-password', data);
export const getUsers     = ()               => API.get('/users');
export const assignRole   = (id, role)       => API.patch(`/users/${id}/role`, { role });
export const revokeAccess = (id, reason)     => API.patch(`/users/${id}/revoke`, { reason });
export const getAuditLogs = ()               => API.get('/audit');
export const getMyRole    = ()               => API.get('/roles/me');

export default API;