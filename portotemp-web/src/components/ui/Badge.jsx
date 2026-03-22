const colors = {
  success: 'bg-success-50 text-success-600',
  primary: 'bg-primary-50 text-primary-700',
  warning: 'bg-warning-50 text-warning-600',
  danger:  'bg-danger-50 text-danger-600',
  neutral: 'bg-neutral-100 text-neutral-600',
}

const Badge = ({ children, color = 'neutral' }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[color]}`}>
    {children}
  </span>
)

export default Badge
