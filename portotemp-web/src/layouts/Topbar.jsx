import { useLocation } from 'react-router-dom'
import { Bell } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

const pageTitles = {
  '/dashboard':     'Dashboard',
  '/proprietarios': 'Proprietários',
  '/imoveis':       'Imóveis',
  '/reservas':      'Reservas',
  '/limpezas':      'Limpezas',
  '/despesas':      'Despesas',
  '/fechamentos':   'Fechamentos',
  '/usuarios':      'Usuários',
}

const Topbar = () => {
  const { pathname } = useLocation()
  const { user } = useAuth()
  const title = pageTitles[pathname] ?? 'Portotemp'

  return (
    <header className="h-14 bg-white border-b border-neutral-200 px-6 flex items-center justify-between sticky top-0 z-10">
      <h2 className="text-base font-semibold text-neutral-800">{title}</h2>
      <div className="flex items-center gap-3">
        <span className="text-xs text-neutral-400 bg-neutral-100 px-2.5 py-1 rounded-full font-medium">
          {user?.role}
        </span>
        <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-neutral-100 text-neutral-500 transition-colors">
          <Bell size={16} />
        </button>
      </div>
    </header>
  )
}

export default Topbar
