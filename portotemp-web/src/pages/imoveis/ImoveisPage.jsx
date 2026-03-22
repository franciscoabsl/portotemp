import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Pencil, Trash2, Home, Settings } from 'lucide-react'
import * as api from '../../api/imoveis'
import PageHeader from '../../components/shared/PageHeader'
import EmptyState from '../../components/shared/EmptyState'
import Modal from '../../components/ui/Modal'
import Button from '../../components/ui/Button'
import Spinner from '../../components/ui/Spinner'
import ImovelForm from './ImovelForm'
import ImovelDetalhe from './ImovelDetalhe'

const ImoveisPage = () => {
  const qc = useQueryClient()
  const [modal, setModal]     = useState({ open: false, data: null })
  const [detalhe, setDetalhe] = useState(null)

  const { data: imoveis = [], isLoading } = useQuery({ queryKey: ['imoveis'], queryFn: api.listar })
  const deleteMutation = useMutation({ mutationFn: api.inativar, onSuccess: () => qc.invalidateQueries(['imoveis']) })

  if (isLoading) return <div className="flex justify-center py-20"><Spinner size={28} /></div>

  return (
    <>
      <PageHeader
        title="Imóveis"
        subtitle={`${imoveis.length} imóvel${imoveis.length !== 1 ? 'is' : ''} cadastrado${imoveis.length !== 1 ? 's' : ''}`}
        action={<Button icon={Plus} onClick={() => setModal({ open: true, data: null })}>Novo imóvel</Button>}
      />

      {imoveis.length === 0 ? (
        <div className="card">
          <EmptyState icon={Home} title="Nenhum imóvel cadastrado"
            description="Cadastre o primeiro imóvel para começar a gerenciar reservas."
            action={<Button icon={Plus} onClick={() => setModal({ open: true, data: null })}>Adicionar imóvel</Button>} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {imoveis.map(i => (
            <div key={i.id} className="card p-5 flex flex-col gap-4">
              <div className="flex items-start justify-between">
                <div className="min-w-0">
                  <p className="font-bold text-slate-900 truncate">{i.nome}</p>
                  <p className="text-xs text-slate-400 mt-0.5 truncate">{i.proprietarioNome}</p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                  <button onClick={() => setDetalhe(i)}
                    className="p-1.5 rounded-lg hover:bg-primary-50 text-slate-400 hover:text-primary-600 transition-colors"
                    title="Templates e calendário">
                    <Settings size={14} />
                  </button>
                  <button onClick={() => setModal({ open: true, data: i })}
                    className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => deleteMutation.mutate(i.id)}
                    className="p-1.5 rounded-lg hover:bg-danger-50 text-slate-400 hover:text-danger-500 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 rounded-xl px-3 py-2.5">
                  <p className="text-xs text-slate-400">Comissão</p>
                  <p className="text-sm font-bold text-slate-800 mt-0.5">{i.percentualComissao}%</p>
                  <p className="text-xs text-slate-400">{i.baseCalculoComissao === 'BRUTO' ? 'Bruto' : 'Líquido'}</p>
                </div>
                <div className="bg-slate-50 rounded-xl px-3 py-2.5">
                  <p className="text-xs text-slate-400">Taxa limpeza</p>
                  <p className="text-sm font-bold text-slate-800 mt-0.5">R$ {Number(i.taxaLimpezaHospede).toFixed(2)}</p>
                  <p className="text-xs text-slate-400">cobrado do hóspede</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {i.respLimpeza    && <span className="badge bg-primary-50 text-primary-700">Limpeza</span>}
                {i.respLavanderia && <span className="badge bg-primary-50 text-primary-700">Lavanderia</span>}
                {i.respDespesas   && <span className="badge bg-primary-50 text-primary-700">Despesas</span>}
                {i.codigoFechadura && <span className="badge bg-amber-50 text-amber-700">🔑 {i.codigoFechadura}</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modal.open} onClose={() => setModal({ open: false, data: null })}
        title={modal.data ? 'Editar imóvel' : 'Novo imóvel'} size="lg">
        <ImovelForm data={modal.data} onSuccess={() => setModal({ open: false, data: null })} />
      </Modal>

      <Modal open={!!detalhe} onClose={() => setDetalhe(null)}
        title="Configurações do imóvel" size="lg">
        {detalhe && <ImovelDetalhe imovel={detalhe} onClose={() => setDetalhe(null)} />}
      </Modal>
    </>
  )
}

export default ImoveisPage
