import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Sparkles, CheckCircle, Clock } from 'lucide-react'
import { listar as listarReservas, buscarLimpeza, concluirLimpeza } from '../../api/reservas'
import { formatDate, formatCurrency } from '../../utils/formatters'
import PageHeader from '../../components/shared/PageHeader'
import EmptyState from '../../components/shared/EmptyState'
import Button from '../../components/ui/Button'
import Spinner from '../../components/ui/Spinner'

const LimpezasPage = () => {
  const qc = useQueryClient()

  const { data: reservas = [], isLoading } = useQuery({
    queryKey: ['reservas'],
    queryFn: listarReservas,
  })

  const concluirMutation = useMutation({
    mutationFn: concluirLimpeza,
    onSuccess: () => qc.invalidateQueries(['reservas']),
  })

  const reservasComLimpeza = reservas.filter(r =>
    r.status === 'CONFIRMADA' || r.status === 'EM_ANDAMENTO' || r.status === 'CONCLUIDA'
  )

  if (isLoading) return <div className="flex justify-center py-20"><Spinner size={28} /></div>

  return (
    <>
      <PageHeader title="Limpezas" subtitle="Agenda de faxinas por reserva" />

      {reservasComLimpeza.length === 0 ? (
        <div className="card">
          <EmptyState icon={Sparkles} title="Nenhuma limpeza agendada"
            description="As limpezas são criadas automaticamente ao cadastrar reservas." />
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="px-5 py-3.5 text-left table-header">Imóvel</th>
                <th className="px-5 py-3.5 text-left table-header">Hóspede</th>
                <th className="px-5 py-3.5 text-left table-header">Check-out</th>
                <th className="px-5 py-3.5 text-left table-header">Pessoas</th>
                <th className="px-5 py-3.5 text-left table-header">Status</th>
                <th className="px-5 py-3.5 text-right table-header">Ações</th>
              </tr>
            </thead>
            <tbody>
              {reservasComLimpeza.map(r => (
                <tr key={r.id} className="table-row">
                  <td className="table-cell font-semibold text-slate-800">{r.imovelNome}</td>
                  <td className="table-cell text-slate-600">{r.hospedeNome}</td>
                  <td className="table-cell text-slate-600">{formatDate(r.dataCheckout)}</td>
                  <td className="table-cell text-slate-600">{r.numPessoas}</td>
                  <td className="table-cell">
                    <span className={`badge ${r.status === 'CONCLUIDA'
                      ? 'bg-success-50 text-success-600'
                      : 'bg-amber-50 text-amber-600'}`}>
                      {r.status === 'CONCLUIDA' ? 'Concluída' : 'Pendente'}
                    </span>
                  </td>
                  <td className="table-cell text-right">
                    {r.status !== 'CONCLUIDA' && (
                      <Button
                        size="sm"
                        variant="secondary"
                        icon={CheckCircle}
                        onClick={() => concluirMutation.mutate(r.id)}
                        loading={concluirMutation.isPending}
                      >
                        Concluir
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}

export default LimpezasPage
