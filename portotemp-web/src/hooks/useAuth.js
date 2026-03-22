import useAuthStore from '../store/authStore'
import { ROLES } from '../utils/constants'

export const useAuth = () => {
  const { user, isAuthenticated, login, logout } = useAuthStore()

  const isAdmin       = user?.role === ROLES.ADMIN
  const isAssistente  = user?.role === ROLES.ASSISTENTE
  const isProprietario= user?.role === ROLES.PROPRIETARIO
  const canViewFinanceiro = isAdmin

  return { user, isAuthenticated, login, logout, isAdmin, isAssistente, isProprietario, canViewFinanceiro }
}
