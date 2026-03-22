import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query'
import * as api from '../../api/despesas'
import { listar as listarImoveis } from '../../api/imoveis'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import Button from '../../components/ui/Button'

const schema = z.object({
  imovelId:      z.string().min(1, 'Imóvel obrigatório'),
  tipo:          z.string().min(1, 'Tipo obrigatório'),
  descricao:     z.string().optional(),
  valor:         z.coerce.number().min(0.01, 'Valor obrigatório'),
  competencia:   z.string().min(1, 'Competência obrigatória'),
  statusPagamento: z.enum(['PAGO','PENDENTE']),
})

const TIPOS = ['CONDOMINIO','ENERGIA','AGUA','INTERNET','MANUTENCAO','OUTRO']

const DespesaForm = ({ onSuccess }) => {
  const qc = useQueryClient()
  const { data: imoveis = [] } = useQuery({ queryKey: ['imoveis'], queryFn: listarImoveis })

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { statusPagamento: 'PAGO' },
  })

  const mutation = useMutation({
    mutationFn: api.criar,
    onSuccess: () => { qc.invalidateQueries(['despesas']); onSuccess() },
  })

  return (
    <form onSubmit={handleSubmit(v => mutation.mutate(v))} className="space-y-4">
      <Select label="Imóvel *" error={errors.imovelId?.message} {...register('imovelId')}>
        <option value="">Selecione...</option>
        {imoveis.map(i => <option key={i.id} value={i.id}>{i.nome}</option>)}
      </Select>

      <div className="grid grid-cols-2 gap-3">
        <Select label="Tipo *" error={errors.tipo?.message} {...register('tipo')}>
          <option value="">Selecione...</option>
          {TIPOS.map(t => <option key={t} value={t}>{t}</option>)}
        </Select>
        <Input label="Competência *" type="date" error={errors.competencia?.message} {...register('competencia')} />
      </div>

      <Input label="Descrição" placeholder="Detalhes adicionais" {...register('descricao')} />

      <div className="grid grid-cols-2 gap-3">
        <Input label="Valor *" type="number" step="0.01" error={errors.valor?.message} {...register('valor')} />
        <Select label="Status" {...register('statusPagamento')}>
          <option value="PAGO">Pago</option>
          <option value="PENDENTE">Pendente</option>
        </Select>
      </div>

      {mutation.error && (
        <div className="px-4 py-3 rounded-xl bg-danger-50 border border-danger-100">
          <p className="text-sm text-danger-600">{mutation.error.message}</p>
        </div>
      )}

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onSuccess}>Cancelar</Button>
        <Button type="submit" loading={isSubmitting}>Registrar despesa</Button>
      </div>
    </form>
  )
}

export default DespesaForm
