import axios from 'axios';


const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
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
export const getConversations = () => api.get('/chat/conversations');

// Request APIs
export const sendRequest = (data) => api.post('/request', data);
export const updateRequestStatus = (requestId, status) => api.patch(`/request/${requestId}`, { status });

// Profile APIs
export const getProfile = (id) => api.get(`/profile/${id}`);

// Analytics APIs
export const getEntrepreneurAnalytics = () => api.get('/entrepreneur-analytics');
export const getInvestorAnalytics = () => api.get('/investor-analytics');

export default api; 