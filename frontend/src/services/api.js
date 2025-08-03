import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getCurrentUser: () => api.get('/auth/me'),
  updateProfile: (userData) => api.put('/auth/profile', userData),
};

// Medicines API
export const medicinesAPI = {
  getAll: (params) => api.get('/medicines', { params }),
  getById: (id) => api.get(`/medicines/${id}`),
  create: (medicineData) => api.post('/medicines', medicineData),
  update: (id, medicineData) => api.put(`/medicines/${id}`, medicineData),
  delete: (id) => api.delete(`/medicines/${id}`),
};

// Orders API
export const ordersAPI = {
  getAll: () => api.get('/orders'),
  getUserOrders: () => api.get('/orders/user'),
  getById: (id) => api.get(`/orders/${id}`),
  create: (orderData) => api.post('/orders', orderData),
  updateStatus: (id, status) => api.patch(`/orders/${id}/status`, { status }),
};

// Prescriptions API
export const prescriptionsAPI = {
  upload: (formData) => api.post('/prescriptions/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  getAll: () => api.get('/prescriptions'),
  delete: (id) => api.delete(`/prescriptions/${id}`),
};

export default api; 