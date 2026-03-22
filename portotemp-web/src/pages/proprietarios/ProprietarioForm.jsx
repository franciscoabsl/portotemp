import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import * as api from '../../api/proprietarios'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'

const schema = z.object({
  nome:     z.string().min(2, 'Nome obrigatório'),
  email:    z.string().email('Email inválido').optional().or(z.literal('')),
  telefone: z.string().optional(),
  cpfCnpj:  z.string().optional(),
})

const ProprietarioForm = ({ data, onSuccess }) => {
  const qc = useQueryClient()

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: data ?? {},
  })

  const mutation = useMutation({
    mutationFn: (values) => data ? api.atualizar(data.id, values) : api.criar(values),
    onSuccess: () => {
      qc.invalidateQueries(['proprietarios'])
      onSuccess()
    },
  })

  const onSubmit = (values) => mutation.mutate(values)

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input label="Nome completo *" placeholder="João Silva" error={errors.nome?.message} {...register('nome')} />
      <Input label="Email" type="email" placeholder="joao@email.com" error={errors.email?.message} {...register('email')} />
      <Input label="Telefone" placeholder="(81) 99999-9999" {...register('telefone')} />
      <Input label="CPF / CNPJ" placeholder="000.000.000-00" {...register('cpfCnpj')} />

      {mutation.error && (
        <div className="px-4 py-3 rounded-xl bg-danger-50 border border-danger-100">
          <p className="text-sm text-danger-600">{mutation.error.message}</p>
        </div>
      )}

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onSuccess}>Cancelar</Button>
        <Button type="submit" loading={isSubmitting}>{data ? 'Salvar' : 'Criar proprietário'}</Button>
      </div>
    </form>
  )
}

export default ProprietarioForm
