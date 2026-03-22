import { UserCog } from 'lucide-react'
import PageHeader from '../../components/shared/PageHeader'
import EmptyState from '../../components/shared/EmptyState'

const UsuariosPage = () => (
  <>
    <PageHeader title="Usuários" subtitle="Gerencie acessos ao sistema" />
    <div className="card">
      <EmptyState
        icon={UserCog}
        title="Módulo em construção"
        description="O gerenciamento de usuários e convites estará disponível em breve."
      />
    </div>
  </>
)

export default UsuariosPage
