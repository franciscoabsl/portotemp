import { Navigate, Outlet } from 'react-router-dom'
import useAuthStore from '../store/authStore'

const RoleRoute = ({ roles }) => {
  const user = useAuthStore(s => s.user)
  if (!user || !roles.includes(user.role)) return <Navigate to="/dashboard" replace />
  return <Outlet />
}

export default RoleRoute
