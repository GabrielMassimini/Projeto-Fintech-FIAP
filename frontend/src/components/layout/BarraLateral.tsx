import { NavLink } from 'react-router-dom'
import type { IconType } from 'react-icons'
import { LuArrowLeftRight, LuLayoutDashboard, LuLogOut, LuTags, LuTrendingUp, LuUsers, LuWallet, LuX } from 'react-icons/lu'
import { useAuth } from '../../contexts/AuthContext/useAuth'
import { Logo } from '../ui/Logo'

interface ItemMenu {
  para: string
  rotulo: string
  icone: IconType
}

const itens: ItemMenu[] = [
  { para: '/', rotulo: 'Início', icone: LuLayoutDashboard },
  { para: '/contas', rotulo: 'Contas', icone: LuWallet },
  { para: '/transacoes', rotulo: 'Transações', icone: LuArrowLeftRight },
  { para: '/investimentos', rotulo: 'Investimentos', icone: LuTrendingUp },
  { para: '/categorias', rotulo: 'Categorias', icone: LuTags },
  { para: '/usuarios', rotulo: 'Usuários', icone: LuUsers },
]

interface BarraLateralProps {
  aberta: boolean
  aoFechar: () => void
}

export function BarraLateral({ aberta, aoFechar }: BarraLateralProps) {
  const { sair } = useAuth()

  return (
    <>
      {/* Fundo escuro atrás do menu no celular */}
      <div
        className={`fixed inset-0 z-30 bg-gray-900/40 transition-opacity lg:hidden ${aberta ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
        onClick={aoFechar}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-60 flex-col border-r border-gray-100 bg-white transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
          aberta ? 'translate-x-0 shadow-xl' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
          <Logo />
          <button
            type="button"
            onClick={aoFechar}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 lg:hidden"
            aria-label="Fechar menu"
          >
            <LuX />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">Menu</p>
          <ul className="space-y-1">
            {itens.map((item) => (
              <li key={item.para}>
                <NavLink
                  to={item.para}
                  end={item.para === '/'}
                  onClick={aoFechar}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                      isActive ? 'bg-rosa-claro text-rosa' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`
                  }
                >
                  <item.icone className="text-lg" />
                  {item.rotulo}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="border-t border-gray-100 p-3">
          <button
            type="button"
            onClick={sair}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
          >
            <LuLogOut className="text-lg" />
            Sair
          </button>
        </div>
      </aside>
    </>
  )
}
