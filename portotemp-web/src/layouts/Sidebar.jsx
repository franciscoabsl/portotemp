import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Users, Home, CalendarDays,
  Sparkles, Receipt, FileText, UserCog, LogOut
} from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

const navItems = [
  { to: '/dashboard',    icon: LayoutDashboard, label: 'Dashboard',     roles: ['ADMIN','ASSISTENTE','PROPRIETARIO'] },
  { to: '/proprietarios',icon: Users,            label: 'Proprietários', roles: ['ADMIN'] },
  { to: '/imoveis',      icon: Home,             label: 'Imóveis',       roles: ['ADMIN','ASSISTENTE'] },
  { to: '/reservas',     icon: CalendarDays,     label: 'Reservas',      roles: ['ADMIN','ASSISTENTE'] },
  { to: '/limpezas',     icon: Sparkles,         label: 'Limpezas',      roles: ['ADMIN','ASSISTENTE'] },
  { to: '/despesas',     icon: Receipt,          label: 'Despesas',      roles: ['ADMIN'] },
  { to: '/fechamentos',  icon: FileText,         label: 'Fechamentos',   roles: ['ADMIN'] },
  { to: '/usuarios',     icon: UserCog,          label: 'Usuários',      roles: ['ADMIN'] },
]

const Sidebar = () => {
  const { user, logout } = useAuth()
  const items = navItems.filter(i => i.roles.includes(user?.role))

  return (
    <aside className="w-56 min-h-screen bg-white border-r border-slate-100 flex flex-col">
      {/* Logo */}
      <div className="px-5 pt-6 pb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-sm">P</span>
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900 leading-none">Portotemp</p>
            <p className="text-xs text-slate-400 mt-0.5">Gestão de temporada</p>
          </div>
        </div>
      </div>

      <div className="px-3 mb-2">
        <div className="h-px bg-slate-100" />
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
        {items.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <Icon size={17} strokeWidth={1.8} className="flex-shrink-0" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User */}
      <div className="px-3 pb-4 mt-2">
        <div className="h-px bg-slate-100 mb-3" />
        <div className="px-3 py-2 mb-1">
          <p className="text-sm font-semibold text-slate-800 truncate">{user?.nome}</p>
          <p className="text-xs text-slate-400 truncate">{user?.email}</p>
        </div>
        <button
          onClick={logout}
          className="sidebar-link text-slate-400 hover:text-danger-500 hover:bg-danger-50 w-full"
        >
          <LogOut size={17} strokeWidth={1.8} />
          <span>Sair</span>
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
