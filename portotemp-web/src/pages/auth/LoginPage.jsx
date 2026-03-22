import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowRight, Loader2, Mail, Lock } from 'lucide-react'
import { login } from '../../api/auth'
import useAuthStore from '../../store/authStore'

const schema = z.object({
  email: z.string().email('Email inválido'),
  senha: z.string().min(1, 'Informe sua senha'),
})

const LoginPage = () => {
  const navigate = useNavigate()
  const loginStore = useAuthStore(s => s.login)
  const [error, setError] = useState('')

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data) => {
    try {
      setError('')
      const response = await login(data)
      loginStore(response)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="space-y-7">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Bem-vindo de volta</h2>
        <p className="text-slate-500 text-sm mt-1.5">Entre com suas credenciais para acessar o painel</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700">Email</label>
          <div className="relative">
            <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="email"
              placeholder="seu@email.com"
              className={`input-field pl-9 ${errors.email ? 'error' : ''}`}
              {...register('email')}
            />
          </div>
          {errors.email && <p className="text-xs text-danger-500">{errors.email.message}</p>}
        </div>

        {/* Senha */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700">Senha</label>
          <div className="relative">
            <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="password"
              placeholder="••••••••"
              className={`input-field pl-9 ${errors.senha ? 'error' : ''}`}
              {...register('senha')}
            />
          </div>
          {errors.senha && <p className="text-xs text-danger-500">{errors.senha.message}</p>}
        </div>

        {/* Erro global */}
        {error && (
          <div className="px-4 py-3 rounded-xl bg-danger-50 border border-danger-100">
            <p className="text-sm text-danger-600 font-medium">{error}</p>
          </div>
        )}

        {/* Botão */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary w-full mt-2"
        >
          {isSubmitting
            ? <><Loader2 size={15} className="animate-spin" /> Entrando...</>
            : <><span>Entrar</span><ArrowRight size={15} /></>
          }
        </button>
      </form>

      <p className="text-center text-xs text-slate-400">
        Acesso restrito a usuários autorizados
      </p>
    </div>
  )
}

export default LoginPage
