import { useState } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext/useAuth'
import { BarraLateral } from './BarraLateral'
import { Cabecalho } from './Cabecalho'

// Envolve todas as páginas que exigem login. Sem usuário logado, manda para /login.
export function LayoutPrivado() {
  const { usuario } = useAuth()
  const location = useLocation()
  const [menuAberto, setMenuAberto] = useState(false)

  if (!usuario) {
    return <Navigate to="/login" replace state={{ de: location.pathname }} />
  }

  return (
    <div className="flex min-h-screen">
      <BarraLateral aberta={menuAberto} aoFechar={() => setMenuAberto(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Cabecalho aoAbrirMenu={() => setMenuAberto(true)} />
        <main className="flex-1 p-4 sm:p-6">
          {/* Aqui o React Router desenha a página da rota atual */}
          <Outlet />
        </main>
      </div>
    </div>
  )
}
