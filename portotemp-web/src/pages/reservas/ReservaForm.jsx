import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query'
import * as api from '../../api/reservas'
import { listar as listarImoveis } from '../../api/imoveis'
import { listar as listarHospedes } from '../../api/hospedes'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import Button from '../../components/ui/Button'

const schema = z.object({
  imovelId:          z.string().min(1, 'Imóvel obrigatório'),
  hospedeId:         z.string().min(1, 'Hóspede obrigatório'),
  dataCheckin:       z.string().min(1, 'Data obrigatória'),
  dataCheckout:      z.string().min(1, 'Data obrigatória'),
  origem:            z.enum(['AIRBNB','BOOKING','DIRETO']),
  valorTotal:        z.coerce.number().min(0),
  taxaLimpezaHospede:z.coerce.number().min(0),
  numPessoas:        z.coerce.number().min(1),
  observacoes:       z.string().optional(),
})

const ReservaForm = ({ data, onSuccess }) => {
  const qc = useQueryClient()
  const { data: imoveis = [] }  = useQuery({ queryKey: ['imoveis'],  queryFn: listarImoveis })
  const { data: hospedes = [] } = useQuery({ queryKey: ['hospedes'], queryFn: listarHospedes })

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: data ? {
      ...data,
      dataCheckin:  data.dataCheckin,
      dataCheckout: data.dataCheckout,
    } : { origem: 'DIRETO', numPessoas: 1, valorTotal: 0, taxaLimpezaHospede: 0 },
  })

  const mutation = useMutation({
    mutationFn: (values) => data ? api.atualizar(data.id, values) : api.criar(values),
    onSuccess: () => { qc.invalidateQueries(['reservas']); onSuccess() },
  })

  return (
    <form onSubmit={handleSubmit(v => mutation.mutate(v))} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Select label="Imóvel *" error={errors.imovelId?.message} {...register('imovelId')}>
          <option value="">Selecione...</option>
          {imoveis.map(i => <option key={i.id} value={i.id}>{i.nome}</option>)}
        </Select>
        <Select label="Hóspede *" error={errors.hospedeId?.message} {...register('hospedeId')}>
          <option value="">Selecione...</option>
          {hospedes.map(h => <option key={h.id} value={h.id}>{h.nome}</option>)}
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Input label="Check-in *" type="date" error={errors.dataCheckin?.message} {...register('dataCheckin')} />
        <Input label="Check-out *" type="date" error={errors.dataCheckout?.message} {...register('dataCheckout')} />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Select label="Origem *" {...register('origem')}>
          <option value="AIRBNB">Airbnb</option>
          <option value="BOOKING">Booking</option>
          <option value="DIRETO">Direto</option>
        </Select>
        <Input label="Valor total *" type="number" step="0.01" {...register('valorTotal')} />
        <Input label="Nº de pessoas *" type="number" {...register('numPessoas')} />
      </div>

      <Input label="Taxa limpeza (hóspede)" type="number" step="0.01" {...register('taxaLimpezaHospede')} />

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-slate-700">Observações</label>
        <textarea
          className="input-field resize-none"
          rows={3}
          placeholder="Informações adicionais..."
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
