const EmptyState = ({ icon: Icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    {Icon && (
      <div className="w-12 h-12 rounded-xl bg-neutral-100 flex items-center justify-center mb-4">
        <Icon size={22} className="text-neutral-400" strokeWidth={1.5} />
      </div>
    )}
    <h3 className="text-sm font-medium text-neutral-700">{title}</h3>
    {description && <p className="text-sm text-neutral-400 mt-1 max-w-xs">{description}</p>}
    {action && <div className="mt-4">{action}</div>}
  </div>
)

export default EmptyState
