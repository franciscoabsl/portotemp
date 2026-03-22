import { useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Menu } from 'lucide-react'

const pageTitles = {
  '/dashboard':     { title: 'Dashboard',     subtitle: 'Visão geral da operação' },
  '/proprietarios': { title: 'Proprietários', subtitle: 'Gerencie os donos dos imóveis' },
  '/imoveis':       { title: 'Imóveis',       subtitle: 'Gerencie seu portfólio' },
  '/reservas':      { title: 'Reservas',      subtitle: 'Controle de hospedagens' },
  '/limpezas':      { title: 'Limpezas',      subtitle: 'Agenda de faxinas e lavanderia' },
  '/despesas':      { title: 'Despesas',      subtitle: 'Gastos e reembolsos' },
  '/fechamentos':   { title: 'Fechamentos',   subtitle: 'Relatórios mensais por proprietário' },
  '/usuarios':      { title: 'Usuários',      subtitle: 'Gerencie acessos ao sistema' },
}

const roleBadge = {
  ADMIN:        { label: 'Admin',        className: 'bg-primary-50 text-primary-700' },
  ASSISTENTE:   { label: 'Assistente',   className: 'bg-amber-50 text-amber-700' },
  PROPRIETARIO: { label: 'Proprietário', className: 'bg-slate-100 text-slate-600' },
}

const Topbar = ({ onMenuClick }) => {
  const { pathname } = useLocation()
  const { user } = useAuth()
  const page  = pageTitles[pathname] ?? { title: 'Portotemp', subtitle: '' }
  const badge = roleBadge[user?.role] ?? roleBadge.ADMIN

  return (
    <header className="h-16 bg-white border-b border-slate-100 px-4 lg:px-6 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-3">
        {/* Hamburguer mobile */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
        >
          <Menu size={20} />
        </button>
        <div>
          <h2 className="text-base font-bold text-slate-900 leading-none">{page.title}</h2>
          {page.subtitle && (
            <p className="text-xs text-slate-400 mt-1 hidden sm:block">{page.subtitle}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 lg:gap-3">
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full hidden sm:inline ${badge.className}`}>
          {badge.label}
        </span>
        <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center flex-shrink-0">
          <span className="text-white text-xs font-bold">
            {user?.nome?.charAt(0).toUpperCase()}
          </span>
        </div>
      </div>
    </header>
  )
}

export default Topbar
