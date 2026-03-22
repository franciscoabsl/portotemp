const PageHeader = ({ title, subtitle, action }) => (
  <div className="flex items-start justify-between mb-6">
    <div>
      <h1 className="text-xl font-semibold text-neutral-900">{title}</h1>
      {subtitle && <p className="text-sm text-neutral-500 mt-0.5">{subtitle}</p>}
    </div>
    {action && <div className="flex items-center gap-2">{action}</div>}
  </div>
)

export default PageHeader
