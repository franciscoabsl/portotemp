import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { MessageSquare, XCircle, ExternalLink, Phone, Calendar, Users, DollarSign } from 'lucide-react'
import * as api from '../../api/reservas'
import { formatDate, formatCurrency } from '../../utils/formatters'
import { STATUS_RESERVA, ORIGEM_RESERVA, TIPOS_TEMPLATE } from '../../utils/constants'
import Button from '../../components/ui/Button'

const statusColor = {
  success: 'bg-success-50 text-success-600',
  primary: 'bg-primary-50 text-primary-700',
  neutral: 'bg-slate-100 text-slate-500',
  danger:  'bg-danger-50 text-danger-600',
}

const IDIOMAS = { PT: 'Português', EN: 'Inglês', ES: 'Espanhol' }

const ReservaDetalhe = ({ reserva: r, onClose }) => {
  const qc = useQueryClient()
  const [cancelando, setCancelando] = useState(false)
  const [multa, setMulta] = useState('')
  const [motivo, setMotivo] = useState('')
  const [tipoMsg, setTipoMsg] = useState('CONFIRMACAO')
  const [idioma, setIdioma] = useState('PT')
  const [linkResult, setLinkResult] = useState(null)
  const [loadingLink, setLoadingLink] = useState(false)

  const cancelarMutation = useMutation({
    mutationFn: () => api.cancelar(r.id, {
      valorMulta: multa ? parseFloat(multa) : 0,
      motivo: motivo || null,
    }),
    onSuccess: () => { qc.invalidateQueries(['reservas']); onClose() },
  })

  const gerarLink = async () => {
    setLoadingLink(true)
    try {
      const result = await api.gerarLinkWhatsApp(r.id, tipoMsg, idioma)
      setLinkResult(result)
    } catch (e) {
      alert(e.message)
    } finally {
      setLoadingLink(false)
    }
  }

  const status = STATUS_RESERVA[r.status]
  const cancelada = r.status === 'CANCELADA'
  const concluida = r.status === 'CONCLUIDA'

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <span className={`badge text-sm px-3 py-1 ${statusColor[status?.color]}`}>
          {status?.label}
        </span>
        <span className="badge bg-slate-100 text-slate-600">{ORIGEM_RESERVA[r.origem]}</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-50 rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-slate-400">
            <Users size={13} />
            <span className="text-xs font-medium uppercase tracking-wide">Hóspede</span>
          </div>
          <p className="font-bold text-slate-900">{r.hospedeNome}</p>
          {r.hospedeTelefone && (
            <p className="text-sm text-slate-500 flex items-center gap-1">
              <Phone size={12} />{r.hospedeTelefone}
            </p>
          )}
          <p className="text-sm text-slate-400">{r.numPessoas} pessoa{r.numPessoas !== 1 ? 's' : ''}</p>
        </div>

        <div className="bg-slate-50 rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-slate-400">
            <Calendar size={13} />
            <span className="text-xs font-medium uppercase tracking-wide">Período</span>
          </div>
          <p className="font-bold text-slate-900">{formatDate(r.dataCheckin)}</p>
          <p className="text-sm text-slate-400">até {formatDate(r.dataCheckout)}</p>
          <p className="text-sm text-slate-500">{r.imovelNome}</p>
        </div>

        <div className="bg-slate-50 rounded-xl p-4 space-y-2 col-span-2">
          <div className="flex items-center gap-2 text-slate-400">
            <DollarSign size={13} />
            <span className="text-xs font-medium uppercase tracking-wide">Financeiro</span>
          </div>
          <div className="flex gap-6">
            <div>
              <p className="text-xs text-slate-400">Valor total</p>
              <p className="font-bold text-slate-900">{formatCurrency(r.valorTotal)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Taxa limpeza</p>
              <p className="font-bold text-slate-900">{formatCurrency(r.taxaLimpezaHospede)}</p>
            </div>
          </div>
        </div>
      </div>

      {r.observacoes && (
        <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
          <p className="text-xs font-medium text-amber-700 mb-1">Observações</p>
          <p className="text-sm text-amber-800">{r.observacoes}</p>
        </div>
      )}

      {!cancelada && r.hospedeTelefone && (
        <div className="border border-slate-100 rounded-xl p-4 space-y-3">
          <p className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <MessageSquare size={15} className="text-primary-600" />
            Enviar mensagem WhatsApp
          </p>
          <div className="grid grid-cols-2 gap-2">
            <select
              className="input-field"
              value={tipoMsg}
              onChange={e => { setTipoMsg(e.target.value); setLinkResult(null) }}
            >
              {Object.entries(TIPOS_TEMPLATE).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
            <select
              className="input-field"
              value={idioma}
              onChange={e => { setIdioma(e.target.value); setLinkResult(null) }}
            >
              {Object.entries(IDIOMAS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>
          <Button variant="secondary" icon={ExternalLink} loading={loadingLink} onClick={gerarLink} className="w-full">
            Gerar link WhatsApp
          </Button>
          {linkResult && (
            <div className="bg-success-50 border border-success-100 rounded-xl px-4 py-3 space-y-2">
              <p className="text-xs text-success-700 font-medium">Mensagem gerada:</p>
              <p className="text-sm text-slate-700 italic">"{linkResult.mensagem}"</p>
              <button
                onClick={() => window.open(linkResult.link, '_blank')}
                className="btn-primary text-xs px-3 py-1.5"
              >
                <ExternalLink size={12} />
                Abrir WhatsApp
              </button>
            </div>
          )}
        </div>
      )}

      {!cancelada && !concluida && (
        <div className="border border-danger-100 rounded-xl p-4 space-y-3">
          <button
            onClick={() => setCancelando(!cancelando)}
            className="text-sm font-medium text-danger-500 hover:text-danger-600 flex items-center gap-2 transition-colors"
          >
            <XCircle size={15} />
            {cancelando ? 'Ocultar cancelamento' : 'Cancelar reserva'}
          </button>
          {cancelando && (
            <div className="space-y-3 pt-1">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-slate-700">Valor da multa</label>
                  <input type="number" step="0.01" placeholder="0,00" className="input-field"
                    value={multa} onChange={e => setMulta(e.target.value)} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-slate-700">Motivo</label>
                  <input type="text" placeholder="Motivo do cancelamento" className="input-field"
                    value={motivo} onChange={e => setMotivo(e.target.value)} />
                </div>
              </div>
              <Button variant="danger" icon={XCircle}
                loading={cancelarMutation.isPending}
                onClick={() => cancelarMutation.mutate()}>
                Confirmar cancelamento
              </Button>
            </div>
          )}
        </div>
      )}

      <div className="flex justify-end pt-1">
        <Button variant="secondary" onClick={onClose}>Fechar</Button>
      </div>
    </div>
  )
}

export default ReservaDetalhe
