import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

const AppLayout = () => (
  <div className="flex min-h-screen bg-neutral-50">
    <Sidebar />
    <div className="flex-1 flex flex-col min-w-0">
      <Topbar />
      <main className="flex-1 p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  </div>
)

export default AppLayout
