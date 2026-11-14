import axios from 'axios'

export function getApiBaseUrl() {
  const envUrl = import.meta.env.VITE_API_URL
  if (envUrl && !envUrl.includes('localhost')) {
    return envUrl.replace(/\/$/, '')
  }

  // Automatic detection when hosted on Render
  if (typeof window !== 'undefined' && window.location.hostname.endsWith('.onrender.com')) {
    if (window.location.hostname.includes('frontend')) {
      return `https://${window.location.hostname.replace('frontend', 'backend')}`
    }
  }

  return envUrl || 'http://localhost:5001'
}

export const API_BASE_URL = getApiBaseUrl()
console.log('[AICTE Portal] Connected to API endpoint:', API_BASE_URL)

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // 60s timeout to allow Render free tier cold-starts
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('aicte_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && window.location.pathname !== '/login') {
      localStorage.removeItem('aicte_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const authAPI = {
  register: (data) => api.post('/api/auth/register', data),
  login: (email, password) => api.post('/api/auth/login', { email, password }),
  getMe: () => api.get('/api/auth/me'),
}

export const institutionAPI = {
  getProfile: () => api.get('/api/institutions/me'),
  updateProfile: (data) => api.put('/api/institutions/me', data),
}

export const applicationsAPI = {
  create: (data) => api.post('/api/applications', data),
  list: () => api.get('/api/applications'),
  getById: (id) => api.get(`/api/applications/${id}`),
  update: (id, data) => api.put(`/api/applications/${id}`, data),
  submit: (id, data = {}) => api.post(`/api/applications/${id}/submit`, data),
}

export const reviewerAPI = {
  getApplications: () => api.get('/api/reviewer/applications'),
  addComment: (applicationId, comment) =>
    api.post(`/api/applications/${applicationId}/comments`, { comment }),
  updateStatus: (applicationId, data) =>
    api.put(`/api/applications/${applicationId}/status`, data),
}

export const adminAPI = {
  getDashboard: () => api.get('/api/admin/dashboard'),
  getUsers: (params) => api.get('/api/admin/users', { params }),
  getApplications: () => api.get('/api/admin/applications'),
  assignReviewer: (applicationId, reviewerId) =>
    api.post('/api/admin/assign-reviewer', { applicationId, reviewerId }),
}

export default api
