import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Attach JWT token from localStorage if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// Chat APIs
export const getMessages = (userId) => api.get(`/chat/${userId}`);

// Request APIs
export const sendRequest = (data) => api.post('/request', data);
export const getRequests = () => api.get('/request');
export const updateRequestStatus = (requestId, status) => api.put(`/request/${requestId}`, { status });

// Profile APIs
export const getProfile = (id, role) => api.get(`/profile/${role}/${id}`);

export default api; 