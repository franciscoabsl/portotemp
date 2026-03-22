import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query'
import { UserPlus, X } from 'lucide-react'
import * as api from '../../api/reservas'
import { listar as listarImoveis } from '../../api/imoveis'
import { listar as listarHospedes, criar as criarHospede } from '../../api/hospedes'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import Button from '../../components/ui/Button'

const schema = z.object({
  imovelId:           z.string().min(1, 'Imóvel obrigatório'),
  hospedeId:          z.string().min(1, 'Hóspede obrigatório'),
  dataCheckin:        z.string().min(1, 'Data obrigatória'),
  dataCheckout:       z.string().min(1, 'Data obrigatória'),
  origem:             z.enum(['AIRBNB', 'BOOKING', 'DIRETO']),
  valorTotal:         z.coerce.number().min(0),
  taxaLimpezaHospede: z.coerce.number().min(0),
  numPessoas:         z.coerce.number().min(1),
  observacoes:        z.string().optional(),
})

const NovoHospedeInline = ({ onCreated, onCancel }) => {
  const qc = useQueryClient()
  const [nome, setNome] = useState('')
  const [telefone, setTelefone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSave = async () => {
    if (!nome.trim()) { setError('Nome obrigatório'); return }
    setLoading(true)
    try {
      const hospede = await criarHospede({ nome, telefone })
      qc.invalidateQueries(['hospedes'])
      onCreated(hospede)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-primary-50 border border-primary-100 rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-primary-700">Novo hóspede</p>
        <button onClick={onCancel} className="text-slate-400 hover:text-slate-600 transition-colors">
          <X size={16} />
        </button>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Input
          placeholder="Nome completo *"
          value={nome}
          onChange={e => setNome(e.target.value)}
        />
        <Input
          placeholder="Telefone"
          value={telefone}
          onChange={e => setTelefone(e.target.value)}
        />
      </div>
      {error && <p className="text-xs text-danger-500">{error}</p>}
      <div className="flex justify-end gap-2">
        <Button size="sm" variant="secondary" onClick={onCancel}>Cancelar</Button>
        <Button size="sm" loading={loading} onClick={handleSave}>Salvar hóspede</Button>
      </div>
    </div>
  )
}

const ReservaForm = ({ data, onSuccess }) => {
  const qc = useQueryClient()
  const [novoHospede, setNovoHospede] = useState(false)

  const { data: imoveis = [] }  = useQuery({ queryKey: ['imoveis'],  queryFn: listarImoveis })
  const { data: hospedes = [] } = useQuery({ queryKey: ['hospedes'], queryFn: listarHospedes })

  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: data
      ? { ...data }
      : { origem: 'DIRETO', numPessoas: 1, valorTotal: 0, taxaLimpezaHospede: 0 },
  })

  const hospedeId = watch('hospedeId')

  const mutation = useMutation({
    mutationFn: (values) => data ? api.atualizar(data.id, values) : api.criar(values),
    onSuccess: () => { qc.invalidateQueries(['reservas']); onSuccess() },
  })

  const handleHospedeCreated = (hospede) => {
    setValue('hospedeId', hospede.id)
    setNovoHospede(false)
  }

  return (
    <form onSubmit={handleSubmit(v => mutation.mutate(v))} className="space-y-4">
      {/* Imóvel */}
      <Select label="Imóvel *" error={errors.imovelId?.message} {...register('imovelId')}>
        <option value="">Selecione o imóvel...</option>
        {imoveis.map(i => <option key={i.id} value={i.id}>{i.nome}</option>)}
      </Select>

      {/* Hóspede */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-slate-700">Hóspede *</label>
          {!novoHospede && (
            <button
              type="button"
              onClick={() => setNovoHospede(true)}
              className="flex items-center gap-1.5 text-xs font-medium text-primary-600 hover:text-primary-700 transition-colors"
            >
              <UserPlus size={13} />
              Novo hóspede
            </button>
          )}
        </div>

        {novoHospede ? (
          <NovoHospedeInline
            onCreated={handleHospedeCreated}
            onCancel={() => setNovoHospede(false)}
          />
        ) : (
          <select
            className={`input-field ${errors.hospedeId ? 'error' : ''}`}
            {...register('hospedeId')}
          >
            <option value="">Selecione o hóspede...</option>
            {hospedes.map(h => (
              <option key={h.id} value={h.id}>
                {h.nome}{h.telefone ? ` — ${h.telefone}` : ''}
              </option>
            ))}
          </select>
        )}
        {errors.hospedeId && <p className="text-xs text-danger-500">{errors.hospedeId.message}</p>}
      </div>

      {/* Datas */}
      <div className="grid grid-cols-2 gap-3">
        <Input label="Check-in *" type="date" error={errors.dataCheckin?.message} {...register('dataCheckin')} />
        <Input label="Check-out *" type="date" error={errors.dataCheckout?.message} {...register('dataCheckout')} />
      </div>

      {/* Origem + Valor + Pessoas */}
      <div className="grid grid-cols-3 gap-3">
        <Select label="Origem *" {...register('origem')}>
          <option value="AIRBNB">Airbnb</option>
          <option value="BOOKING">Booking</option>
          <option value="DIRETO">Direto</option>
        </Select>
        <Input label="Valor total *" type="number" step="0.01" error={errors.valorTotal?.message} {...register('valorTotal')} />
        <Input label="Nº de pessoas *" type="number" min="1" error={errors.numPessoas?.message} {...register('numPessoas')} />
      </div>

      <Input
        label="Taxa limpeza cobrada do hóspede"
        type="number"
        step="0.01"
        {...register('taxaLimpezaHospede')}
      />

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-slate-700">Observações</label>
        <textarea
          className="input-field resize-none"
          rows={3}
          placeholder="Informações adicionais sobre a reserva..."
          {...register('observacoes')}
        />
      </div>

      {mutation.error && (
        <div className="px-4 py-3 rounded-xl bg-danger-50 border border-danger-100">
          <p className="text-sm text-danger-600">{mutation.error.message}</p>
        </div>
      )}

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onSuccess}>Cancelar</Button>
        <Button type="submit" loading={isSubmitting}>{data ? 'Salvar' : 'Criar reserva'}</Button>
      </div>
    </form>
  )
}

export default ReservaForm
