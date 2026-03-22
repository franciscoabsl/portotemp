const Card = ({ children, className = '', ...props }) => (
  <div
    className={`bg-white rounded-xl border border-neutral-200 shadow-card ${className}`}
    {...props}
  >
    {children}
  </div>
)

export const CardHeader = ({ children, className = '' }) => (
  <div className={`px-6 py-4 border-b border-neutral-100 ${className}`}>{children}</div>
)

export const CardBody = ({ children, className = '' }) => (
  <div className={`px-6 py-4 ${className}`}>{children}</div>
)

export default Card
