import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Sparkles, CheckCircle, Plus, WashingMachine, Users, Pencil } from 'lucide-react'
import {
  listar as listarReservas,
  buscarLimpeza,
  atualizarLimpeza,
  concluirLimpeza,
  registrarLavanderia,
} from '../../api/reservas'
import * as prestadoresApi from '../../api/prestadores'
import { formatDate, formatCurrency } from '../../utils/formatters'
import PageHeader from '../../components/shared/PageHeader'
import EmptyState from '../../components/shared/EmptyState'
import Modal from '../../components/ui/Modal'
import Button from '../../components/ui/Button'
import Spinner from '../../components/ui/Spinner'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'

// ─── Form Prestador ───────────────────────────────────────────────────────────
const PrestadorForm = ({ onSuccess }) => {
  const qc = useQueryClient()
  const [form, setForm] = useState({ nome: '', telefone: '', tipo: 'FAXINEIRA', valorPadrao: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const salvar = async () => {
    if (!form.nome.trim()) { setError('Nome obrigatório'); return }
    setLoading(true)
    try {
      await prestadoresApi.criar({ ...form, valorPadrao: form.valorPadrao ? parseFloat(form.valorPadrao) : null })
      qc.invalidateQueries(['prestadores'])
      onSuccess()
    } catch (e) { setError(e.message) }
    finally { setLoading(false) }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Input label="Nome *" placeholder="Maria Silva" value={form.nome}
          onChange={e => setForm(f => ({ ...f, nome: e.target.value }))} />
        <Input label="Telefone" placeholder="(81) 99999-0000" value={form.telefone}
          onChange={e => setForm(f => ({ ...f, telefone: e.target.value }))} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Select label="Tipo" value={form.tipo} onChange={e => setForm(f => ({ ...f, tipo: e.target.value }))}>
          <option value="FAXINEIRA">Faxineira</option>
          <option value="LAVANDERIA">Lavanderia</option>
        </Select>
        <Input label="Valor padrão (R$)" type="number" step="0.01" placeholder="0,00"
          value={form.valorPadrao} onChange={e => setForm(f => ({ ...f, valorPadrao: e.target.value }))} />
      </div>
      {error && <p className="text-xs text-danger-500">{error}</p>}
      <div className="flex justify-end gap-2 pt-2">
        <Button variant="secondary" onClick={onSuccess}>Cancelar</Button>
        <Button loading={loading} onClick={salvar}>Cadastrar</Button>
      </div>
    </div>
  )
}

// ─── Form Limpeza ─────────────────────────────────────────────────────────────
const EditarLimpezaForm = ({ reserva, onSuccess }) => {
  const qc = useQueryClient()
  const [data, setData] = useState(reserva.dataCheckout || '')
  const [valorPago, setValorPago] = useState('')
  const [prestadorId, setPrestadorId] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { data: prestadores = [] } = useQuery({ queryKey: ['prestadores'], queryFn: prestadoresApi.listar })
  const faxineiras = prestadores.filter(p => p.tipo === 'FAXINEIRA')

  useQuery({
    queryKey: ['limpeza', reserva.id],
    queryFn: () => buscarLimpeza(reserva.id),
    onSuccess: (l) => {
      if (l) {
        setData(l.data || reserva.dataCheckout)
        setValorPago(l.valorPago?.toString() || '')
        setPrestadorId(l.prestadorId || '')
      }
    },
  })

  const salvar = async () => {
    if (!data) { setError('Data obrigatória'); return }
    setLoading(true)
    try {
      await atualizarLimpeza(reserva.id, {
        data,
        valorPago: valorPago ? parseFloat(valorPago) : 0,
        prestadorId: prestadorId || null,
      })
      qc.invalidateQueries(['reservas'])
      onSuccess()
    } catch (e) { setError(e.message) }
    finally { setLoading(false) }
  }

  return (
    <div className="space-y-4">
      <div className="bg-slate-50 rounded-xl px-4 py-3 text-sm text-slate-600">
        <span className="font-semibold">{reserva.imovelNome}</span>
        {' · '}{reserva.hospedeNome}{' · '}checkout {formatDate(reserva.dataCheckout)}
      </div>
      <Input label="Data da limpeza *" type="date" value={data} onChange={e => setData(e.target.value)} />
      <Input label="Valor pago (R$)" type="number" step="0.01" placeholder="0,00"
        value={valorPago} onChange={e => setValorPago(e.target.value)} />
      <Select label="Faxineira responsável" value={prestadorId} onChange={e => setPrestadorId(e.target.value)}>
        <option value="">Sem prestador</option>
        {faxineiras.map(p => (
          <option key={p.id} value={p.id}>
            {p.nome}{p.valorPadrao ? ` — R$ ${Number(p.valorPadrao).toFixed(2)}` : ''}
          </option>
        ))}
      </Select>
      {error && <p className="text-xs text-danger-500">{error}</p>}
      <div className="flex justify-end gap-2 pt-2">
        <Button variant="secondary" onClick={onSuccess}>Cancelar</Button>
        <Button loading={loading} onClick={salvar}>Salvar limpeza</Button>
      </div>
    </div>
  )
}

// ─── Form Lavanderia ──────────────────────────────────────────────────────────
const LavanderiaForm = ({ reserva, onSuccess }) => {
  const qc = useQueryClient()
  const [valorPago, setValorPago] = useState('')
  const [prestadorId, setPrestadorId] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { data: prestadores = [] } = useQuery({ queryKey: ['prestadores'], queryFn: prestadoresApi.listar })
  const lavanderias = prestadores.filter(p => p.tipo === 'LAVANDERIA')

  const salvar = async () => {
    if (!valorPago) { setError('Valor obrigatório'); return }
    setLoading(true)
    try {
      await registrarLavanderia(reserva.id, {
        valorPago: parseFloat(valorPago),
        prestadorId: prestadorId || null,
      })
      qc.invalidateQueries(['reservas'])
      onSuccess()
    } catch (e) { setError(e.message) }
    finally { setLoading(false) }
  }

  return (
    <div className="space-y-4">
      <div className="bg-slate-50 rounded-xl px-4 py-3 text-sm text-slate-600">
        <span className="font-semibold">{reserva.imovelNome}</span>
        {' · '}{reserva.hospedeNome}
      </div>
      <Input label="Valor pago (R$) *" type="number" step="0.01" placeholder="0,00"
        value={valorPago} onChange={e => setValorPago(e.target.value)} />
      <Select label="Lavanderia" value={prestadorId} onChange={e => setPrestadorId(e.target.value)}>
        <option value="">Selecione...</option>
        {lavanderias.map(p => (
          <option key={p.id} value={p.id}>
            {p.nome}{p.valorPadrao ? ` — R$ ${Number(p.valorPadrao).toFixed(2)}` : ''}
          </option>
        ))}
      </Select>
      {error && <p className="text-xs text-danger-500">{error}</p>}
      <div className="flex justify-end gap-2 pt-2">
        <Button variant="secondary" onClick={onSuccess}>Cancelar</Button>
        <Button loading={loading} onClick={salvar}>Registrar lavanderia</Button>
      </div>
    </div>
  )
}

// ─── Painel Prestadores ───────────────────────────────────────────────────────
const PrestadoresPanel = () => {
  const qc = useQueryClient()
  const [novoPrestador, setNovoPrestador] = useState(false)
  const { data: prestadores = [], isLoading } = useQuery({ queryKey: ['prestadores'], queryFn: prestadoresApi.listar })
  const deleteMutation = useMutation({
    mutationFn: prestadoresApi.excluir,
    onSuccess: () => qc.invalidateQueries(['prestadores']),
  })

  if (isLoading) return <Spinner />

  const faxineiras  = prestadores.filter(p => p.tipo === 'FAXINEIRA')
  const lavanderias = prestadores.filter(p => p.tipo === 'LAVANDERIA')

  const Grupo = ({ titulo, lista, cor }) => (
    <div className="space-y-2">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{titulo}</p>
      {lista.length === 0
        ? <p className="text-sm text-slate-400 py-1">Nenhum cadastrado</p>
        : lista.map(p => (
          <div key={p.id} className={`flex items-center justify-between rounded-xl px-4 py-3 ${cor}`}>
            <div>
              <p className="text-sm font-semibold text-slate-800">{p.nome}</p>
              <div className="flex items-center gap-3 mt-0.5">
                {p.telefone && <p className="text-xs text-slate-500">{p.telefone}</p>}
                {p.valorPadrao && <p className="text-xs text-slate-500">R$ {Number(p.valorPadrao).toFixed(2)}</p>}
              </div>
            </div>
            <button onClick={() => deleteMutation.mutate(p.id)}
              className="text-xs text-danger-400 hover:text-danger-600 px-2 py-1 rounded hover:bg-danger-50 transition-colors">
              Remover
            </button>
          </div>
        ))
      }
    </div>
  )

  return (
    <div className="space-y-5">
      <Grupo titulo="Faxineiras"  lista={faxineiras}  cor="bg-primary-50" />
      <Grupo titulo="Lavanderias" lista={lavanderias} cor="bg-amber-50" />
      {novoPrestador
        ? <PrestadorForm onSuccess={() => setNovoPrestador(false)} />
        : (
          <button onClick={() => setNovoPrestador(true)}
            className="w-full border border-dashed border-slate-200 rounded-xl py-3 text-sm text-slate-400 hover:text-primary-600 hover:border-primary-300 transition-colors flex items-center justify-center gap-2">
            <Plus size={14} />
            Adicionar prestador
          </button>
        )
      }
    </div>
  )
}

// ─── Célula clicável padronizada ──────────────────────────────────────────────
const CelulaClicavel = ({ valor, placeholder, cor, icone: Icone, onClick }) => (
  <button
    onClick={onClick}
    className={`group flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all duration-150 ${
      valor
        ? `${cor} hover:opacity-80`
        : 'text-slate-300 hover:text-slate-500 hover:bg-slate-50'
    }`}
  >
    {Icone && <Icone size={13} className="flex-shrink-0" />}
    <span className="text-xs font-medium">
      {valor || placeholder}
    </span>
    {valor && <Pencil size={11} className="opacity-0 group-hover:opacity-60 transition-opacity flex-shrink-0" />}
  </button>
)

// ─── Página Principal ─────────────────────────────────────────────────────────
const LimpezasPage = () => {
  const qc = useQueryClient()
  const [editando, setEditando]       = useState(null)
  const [lavanderia, setLavanderia]   = useState(null)
  const [gerenciando, setGerenciando] = useState(false)

  const { data: reservas = [], isLoading } = useQuery({ queryKey: ['reservas'], queryFn: listarReservas })

  const concluirMutation = useMutation({
    mutationFn: concluirLimpeza,
    onSuccess: () => qc.invalidateQueries(['reservas']),
  })

  const reservasComLimpeza = reservas
    .filter(r => ['CONFIRMADA', 'EM_ANDAMENTO', 'CONCLUIDA'].includes(r.status))
    .sort((a, b) => a.dataCheckout.localeCompare(b.dataCheckout))

  const pendentes  = reservasComLimpeza.filter(r => r.statusLimpeza !== 'CONCLUIDA')
  const concluidas = reservasComLimpeza.filter(r => r.statusLimpeza === 'CONCLUIDA')

  if (isLoading) return <div className="flex justify-center py-20"><Spinner size={28} /></div>

  const Tabela = ({ lista, titulo }) => (
    <div className="card overflow-hidden">
      <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-700">{titulo}</p>
        <span className="text-xs text-slate-400">{lista.length} limpeza{lista.length !== 1 ? 's' : ''}</span>
      </div>
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-100">
            <th className="px-5 py-3.5 text-left table-header">Imóvel</th>
            <th className="px-5 py-3.5 text-left table-header">Hóspede</th>
            <th className="px-5 py-3.5 text-left table-header">Check-out</th>
            <th className="px-5 py-3.5 text-center table-header">Pessoas</th>
            <th className="px-5 py-3.5 text-left table-header">Limpeza</th>
            <th className="px-5 py-3.5 text-left table-header">Lavanderia</th>
            <th className="px-5 py-3.5 text-left table-header">Status</th>
            <th className="px-5 py-3.5 text-right table-header">Ações</th>
          </tr>
        </thead>
        <tbody>
          {lista.map(r => (
            <tr key={r.id} className="table-row">
              <td className="table-cell font-semibold text-slate-800">{r.imovelNome}</td>
              <td className="table-cell text-slate-600">{r.hospedeNome}</td>
              <td className="table-cell text-slate-600">{formatDate(r.dataCheckout)}</td>

              {/* Pessoas — só número */}
              <td className="table-cell text-center text-slate-600 font-medium">{r.numPessoas}</td>

              {/* Limpeza — clicável */}
              <td className="table-cell">
                <CelulaClicavel
                  valor={r.valorLimpeza ? formatCurrency(r.valorLimpeza) : null}
                  placeholder="Lançar"
                  cor="bg-primary-50 text-primary-700"
                  icone={Sparkles}
                  onClick={() => setEditando(r)}
                />
              </td>

              {/* Lavanderia — clicável */}
              <td className="table-cell">
                <CelulaClicavel
                  valor={r.valorLavanderia ? formatCurrency(r.valorLavanderia) : null}
                  placeholder="Lançar"
                  cor="bg-amber-50 text-amber-700"
                  icone={WashingMachine}
                  onClick={() => setLavanderia(r)}
                />
              </td>

              {/* Status */}
              <td className="table-cell">
                <span className={`badge ${r.statusLimpeza === 'CONCLUIDA'
                  ? 'bg-success-50 text-success-600'
                  : 'bg-amber-50 text-amber-600'}`}>
                  {r.statusLimpeza === 'CONCLUIDA' ? 'Concluída' : 'Pendente'}
                </span>
              </td>

              {/* Ações — só Concluir */}
              <td className="table-cell text-right">
                {r.statusLimpeza !== 'CONCLUIDA' ? (
                  <Button
                    size="sm"
                    variant="secondary"
                    icon={CheckCircle}
                    onClick={() => concluirMutation.mutate(r.id)}
                    loading={concluirMutation.isPending}
                  >
                    Concluir
                  </Button>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs text-success-600 font-medium">
                    <CheckCircle size={13} />
                    Concluída
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  return (
    <>
      <PageHeader
        title="Limpezas"
        subtitle="Agenda de faxinas por reserva"
        action={
          <Button variant="secondary" icon={Users} onClick={() => setGerenciando(true)}>
            Prestadores
          </Button>
        }
      />

      {reservasComLimpeza.length === 0 ? (
        <div className="card">
          <EmptyState icon={Sparkles} title="Nenhuma limpeza agendada"
            description="As limpezas são criadas automaticamente ao cadastrar reservas." />
        </div>
      ) : (
        <div className="space-y-4">
          {pendentes.length > 0  && <Tabela lista={pendentes}  titulo="Pendentes" />}
          {concluidas.length > 0 && <Tabela lista={concluidas} titulo="Concluídas" />}
        </div>
      )}

      <Modal open={!!editando} onClose={() => setEditando(null)} title="Limpeza">
        {editando && <EditarLimpezaForm reserva={editando} onSuccess={() => setEditando(null)} />}
      </Modal>

      <Modal open={!!lavanderia} onClose={() => setLavanderia(null)} title="Lavanderia">
        {lavanderia && <LavanderiaForm reserva={lavanderia} onSuccess={() => setLavanderia(null)} />}
      </Modal>

      <Modal open={gerenciando} onClose={() => setGerenciando(false)} title="Prestadores" size="md">
        <PrestadoresPanel />
      </Modal>
    </>
  )
}

export default LimpezasPage
