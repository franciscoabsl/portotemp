import { Outlet, Navigate } from 'react-router-dom'
import { BarChart2, MessageSquare, Sparkles, FileText } from 'lucide-react'
import useAuthStore from '../store/authStore'

const features = [
  { icon: BarChart2,    text: 'Gerencie todos seus imóveis em um só lugar' },
  { icon: FileText,     text: 'Fechamentos mensais automáticos com PDF' },
  { icon: MessageSquare,text: 'Mensagens WhatsApp com 1 clique' },
  { icon: Sparkles,     text: 'Calendário de limpeza para sua equipe' },
]

const AuthLayout = () => {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated)
  if (isAuthenticated) return <Navigate to="/dashboard" replace />

  return (
    <div className="min-h-screen flex">
      {/* Painel esquerdo */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-primary flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white/5" />
        <div className="absolute -bottom-32 -right-16 w-80 h-80 rounded-full bg-white/5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-white/5" />

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <div>
              <h1 className="text-white font-bold text-xl tracking-tight">Portotemp</h1>
              <p className="text-primary-200 text-xs">Gestão de temporada</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 space-y-5">
          {features.map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center flex-shrink-0">
                <Icon size={16} className="text-white" strokeWidth={1.8} />
              </div>
              <p className="text-white/80 text-sm">{text}</p>
            </div>
          ))}
        </div>

        <div className="relative z-10">
          <p className="text-primary-200 text-xs">
            © 2026 Portotemp · Todos os direitos reservados
          </p>
        </div>
      </div>

      {/* Painel direito */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <span className="font-bold text-slate-900">Portotemp</span>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default AuthLayout
