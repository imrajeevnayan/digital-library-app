import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Response interceptor for error handling
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api

// Book API
export const bookApi = {
  getAll: (params) => api.get('/api/v1/books', { params }),
  getById: (id) => api.get(`/api/v1/books/${id}`),
  create: (data) => api.post('/api/v1/books', data),
  update: (id, data) => api.put(`/api/v1/books/${id}`, data),
  delete: (id) => api.delete(`/api/v1/books/${id}`)
}

// Category API
export const categoryApi = {
  getAll: () => api.get('/api/v1/categories'),
  getById: (id) => api.get(`/api/v1/categories/${id}`),
  create: (data) => api.post('/api/v1/categories', data),
  update: (id, data) => api.put(`/api/v1/categories/${id}`, data),
  delete: (id) => api.delete(`/api/v1/categories/${id}`)
}

// Loan API
export const loanApi = {
  getMyActive: () => api.get('/api/v1/loans/my-loans'),
  getMyHistory: (params) => api.get('/api/v1/loans/my-history', { params }),
  borrow: (bookId) => api.post(`/api/v1/loans/borrow/${bookId}`),
  return: (loanId) => api.post(`/api/v1/loans/return/${loanId}`),
  getOverdue: () => api.get('/api/v1/loans/overdue')
}

// User API (Admin)
export const userApi = {
  getAll: () => api.get('/api/v1/admin/users'),
  updateRole: (id, role) => api.put(`/api/v1/admin/users/${id}/role`, role),
  delete: (id) => api.delete(`/api/v1/admin/users/${id}`)
}

// Admin Loan API
export const adminLoanApi = {
  getAll: (params) => api.get('/api/v1/admin/loans', { params }),
  getOverdue: () => api.get('/api/v1/admin/loans/overdue')
}
