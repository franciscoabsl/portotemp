import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, CalendarDays, MessageSquare } from 'lucide-react'
import * as api from '../../api/reservas'
import { formatDate, formatCurrency } from '../../utils/formatters'
import { STATUS_RESERVA, ORIGEM_RESERVA } from '../../utils/constants'
import PageHeader from '../../components/shared/PageHeader'
import EmptyState from '../../components/shared/EmptyState'
import Modal from '../../components/ui/Modal'
import Button from '../../components/ui/Button'
import Spinner from '../../components/ui/Spinner'
import ReservaForm from './ReservaForm'

const ReservasPage = () => {
  const qc = useQueryClient()
  const [modal, setModal] = useState({ open: false, data: null })

  const { data: reservas = [], isLoading } = useQuery({ queryKey: ['reservas'], queryFn: api.listar })

  if (isLoading) return <div className="flex justify-center py-20"><Spinner size={28} /></div>

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
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="px-5 py-3.5 text-left table-header">Hóspede</th>
                <th className="px-5 py-3.5 text-left table-header">Imóvel</th>
                <th className="px-5 py-3.5 text-left table-header">Check-in</th>
                <th className="px-5 py-3.5 text-left table-header">Check-out</th>
                <th className="px-5 py-3.5 text-left table-header">Origem</th>
                <th className="px-5 py-3.5 text-left table-header">Valor</th>
                <th className="px-5 py-3.5 text-left table-header">Status</th>
                <th className="px-5 py-3.5 text-right table-header">Ações</th>
              </tr>
            </thead>
            <tbody>
              {reservas.map(r => {
                const status = STATUS_RESERVA[r.status]
                const colorMap = { success: 'bg-success-50 text-success-600', primary: 'bg-primary-50 text-primary-700', neutral: 'bg-slate-100 text-slate-500', danger: 'bg-danger-50 text-danger-600' }
                return (
                  <tr key={r.id} className="table-row">
                    <td className="table-cell">
                      <p className="font-semibold text-slate-800">{r.hospedeNome}</p>
                      <p className="text-xs text-slate-400">{r.numPessoas} pessoa{r.numPessoas !== 1 ? 's' : ''}</p>
                    </td>
                    <td className="table-cell text-slate-600">{r.imovelNome}</td>
                    <td className="table-cell text-slate-600">{formatDate(r.dataCheckin)}</td>
                    <td className="table-cell text-slate-600">{formatDate(r.dataCheckout)}</td>
                    <td className="table-cell">
                      <span className="badge bg-slate-100 text-slate-600">{ORIGEM_RESERVA[r.origem]}</span>
                    </td>
                    <td className="table-cell font-semibold text-slate-800">{formatCurrency(r.valorTotal)}</td>
                    <td className="table-cell">
                      <span className={`badge ${colorMap[status?.color]}`}>{status?.label}</span>
                    </td>
                    <td className="table-cell text-right">
                      <button
                        onClick={() => setModal({ open: true, data: r })}
                        className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        <MessageSquare size={14} />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={modal.open} onClose={() => setModal({ open: false, data: null })}
        title={modal.data ? 'Detalhes da reserva' : 'Nova reserva'} size="lg">
        <ReservaForm data={modal.data} onSuccess={() => setModal({ open: false, data: null })} />
      </Modal>
    </>
  )
}

export default ReservasPage
