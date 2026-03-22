import { createBrowserRouter, Navigate } from 'react-router-dom'
import PrivateRoute from './PrivateRoute'
import RoleRoute from './RoleRoute'
import AppLayout from '../layouts/AppLayout'
import AuthLayout from '../layouts/AuthLayout'
import LoginPage from '../pages/auth/LoginPage'
import DashboardPage from '../pages/dashboard/DashboardPage'
import ProprietariosPage from '../pages/proprietarios/ProprietariosPage'
import ImoveisPage from '../pages/imoveis/ImoveisPage'
import ReservasPage from '../pages/reservas/ReservasPage'
import LimpezasPage from '../pages/limpezas/LimpezasPage'
import DespesasPage from '../pages/despesas/DespesasPage'
import FechamentosPage from '../pages/fechamentos/FechamentosPage'
import UsuariosPage from '../pages/usuarios/UsuariosPage'

const router = createBrowserRouter([
  {
    path: '/login',
    element: <AuthLayout />,
    children: [{ index: true, element: <LoginPage /> }],
  },
  {
    path: '/',
    element: <PrivateRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { index: true, element: <Navigate to="/dashboard" replace /> },
          { path: 'dashboard', element: <DashboardPage /> },
          { path: 'proprietarios', element: <ProprietariosPage /> },
          { path: 'imoveis', element: <ImoveisPage /> },
          { path: 'reservas', element: <ReservasPage /> },
          { path: 'limpezas', element: <LimpezasPage /> },
          {
            element: <RoleRoute roles={['ADMIN']} />,
            children: [
              { path: 'despesas', element: <DespesasPage /> },
              { path: 'fechamentos', element: <FechamentosPage /> },
              { path: 'usuarios', element: <UsuariosPage /> },
            ],
          },
        ],
      },
    ],
  },
  { path: '*', element: <Navigate to="/dashboard" replace /> },
])

export default router
