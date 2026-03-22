import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, FileText, Download, Lock } from 'lucide-react'
import * as api from '../../api/fechamentos'
import { listar as listarProprietarios } from '../../api/proprietarios'
import { formatCurrency, mesNome } from '../../utils/formatters'
import PageHeader from '../../components/shared/PageHeader'
import EmptyState from '../../components/shared/EmptyState'
import Modal from '../../components/ui/Modal'
import Button from '../../components/ui/Button'
import Select from '../../components/ui/Select'
import Spinner from '../../components/ui/Spinner'

const GerarFechamentoForm = ({ onSuccess }) => {
  const qc = useQueryClient()
  const { data: proprietarios = [] } = useQuery({ queryKey: ['proprietarios'], queryFn: listarProprietarios })
  const [form, setForm] = useState({ proprietarioId: '', mes: new Date().getMonth() + 1, ano: new Date().getFullYear() })
  const [error, setError] = useState('')

  const mutation = useMutation({
    mutationFn: () => api.gerar(form.proprietarioId, form.mes, form.ano),
    onSuccess: () => { qc.invalidateQueries(['fechamentos']); onSuccess() },
    onError: (e) => setError(e.message),
  })

  return (
    <div className="space-y-4">
      <Select label="Proprietário *" value={form.proprietarioId} onChange={e => setForm(f => ({ ...f, proprietarioId: e.target.value }))}>
        <option value="">Selecione...</option>
        {proprietarios.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
      </Select>
      <div className="grid grid-cols-2 gap-3">
        <Select label="Mês" value={form.mes} onChange={e => setForm(f => ({ ...f, mes: +e.target.value }))}>
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i+1} value={i+1}>{mesNome(i+1)}</option>
          ))}
        </Select>
        <Select label="Ano" value={form.ano} onChange={e => setForm(f => ({ ...f, ano: +e.target.value }))}>
          {[2024,2025,2026,2027].map(a => <option key={a} value={a}>{a}</option>)}
        </Select>
      </div>
      {error && <div className="px-4 py-3 rounded-xl bg-danger-50 border border-danger-100"><p className="text-sm text-danger-600">{error}</p></div>}
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onSuccess}>Cancelar</Button>
        <Button onClick={() => mutation.mutate()} loading={mutation.isPending} disabled={!form.proprietarioId}>Gerar fechamento</Button>
      </div>
    </div>
  )
}

const FechamentosPage = () => {
  const qc = useQueryClient()
  const [modal, setModal] = useState(false)
  const [detalhe, setDetalhe] = useState(null)

  const { data: fechamentos = [], isLoading } = useQuery({ queryKey: ['fechamentos'], queryFn: api.listar })

  const fecharMutation = useMutation({
    mutationFn: api.fechar,
    onSuccess: () => qc.invalidateQueries(['fechamentos']),
  })

  if (isLoading) return <div className="flex justify-center py-20"><Spinner size={28} /></div>

  return (
    <>
      <PageHeader
        title="Fechamentos"
        subtitle="Relatórios mensais por proprietário"
        action={<Button icon={Plus} onClick={() => setModal(true)}>Gerar fechamento</Button>}
      />

      {fechamentos.length === 0 ? (
        <div className="card">
          <EmptyState icon={FileText} title="Nenhum fechamento gerado"
            description="Gere o primeiro fechamento mensal para um proprietário."
            action={<Button icon={Plus} onClick={() => setModal(true)}>Gerar fechamento</Button>} />
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="px-5 py-3.5 text-left table-header">Proprietário</th>
                <th className="px-5 py-3.5 text-left table-header">Período</th>
                <th className="px-5 py-3.5 text-left table-header">Comissão</th>
                <th className="px-5 py-3.5 text-left table-header">Reembolsos</th>
                <th className="px-5 py-3.5 text-left table-header">Total</th>
                <th className="px-5 py-3.5 text-left table-header">Status</th>
                <th className="px-5 py-3.5 text-right table-header">Ações</th>
              </tr>
            </thead>
            <tbody>
              {fechamentos.map(f => (
                <tr key={f.id} className="table-row cursor-pointer" onClick={() => setDetalhe(f)}>
                  <td className="table-cell font-semibold text-slate-800">{f.proprietarioNome}</td>
                  <td className="table-cell text-slate-600">{mesNome(f.mes)}/{f.ano}</td>
                  <td className="table-cell text-slate-600">{formatCurrency(f.totalComissao)}</td>
                  <td className="table-cell text-slate-600">{formatCurrency(f.totalReembolsos)}</td>
                  <td className="table-cell font-bold text-slate-900">{formatCurrency(f.totalAReceber)}</td>
                  <td className="table-cell">
                    <span className={`badge ${f.status === 'FECHADO' ? 'bg-slate-100 text-slate-500' : 'bg-amber-50 text-amber-600'}`}>
                      {f.status === 'FECHADO' ? 'Fechado' : 'Aberto'}
                    </span>
                  </td>
                  <td className="table-cell text-right" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1">
                      {f.status === 'ABERTO' && (
                        <Button size="sm" variant="secondary" icon={Lock}
                          onClick={() => fecharMutation.mutate(f.id)}
                          loading={fecharMutation.isPending}>
                          Fechar
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal gerar */}
      <Modal open={modal} onClose={() => setModal(false)} title="Gerar fechamento mensal">
        <GerarFechamentoForm onSuccess={() => setModal(false)} />
      </Modal>

      {/* Modal detalhe */}
      <Modal open={!!detalhe} onClose={() => setDetalhe(null)} title={`Fechamento — ${detalhe ? `${mesNome(detalhe.mes)}/${detalhe.ano}` : ''}`} size="lg">
        {detalhe && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Comissão', value: formatCurrency(detalhe.totalComissao) },
                { label: 'Reembolsos', value: formatCurrency(detalhe.totalReembolsos) },
                { label: 'Total a receber', value: formatCurrency(detalhe.totalAReceber) },
              ].map(({ label, value }) => (
                <div key={label} className="bg-slate-50 rounded-xl p-3 text-center">
                  <p className="text-xs text-slate-400">{label}</p>
                  <p className="text-base font-bold text-slate-900 mt-1">{value}</p>
                </div>
              ))}
            </div>
            <div className="border border-slate-100 rounded-xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="px-4 py-3 text-left table-header">Tipo</th>
                    <th className="px-4 py-3 text-left table-header">Descrição</th>
                    <th className="px-4 py-3 text-right table-header">Valor</th>
                  </tr>
                </thead>
                <tbody>
                  {detalhe.itens?.map(item => (
                    <tr key={item.id} className="border-b border-slate-50 last:border-0">
                      <td className="px-4 py-3">
                        <span className="badge bg-slate-100 text-slate-600 text-xs">{item.tipo}</span>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">{item.descricao}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-slate-800 text-right">{formatCurrency(item.valor)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-end">
              <Button variant="secondary" icon={Download} onClick={() => setDetalhe(null)}>Fechar</Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  )
}

export default FechamentosPage
