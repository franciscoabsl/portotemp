import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Trash2, Download, MessageSquare } from 'lucide-react'
import * as calendarioApi from '../../api/calendario'
import Button from '../../components/ui/Button'
import Select from '../../components/ui/Select'
import { mesNome } from '../../utils/formatters'

const TIPOS_TEMPLATE = {
  CONFIRMACAO: 'Confirmação',
  VESPERA_CHECKIN: 'Véspera do Check-in',
  BOAS_VINDAS: 'Boas-vindas',
  CHECKOUT: 'Check-out',
}

const IDIOMAS = { PT: 'Português', EN: 'Inglês', ES: 'Espanhol' }

const VARIAVEIS = [
  '{{nome_hospede}}', '{{nome_imovel}}', '{{endereco_imovel}}',
  '{{codigo_fechadura}}', '{{data_checkin}}', '{{data_checkout}}',
  '{{horario_checkin}}', '{{horario_checkout}}', '{{numero_pessoas}}',
]

const TemplateForm = ({ imovelId, onSuccess }) => {
  const qc = useQueryClient()
  const [tipo, setTipo] = useState('CONFIRMACAO')
  const [idioma, setIdioma] = useState('PT')
  const [conteudo, setConteudo] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const inserirVariavel = (v) => setConteudo(c => c + v)

  const salvar = async () => {
    if (!conteudo.trim()) { setError('Conteúdo obrigatório'); return }
    setLoading(true)
    try {
      const res = await fetch(`http://localhost:8080/imoveis/${imovelId}/templates`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${window.__authToken__}`,
        },
        body: JSON.stringify({ tipo, idioma, conteudo }),
      })
      if (!res.ok) throw new Error('Erro ao salvar template')
      qc.invalidateQueries(['templates', imovelId])
      setConteudo('')
      setError('')
      onSuccess?.()
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-3 border border-slate-100 rounded-xl p-4">
      <p className="text-sm font-semibold text-slate-700">Novo template</p>
      <div className="grid grid-cols-2 gap-3">
        <Select label="Tipo" value={tipo} onChange={e => setTipo(e.target.value)}>
          {Object.entries(TIPOS_TEMPLATE).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </Select>
        <Select label="Idioma" value={idioma} onChange={e => setIdioma(e.target.value)}>
          {Object.entries(IDIOMAS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </Select>
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-slate-700">Mensagem</label>
        <textarea
          className="input-field resize-none"
          rows={4}
          placeholder="Digite a mensagem..."
          value={conteudo}
          onChange={e => setConteudo(e.target.value)}
        />
      </div>
      <div className="flex flex-wrap gap-1.5">
        {VARIAVEIS.map(v => (
          <button key={v} type="button" onClick={() => inserirVariavel(v)}
            className="text-xs px-2 py-1 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition-colors font-mono">
            {v}
          </button>
        ))}
      </div>
      {error && <p className="text-xs text-danger-500">{error}</p>}
      <div className="flex justify-end">
        <Button size="sm" loading={loading} onClick={salvar}>Salvar template</Button>
      </div>
    </div>
  )
}

const ImovelDetalhe = ({ imovel, onClose }) => {
  const qc = useQueryClient()
  const [aba, setAba] = useState('templates')
  const [novoTemplate, setNovoTemplate] = useState(false)
  const [loadingPdf, setLoadingPdf] = useState(false)
  const [mes, setMes] = useState(new Date().getMonth() + 1)
  const [ano, setAno] = useState(new Date().getFullYear())

  const { data: templates = [] } = useQuery({
    queryKey: ['templates', imovel.id],
    queryFn: async () => {
      const res = await fetch(`http://localhost:8080/imoveis/${imovel.id}/templates`, {
        headers: { Authorization: `Bearer ${window.__authToken__}` },
      })
      return res.json()
    },
  })

  const deletarTemplate = async (templateId) => {
    await fetch(`http://localhost:8080/imoveis/${imovel.id}/templates/${templateId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${window.__authToken__}` },
    })
    qc.invalidateQueries(['templates', imovel.id])
  }

  const baixarPdf = async () => {
    setLoadingPdf(true)
    try {
      await calendarioApi.gerarPdf(imovel.id, mes, ano)
    } catch (e) {
      alert(e.message)
    } finally {
      setLoadingPdf(false)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="font-bold text-slate-900 text-lg">{imovel.nome}</p>
        <p className="text-sm text-slate-400">{imovel.proprietarioNome}</p>
      </div>

      <div className="flex gap-1 border-b border-slate-100">
        {[
          { key: 'templates', label: 'Templates WhatsApp', icon: MessageSquare },
          { key: 'calendario', label: 'Calendário PDF', icon: Download },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setAba(key)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
              aba === key
                ? 'border-primary-600 text-primary-700'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      {aba === 'templates' && (
        <div className="space-y-3">
          {templates.length === 0 && !novoTemplate && (
            <p className="text-sm text-slate-400 text-center py-4">Nenhum template configurado</p>
          )}
          {templates.map(t => (
            <div key={t.id} className="border border-slate-100 rounded-xl p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="badge bg-primary-50 text-primary-700">{TIPOS_TEMPLATE[t.tipo]}</span>
                  <span className="badge bg-slate-100 text-slate-500">{IDIOMAS[t.idioma]}</span>
                </div>
                <button onClick={() => deletarTemplate(t.id)}
                  className="p-1 rounded hover:bg-danger-50 text-slate-400 hover:text-danger-500 transition-colors">
                  <Trash2 size={13} />
                </button>
              </div>
              <p className="text-sm text-slate-600 whitespace-pre-wrap">{t.conteudo}</p>
            </div>
          ))}
          {novoTemplate
            ? <TemplateForm imovelId={imovel.id} onSuccess={() => setNovoTemplate(false)} />
            : (
              <button onClick={() => setNovoTemplate(true)}
                className="w-full border border-dashed border-slate-200 rounded-xl py-3 text-sm text-slate-400 hover:text-primary-600 hover:border-primary-300 transition-colors flex items-center justify-center gap-2">
                <Plus size={14} />
                Adicionar template
              </button>
            )
          }
        </div>
      )}

      {aba === 'calendario' && (
        <div className="space-y-4">
          <p className="text-sm text-slate-500">
            Gere o calendário de limpeza em PDF para enviar à faxineira.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <Select label="Mês" value={mes} onChange={e => setMes(+e.target.value)}>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i+1} value={i+1}>{mesNome(i+1)}</option>
              ))}
            </Select>
            <Select label="Ano" value={ano} onChange={e => setAno(+e.target.value)}>
              {[2025, 2026, 2027].map(a => <option key={a} value={a}>{a}</option>)}
            </Select>
          </div>
          <Button icon={Download} loading={loadingPdf} onClick={baixarPdf} className="w-full">
            Baixar calendário PDF
          </Button>
        </div>
      )}

      <div className="flex justify-end pt-2">
        <Button variant="secondary" onClick={onClose}>Fechar</Button>
      </div>
    </div>
  )
}

export default ImovelDetalhe
