import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Building2, Home, CalendarDays,
  Sparkles, Receipt, FileText, Users, LogOut
} from 'lucide-react'
import useAuthStore from '../store/authStore'
import { useAuth } from '../hooks/useAuth'

const navItems = [
  { to: '/dashboard',    icon: LayoutDashboard, label: 'Dashboard',     roles: ['ADMIN','ASSISTENTE','PROPRIETARIO'] },
  { to: '/proprietarios',icon: Users,            label: 'Proprietários', roles: ['ADMIN'] },
  { to: '/imoveis',      icon: Home,             label: 'Imóveis',       roles: ['ADMIN','ASSISTENTE'] },
  { to: '/reservas',     icon: CalendarDays,     label: 'Reservas',      roles: ['ADMIN','ASSISTENTE'] },
  { to: '/limpezas',     icon: Sparkles,         label: 'Limpezas',      roles: ['ADMIN','ASSISTENTE'] },
  { to: '/despesas',     icon: Receipt,          label: 'Despesas',      roles: ['ADMIN'] },
  { to: '/fechamentos',  icon: FileText,         label: 'Fechamentos',   roles: ['ADMIN'] },
  { to: '/usuarios',     icon: Building2,        label: 'Usuários',      roles: ['ADMIN'] },
]

const Sidebar = () => {
  const { user, logout } = useAuth()

  const items = navItems.filter(i => i.roles.includes(user?.role))

  return (
    <aside className="w-60 min-h-screen bg-white border-r border-neutral-200 flex flex-col">
      <div className="px-5 py-6 border-b border-neutral-100">
        <h1 className="text-lg font-bold text-neutral-900">Portotemp</h1>
        <p className="text-xs text-neutral-400 mt-0.5">Gestão de temporada</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {items.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }
          >
            <Icon size={18} strokeWidth={1.75} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-neutral-100">
        <div className="px-3 py-2 mb-1">
          <p className="text-sm font-medium text-neutral-700 truncate">{user?.nome}</p>
          <p className="text-xs text-neutral-400 truncate">{user?.email}</p>
        </div>
        <button
          onClick={logout}
          className="sidebar-link w-full text-danger-500 hover:bg-danger-50 hover:text-danger-600"
        >
          <LogOut size={18} strokeWidth={1.75} />
          <span>Sair</span>
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
