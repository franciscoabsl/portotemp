import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

const client = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
})

// Injeta token em todas as requisições
client.interceptors.request.use(
  (config) => {
    const token = window.__authToken__
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error)
)

// Trata respostas e erros globalmente
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.__authToken__ = null
      window.location.href = '/login'
    }
    const message = error.response?.data?.erro || 'Erro inesperado. Tente novamente.'
    return Promise.reject(new Error(message))
  }
)

export const setAuthToken = (token) => {
  window.__authToken__ = token
}

export const clearAuthToken = () => {
  window.__authToken__ = null
}

export default client
