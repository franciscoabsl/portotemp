const Select = ({ label, error, children, className = '', ...props }) => (
  <div className="flex flex-col gap-1">
    {label && <label className="text-sm font-medium text-neutral-700">{label}</label>}
    <select
      className={`w-full px-3 py-2 text-sm rounded-lg border transition-colors
        focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
        bg-white
        ${error
          ? 'border-danger-500 bg-danger-50'
          : 'border-neutral-300 hover:border-neutral-400'
        } ${className}`}
      {...props}
    >
      {children}
    </select>
    {error && <p className="text-xs text-danger-500">{error}</p>}
  </div>
)

export default Select
