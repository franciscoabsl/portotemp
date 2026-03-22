import { useQuery } from '@tanstack/react-query'
import { Home, CalendarDays, Sparkles, DollarSign, TrendingUp, Clock, CheckCircle, AlertCircle } from 'lucide-react'
import { listar as listarReservas } from '../../api/reservas'
import { listar as listarImoveis } from '../../api/imoveis'
import { listar as listarLimpezas } from '../../api/reservas'
import { useAuth } from '../../hooks/useAuth'
import { formatCurrency, formatDate } from '../../utils/formatters'
import { STATUS_RESERVA, ORIGEM_RESERVA } from '../../utils/constants'
import Spinner from '../../components/ui/Spinner'
import Badge from '../../components/ui/Badge'

const StatCard = ({ icon: Icon, label, value, sub, color = 'primary' }) => {
  const colors = {
    primary: 'bg-primary-50 text-primary-600',
    success: 'bg-success-50 text-success-600',
    warning: 'bg-amber-50 text-amber-600',
    danger:  'bg-danger-50 text-danger-600',
  }
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500 font-medium">{label}</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
          {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colors[color]}`}>
          <Icon size={20} strokeWidth={1.8} />
        </div>
      </div>
    </div>
  )
}

const DashboardPage = () => {
  const { canViewFinanceiro } = useAuth()

  const { data: reservas = [], isLoading: loadingReservas } = useQuery({
    queryKey: ['reservas'],
    queryFn: listarReservas,
  })

  const { data: imoveis = [], isLoading: loadingImoveis } = useQuery({
    queryKey: ['imoveis'],
    queryFn: listarImoveis,
  })

  const isLoading = loadingReservas || loadingImoveis

  const hoje = new Date().toISOString().split('T')[0]

  const reservasAtivas = reservas.filter(r =>
    r.status === 'CONFIRMADA' || r.status === 'EM_ANDAMENTO'
  )

  const checkinsHoje = reservas.filter(r => r.dataCheckin === hoje)
  const checkoutsHoje = reservas.filter(r => r.dataCheckout === hoje)

  const proximasReservas = reservas
    .filter(r => r.dataCheckin >= hoje && r.status === 'CONFIRMADA')
    .sort((a, b) => a.dataCheckin.localeCompare(b.dataCheckin))
    .slice(0, 5)

  if (isLoading) return (
    <div className="flex items-center justify-center h-64">
      <Spinner size={28} />
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Home}
          label="Imóveis ativos"
          value={imoveis.length}
          sub="sob sua gestão"
          color="primary"
        />
        <StatCard
          icon={CalendarDays}
          label="Reservas ativas"
          value={reservasAtivas.length}
          sub="confirmadas e em andamento"
          color="success"
        />
        <StatCard
          icon={Clock}
          label="Check-ins hoje"
          value={checkinsHoje.length}
          sub="chegadas esperadas"
          color="warning"
        />
        <StatCard
          icon={Sparkles}
          label="Check-outs hoje"
          value={checkoutsHoje.length}
          sub="limpezas necessárias"
          color="danger"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Próximas reservas */}
        <div className="card">
          <div className="px-5 py-4 border-b border-slate-50 flex items-center justify-between">
            <h3 className="section-title">Próximas reservas</h3>
            <span className="text-xs text-slate-400">{proximasReservas.length} reservas</span>
          </div>
          <div className="divide-y divide-slate-50">
            {proximasReservas.length === 0 ? (
              <div className="px-5 py-8 text-center">
                <p className="text-sm text-slate-400">Nenhuma reserva futura</p>
              </div>
            ) : proximasReservas.map(r => (
              <div key={r.id} className="px-5 py-3.5 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">{r.hospedeNome}</p>
                  <p className="text-xs text-slate-400 mt-0.5 truncate">{r.imovelNome}</p>
                </div>
                <div className="text-right flex-shrink-0 ml-4">
                  <p className="text-xs font-semibold text-slate-700">{formatDate(r.dataCheckin)}</p>
                  <p className="text-xs text-slate-400">{r.numPessoas} hóspedes</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Imóveis */}
        <div className="card">
          <div className="px-5 py-4 border-b border-slate-50">
            <h3 className="section-title">Seus imóveis</h3>
          </div>
          <div className="divide-y divide-slate-50">
            {imoveis.length === 0 ? (
              <div className="px-5 py-8 text-center">
                <p className="text-sm text-slate-400">Nenhum imóvel cadastrado</p>
              </div>
            ) : imoveis.map(i => {
              const reservasImovel = reservasAtivas.filter(r => r.imovelId === i.id)
              const ocupado = reservasImovel.length > 0
              return (
                <div key={i.id} className="px-5 py-3.5 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{i.nome}</p>
                    <p className="text-xs text-slate-400 mt-0.5 truncate">{i.proprietarioNome}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
                      ocupado
                        ? 'bg-success-50 text-success-600'
                        : 'bg-slate-100 text-slate-500'
                    }`}>
                      {ocupado ? <CheckCircle size={11} /> : <AlertCircle size={11} />}
                      {ocupado ? 'Ocupado' : 'Livre'}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
