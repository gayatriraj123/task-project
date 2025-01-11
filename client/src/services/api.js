import axios from 'axios';
import { toast } from 'react-toastify';

// Function to get the API URL
const getApiUrl = () => {
  // Try to get port from environment variable
  const port = process.env.REACT_APP_API_PORT || 5000;
  return process.env.REACT_APP_API_URL || `http://localhost:${port}/api`;
};

const api = axios.create({
  baseURL: getApiUrl()
});

// Request interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle connection errors
    if (!error.response) {
      toast.error('Network error. Please check your connection.');
      return Promise.reject(error);
    }

    const message = error.response?.data?.message || 'Something went wrong';
    toast.error(message);
    return Promise.reject(error);
  }
);

export const auth = {
  signup: async (data) => {
    const response = await api.post('/auth/signup', data);
    return response.data;
  },
  login: (data) => api.post('/auth/login', data),
};

export const categories = {
  getAll: () => api.get('/categories'),
  create: (data) => api.post('/categories', data),
  getSubcategories: (categoryId) => api.get(`/categories/${categoryId}/subcategories`),
  createSubcategory: (categoryId, data) => api.post(`/categories/${categoryId}/subcategories`, data),
  deleteSubcategory: (categoryId, subcategoryId) => 
    api.delete(`/categories/${categoryId}/subcategories/${subcategoryId}`),
};

export const products = {
  getAll: (params) => api.get('/products', { params }),
  create: (data) => api.post('/products', data),
  getBySubcategory: (subcategoryId) => api.get(`/products/subcategory/${subcategoryId}`),
  delete: (productId) => api.delete(`/products/${productId}`),
  update: (productId, data) => api.put(`/products/${productId}`, data),
};

export const orders = {
  create: (data) => api.post('/orders', data),
  getMyOrders: async () => {
    const response = await api.get('/orders/my-orders');
    return response.data;
  },
  getAllOrders: async () => {
    const response = await api.get('/orders');
    return response.data;
  },
  updateStatus: (orderId, data) => api.patch(`/orders/${orderId}/status`, data),
};

export default api; 