import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Trash2, Receipt } from 'lucide-react'
import * as api from '../../api/despesas'
import { formatDate, formatCurrency } from '../../utils/formatters'
import PageHeader from '../../components/shared/PageHeader'
import EmptyState from '../../components/shared/EmptyState'
import Modal from '../../components/ui/Modal'
import Button from '../../components/ui/Button'
import Spinner from '../../components/ui/Spinner'
import DespesaForm from './DespesaForm'

const DespesasPage = () => {
  const qc = useQueryClient()
  const [modal, setModal] = useState({ open: false, data: null })

  const { data: despesas = [], isLoading } = useQuery({ queryKey: ['despesas'], queryFn: api.listar })
  const deleteMutation = useMutation({ mutationFn: api.excluir, onSuccess: () => qc.invalidateQueries(['despesas']) })

  if (isLoading) return <div className="flex justify-center py-20"><Spinner size={28} /></div>

  const total = despesas.reduce((acc, d) => acc + Number(d.valor), 0)

  return (
    <>
      <PageHeader
        title="Despesas"
        subtitle={`Total: ${formatCurrency(total)}`}
        action={<Button icon={Plus} onClick={() => setModal({ open: true, data: null })}>Nova despesa</Button>}
      />

      {despesas.length === 0 ? (
        <div className="card">
          <EmptyState icon={Receipt} title="Nenhuma despesa cadastrada"
            description="Registre despesas pagas por você para incluir nos fechamentos."
            action={<Button icon={Plus} onClick={() => setModal({ open: true, data: null })}>Adicionar despesa</Button>} />
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="px-5 py-3.5 text-left table-header">Tipo</th>
                <th className="px-5 py-3.5 text-left table-header">Imóvel</th>
                <th className="px-5 py-3.5 text-left table-header">Competência</th>
                <th className="px-5 py-3.5 text-left table-header">Valor</th>
                <th className="px-5 py-3.5 text-left table-header">Status</th>
                <th className="px-5 py-3.5 text-right table-header">Ações</th>
              </tr>
            </thead>
            <tbody>
              {despesas.map(d => (
                <tr key={d.id} className="table-row">
                  <td className="table-cell">
                    <p className="font-semibold text-slate-800">{d.tipo}</p>
                    {d.descricao && <p className="text-xs text-slate-400">{d.descricao}</p>}
                  </td>
                  <td className="table-cell text-slate-600">{d.imovelNome}</td>
                  <td className="table-cell text-slate-600">{formatDate(d.competencia)}</td>
                  <td className="table-cell font-semibold text-slate-800">{formatCurrency(d.valor)}</td>
                  <td className="table-cell">
                    <span className={`badge ${d.statusPagamento === 'PAGO'
                      ? 'bg-success-50 text-success-600'
                      : 'bg-amber-50 text-amber-600'}`}>
                      {d.statusPagamento === 'PAGO' ? 'Pago' : 'Pendente'}
                    </span>
                  </td>
                  <td className="table-cell text-right">
                    <button onClick={() => deleteMutation.mutate(d.id)}
                      className="p-1.5 rounded-lg hover:bg-danger-50 text-slate-400 hover:text-danger-500 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={modal.open} onClose={() => setModal({ open: false, data: null })} title="Nova despesa">
        <DespesaForm onSuccess={() => { setModal({ open: false, data: null }) }} />
      </Modal>
    </>
  )
}

export default DespesasPage
