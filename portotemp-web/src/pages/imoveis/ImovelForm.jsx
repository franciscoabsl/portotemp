import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query'
import * as api from '../../api/imoveis'
import { listar as listarProprietarios } from '../../api/proprietarios'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import Button from '../../components/ui/Button'

const schema = z.object({
  nome: z.string().min(2, 'Nome obrigatório'),
  proprietarioId: z.string().min(1, 'Proprietário obrigatório'),
  endereco: z.string().optional(),
  codigoFechadura: z.string().optional(),
  taxaLimpezaHospede: z.coerce.number().min(0),
  baseCalculoComissao: z.enum(['BRUTO', 'LIQUIDO']),
  percentualComissao: z.coerce.number().min(0).max(100),
  respLimpeza: z.boolean().optional(),
  respLavanderia: z.boolean().optional(),
  respDespesas: z.boolean().optional(),
})

const ImovelForm = ({ data, onSuccess }) => {
  const qc = useQueryClient()
  const { data: proprietarios = [] } = useQuery({ queryKey: ['proprietarios'], queryFn: listarProprietarios })

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: data ?? { baseCalculoComissao: 'LIQUIDO', taxaLimpezaHospede: 0, percentualComissao: 0 },
  })

  const mutation = useMutation({
    mutationFn: (values) => data ? api.atualizar(data.id, values) : api.criar(values),
    onSuccess: () => { qc.invalidateQueries(['imoveis']); onSuccess() },
  })

  return (
    <form onSubmit={handleSubmit(v => mutation.mutate(v))} className="space-y-4">
      <Input label="Nome do imóvel *" placeholder="Apto Boa Viagem 101" error={errors.nome?.message} {...register('nome')} />

      <Select label="Proprietário *" error={errors.proprietarioId?.message} {...register('proprietarioId')}>
        <option value="">Selecione...</option>
        {proprietarios.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
      </Select>

      <Input label="Endereço" placeholder="Av. Boa Viagem, 101" {...register('endereco')} />
      <Input label="Código da fechadura" placeholder="1234" {...register('codigoFechadura')} />

      <div className="grid grid-cols-2 gap-3">
        <Input label="Taxa limpeza (hóspede)" type="number" step="0.01" {...register('taxaLimpezaHospede')} />
        <Input label="Comissão (%)" type="number" step="0.01" {...register('percentualComissao')} />
      </div>

      <Select label="Base de cálculo da comissão" {...register('baseCalculoComissao')}>
        <option value="BRUTO">Sobre valor bruto</option>
        <option value="LIQUIDO">Sobre valor líquido (descontando limpeza/lavanderia)</option>
      </Select>

      <div className="space-y-2">
        <p className="text-sm font-medium text-slate-700">Responsabilidades do gestor</p>
        <div className="space-y-2">
          {[
            { name: 'respLimpeza', label: 'Responsável pela limpeza' },
            { name: 'respLavanderia', label: 'Responsável pela lavanderia' },
            { name: 'respDespesas', label: 'Responsável pelas despesas fixas' },
          ].map(({ name, label }) => (
            <label key={name} className="flex items-center gap-2.5 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded text-primary-600 accent-primary-600" {...register(name)} />
              <span className="text-sm text-slate-700">{label}</span>
            </label>
          ))}
        </div>
      </div>

      {mutation.error && (
        <div className="px-4 py-3 rounded-xl bg-danger-50 border border-danger-100">
          <p className="text-sm text-danger-600">{mutation.error.message}</p>
        </div>
      )}

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onSuccess}>Cancelar</Button>
        <Button type="submit" loading={isSubmitting}>{data ? 'Salvar' : 'Criar imóvel'}</Button>
      </div>
    </form>
  )
}

export default ImovelForm
