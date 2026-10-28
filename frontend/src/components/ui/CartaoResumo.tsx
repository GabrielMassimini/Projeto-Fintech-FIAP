import type { IconType } from 'react-icons'

type Cor = 'verde' | 'vermelho' | 'roxo' | 'azul'

interface CartaoResumoProps {
  titulo: string
  valor: string
  rodape: string
  icone: IconType
  destaque?: boolean // o cartão rosa (saldo)
  cor?: Cor
}

const coresIcone: Record<Cor, string> = {
  verde: 'bg-green-100 text-green-600',
  vermelho: 'bg-red-100 text-red-600',
  roxo: 'bg-purple-100 text-purple-600',
  azul: 'bg-blue-100 text-blue-600',
}

const coresRodape: Record<Cor, string> = {
  verde: 'text-green-600',
  vermelho: 'text-red-600',
  roxo: 'text-gray-500',
  azul: 'text-gray-500',
}

export function CartaoResumo({ titulo, valor, rodape, icone: Icone, destaque = false, cor = 'azul' }: CartaoResumoProps) {
  return (
    <div
      className={`rounded-2xl p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
        destaque ? 'bg-linear-to-br from-rosa to-rosa-escuro text-white' : 'border border-gray-100 bg-white'
      }`}
    >
      <div className="mb-3 flex items-center justify-between">
        <span className={`text-sm font-medium ${destaque ? 'text-white/85' : 'text-gray-500'}`}>{titulo}</span>
        <span className={`rounded-lg p-2 ${destaque ? 'bg-white/20 text-white' : coresIcone[cor]}`}>
          <Icone />
        </span>
      </div>
      <p className="text-2xl font-bold tracking-tight">{valor}</p>
      <p className={`mt-1 text-xs ${destaque ? 'text-white/75' : coresRodape[cor]}`}>{rodape}</p>
    </div>
  )
}
