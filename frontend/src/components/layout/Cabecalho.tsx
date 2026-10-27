import { LuMenu } from 'react-icons/lu'
import { useAuth } from '../../contexts/AuthContext/useAuth'
import { iniciais, primeiroNome } from '../../utils/formatadores'

interface CabecalhoProps {
  aoAbrirMenu: () => void
  menuAberto: boolean
}

export function Cabecalho({ aoAbrirMenu, menuAberto }: CabecalhoProps) {
  const { usuario } = useAuth()
  const nome = usuario?.nomeCompleto ?? ''

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-gray-100 bg-white/90 px-4 py-3 backdrop-blur sm:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={aoAbrirMenu}
          className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 lg:hidden"
          aria-label="Abrir menu de navegação"
          aria-controls="barra-lateral"
          aria-expanded={menuAberto}
        >
          <LuMenu className="text-xl" />
        </button>
        <div>
          <p className="text-xs text-gray-500">Bem-vindo de volta 👋</p>
          <p className="text-base font-semibold text-gray-900">Olá, {primeiroNome(nome)}!</p>
        </div>
      </div>
      <div
        className="flex h-10 w-10 select-none items-center justify-center rounded-full bg-rosa text-sm font-semibold text-white"
        title={nome}
      >
        {iniciais(nome)}
      </div>
    </header>
  )
}
