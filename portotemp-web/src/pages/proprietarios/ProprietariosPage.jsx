import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Pencil, Trash2, Users, Phone, Mail } from 'lucide-react'
import * as api from '../../api/proprietarios'
import PageHeader from '../../components/shared/PageHeader'
import EmptyState from '../../components/shared/EmptyState'
import Modal from '../../components/ui/Modal'
import Button from '../../components/ui/Button'
import Spinner from '../../components/ui/Spinner'
import ProprietarioForm from './ProprietarioForm'

const ProprietariosPage = () => {
  const qc = useQueryClient()
  const [modal, setModal] = useState({ open: false, data: null })

  const { data: proprietarios = [], isLoading } = useQuery({
    queryKey: ['proprietarios'],
    queryFn: api.listar,
  })

  const deleteMutation = useMutation({
    mutationFn: api.inativar,
    onSuccess: () => qc.invalidateQueries(['proprietarios']),
  })

  const openCreate = () => setModal({ open: true, data: null })
  const openEdit   = (p) => setModal({ open: true, data: p })
  const closeModal = () => setModal({ open: false, data: null })

  if (isLoading) return <div className="flex justify-center py-20"><Spinner size={28} /></div>

  return (
    <>
      <PageHeader
        title="Proprietários"
        subtitle={`${proprietarios.length} proprietário${proprietarios.length !== 1 ? 's' : ''} cadastrado${proprietarios.length !== 1 ? 's' : ''}`}
        action={<Button icon={Plus} onClick={openCreate}>Novo proprietário</Button>}
      />

      {proprietarios.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={Users}
            title="Nenhum proprietário cadastrado"
            description="Adicione o primeiro proprietário para começar a gerenciar imóveis."
            action={<Button icon={Plus} onClick={openCreate}>Adicionar proprietário</Button>}
          />
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="px-5 py-3.5 text-left table-header">Nome</th>
                <th className="px-5 py-3.5 text-left table-header">Contato</th>
                <th className="px-5 py-3.5 text-left table-header">CPF / CNPJ</th>
                <th className="px-5 py-3.5 text-left table-header">Status</th>
                <th className="px-5 py-3.5 text-right table-header">Ações</th>
              </tr>
            </thead>
            <tbody>
              {proprietarios.map(p => (
                <tr key={p.id} className="table-row">
                  <td className="table-cell font-semibold text-slate-800">{p.nome}</td>
                  <td className="table-cell">
                    <div className="space-y-0.5">
                      {p.email && (
                        <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                          <Mail size={12} />{p.email}
                        </div>
                      )}
                      {p.telefone && (
                        <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                          <Phone size={12} />{p.telefone}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="table-cell text-slate-500">{p.cpfCnpj || '—'}</td>
                  <td className="table-cell">
                    <span className={`badge ${p.ativo ? 'bg-success-50 text-success-600' : 'bg-slate-100 text-slate-500'}`}>
                      {p.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="table-cell text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => openEdit(p)}
                        className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => deleteMutation.mutate(p.id)}
                        className="p-1.5 rounded-lg hover:bg-danger-50 text-slate-400 hover:text-danger-500 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        open={modal.open}
        onClose={closeModal}
        title={modal.data ? 'Editar proprietário' : 'Novo proprietário'}
      >
        <ProprietarioForm
          data={modal.data}
          onSuccess={closeModal}
        />
      </Modal>
    </>
  )
}

export default ProprietariosPage
