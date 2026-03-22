import { create } from 'zustand'
import { setAuthToken, clearAuthToken } from '../api/client'

const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  login: (data) => {
    setAuthToken(data.token)
    set({
      token: data.token,
      isAuthenticated: true,
      user: {
        nome: data.nome,
        email: data.email,
        role: data.role,
        tenantId: data.tenantId,
      },
    })
  },

  logout: () => {
    clearAuthToken()
    set({ user: null, token: null, isAuthenticated: false })
  },
}))

export default useAuthStore
