import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, CalendarDays, MessageSquare, XCircle, ChevronRight } from 'lucide-react'
import * as api from '../../api/reservas'
import { formatDate, formatCurrency } from '../../utils/formatters'
import { STATUS_RESERVA, ORIGEM_RESERVA } from '../../utils/constants'
import PageHeader from '../../components/shared/PageHeader'
import EmptyState from '../../components/shared/EmptyState'
import Modal from '../../components/ui/Modal'
import Button from '../../components/ui/Button'
import Spinner from '../../components/ui/Spinner'
import ReservaForm from './ReservaForm'
import ReservaDetalhe from './ReservaDetalhe'

const statusColor = {
  success: 'bg-success-50 text-success-600',
  primary: 'bg-primary-50 text-primary-700',
  neutral: 'bg-slate-100 text-slate-500',
  danger:  'bg-danger-50 text-danger-600',
}

const ReservasPage = () => {
  const [modal, setModal]   = useState({ open: false, data: null })
  const [detalhe, setDetalhe] = useState(null)

  const { data: reservas = [], isLoading } = useQuery({
    queryKey: ['reservas'],
    queryFn: api.listar,
  })

  if (isLoading) return <div className="flex justify-center py-20"><Spinner size={28} /></div>

  const abertas   = reservas.filter(r => ['CONFIRMADA','EM_ANDAMENTO'].includes(r.status))
  const historico = reservas.filter(r => ['CONCLUIDA','CANCELADA'].includes(r.status))

  const ReservaRow = ({ r }) => {
    const status = STATUS_RESERVA[r.status]
    return (
      <tr
        className="table-row cursor-pointer"
        onClick={() => setDetalhe(r)}
      >
        <td className="table-cell">
          <p className="font-semibold text-slate-800">{r.hospedeNome}</p>
          <p className="text-xs text-slate-400">{r.hospedeTelefone || '—'}</p>
        </td>
        <td className="table-cell text-slate-600">{r.imovelNome}</td>
        <td className="table-cell">
          <div className="text-sm text-slate-700">{formatDate(r.dataCheckin)}</div>
          <div className="text-xs text-slate-400">até {formatDate(r.dataCheckout)}</div>
        </td>
        <td className="table-cell text-slate-500">{r.numPessoas} pax</td>
        <td className="table-cell">
          <span className="badge bg-slate-100 text-slate-600">{ORIGEM_RESERVA[r.origem]}</span>
        </td>
        <td className="table-cell font-semibold text-slate-800">{formatCurrency(r.valorTotal)}</td>
        <td className="table-cell">
          <span className={`badge ${statusColor[status?.color]}`}>{status?.label}</span>
        </td>
        <td className="table-cell text-right">
          <ChevronRight size={16} className="text-slate-300 inline" />
        </td>
      </tr>
    )
  }

  const Tabela = ({ lista, titulo }) => (
    <div className="card overflow-hidden">
      {titulo && (
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-700">{titulo}</p>
          <span className="text-xs text-slate-400">{lista.length} reserva{lista.length !== 1 ? 's' : ''}</span>
        </div>
      )}
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-100">
            <th className="px-5 py-3.5 text-left table-header">Hóspede</th>
            <th className="px-5 py-3.5 text-left table-header">Imóvel</th>
            <th className="px-5 py-3.5 text-left table-header">Período</th>
            <th className="px-5 py-3.5 text-left table-header">Pessoas</th>
            <th className="px-5 py-3.5 text-left table-header">Origem</th>
            <th className="px-5 py-3.5 text-left table-header">Valor</th>
            <th className="px-5 py-3.5 text-left table-header">Status</th>
            <th className="px-5 py-3.5 text-right table-header"></th>
          </tr>
        </thead>
        <tbody>
          {lista.map(r => <ReservaRow key={r.id} r={r} />)}
        </tbody>
      </table>
    </div>
  )

  return (
    <>
      <PageHeader
        title="Reservas"
        subtitle={`${reservas.length} reserva${reservas.length !== 1 ? 's' : ''} no sistema`}
        action={<Button icon={Plus} onClick={() => setModal({ open: true, data: null })}>Nova reserva</Button>}
      />

      {reservas.length === 0 ? (
        <div className="card">
          <EmptyState icon={CalendarDays} title="Nenhuma reserva cadastrada"
            description="Registre a primeira reserva para começar."
            action={<Button icon={Plus} onClick={() => setModal({ open: true, data: null })}>Nova reserva</Button>} />
        </div>
      ) : (
        <div className="space-y-4">
          {abertas.length > 0 && <Tabela lista={abertas} titulo="Reservas ativas" />}
          {historico.length > 0 && <Tabela lista={historico} titulo="Histórico" />}
        </div>
      )}

      <Modal open={modal.open} onClose={() => setModal({ open: false, data: null })}
        title="Nova reserva" size="lg">
        <ReservaForm onSuccess={() => setModal({ open: false, data: null })} />
      </Modal>

      <Modal open={!!detalhe} onClose={() => setDetalhe(null)}
        title="Detalhes da reserva" size="lg">
        {detalhe && <ReservaDetalhe reserva={detalhe} onClose={() => setDetalhe(null)} />}
      </Modal>
    </>
  )
}

export default ReservasPage
