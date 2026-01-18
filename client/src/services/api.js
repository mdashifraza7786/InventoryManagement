import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    },
    timeout: 10000
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (!navigator.onLine) {
            error.isOffline = true;
            error.message = 'You are currently offline. Please check your internet connection.';
        } else if (error.code === 'ECONNABORTED') {
            error.message = 'Request timed out. Please try again.';
        } else if (!error.response) {
            error.message = 'Unable to connect to server. Please try again later.';
        }
        return Promise.reject(error);
    }
);

export const productAPI = {
    getAll: () => api.get('/products'),
    getById: (id) => api.get(`/products/${id}`),
    create: (data) => api.post('/products', data),
    update: (id, data) => api.put(`/products/${id}`, data),
    delete: (id) => api.delete(`/products/${id}`),
    getLowStock: () => api.get('/products/low-stock')
};

export const saleAPI = {
    create: (data) => api.post('/sales', data),
    getAll: () => api.get('/sales'),
    getById: (id) => api.get(`/sales/${id}`),
    getDaily: () => api.get('/sales/daily')
};

export default api;
