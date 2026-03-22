import { Loader2 } from 'lucide-react'

const variants = {
  primary:  'bg-primary-600 text-white hover:bg-primary-700 border-transparent',
  secondary:'bg-white text-neutral-700 hover:bg-neutral-50 border-neutral-300',
  danger:   'bg-danger-500 text-white hover:bg-danger-600 border-transparent',
  ghost:    'bg-transparent text-neutral-600 hover:bg-neutral-100 border-transparent',
}

const sizes = {
  sm: 'px-3 py-1.5 text-xs gap-1.5',
  md: 'px-4 py-2 text-sm gap-2',
  lg: 'px-5 py-2.5 text-base gap-2',
}

const Button = ({
  children, variant = 'primary', size = 'md',
  loading, disabled, icon: Icon, className = '', ...props
}) => (
  <button
    disabled={disabled || loading}
    className={`inline-flex items-center justify-center font-medium rounded-lg border
      transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary-500
      focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed
      ${variants[variant]} ${sizes[size]} ${className}`}
    {...props}
  >
    {loading
      ? <Loader2 size={14} className="animate-spin" />
      : Icon && <Icon size={14} strokeWidth={2} />
    }
    {children}
  </button>
)

export default Button
