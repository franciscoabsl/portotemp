import { X } from 'lucide-react'
import { useEffect } from 'react'

const Modal = ({ open, onClose, title, children, size = 'md' }) => {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    if (open) document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  if (!open) return null

  const sizes = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative bg-white rounded-xl shadow-modal w-full ${sizes[size]} max-h-[90vh] flex flex-col`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
          <h3 className="text-base font-semibold text-neutral-900">{title}</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-neutral-100 text-neutral-400 transition-colors">
            <X size={18} />
          </button>
        </div>
        <div className="overflow-y-auto flex-1 px-6 py-4">{children}</div>
      </div>
    </div>
  )
}

export default Modal
