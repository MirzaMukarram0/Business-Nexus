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

// Update the getRequests function to include the authentication headers
export const getRequests = () => {
  return api.get('/requests', {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
};

// ... other API functions ...
// Chat APIs
export const getMessages = (userId) => api.get(`/chat/${userId}`);

// Request APIs
export const sendRequest = (data) => api.post('/request', data);
export const updateRequestStatus = (requestId, status) => api.patch(`/request/${requestId}`, { status });

// Profile APIs
export const getProfile = (id) => api.get(`/profile/${id}`);

export default api; 