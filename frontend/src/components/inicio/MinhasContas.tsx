import { Link } from 'react-router-dom'
import { LuWallet } from 'react-icons/lu'
import type { Conta } from '../../types/Conta'
import { formatarMoeda } from '../../utils/formatadores'
import { BotaoLink } from '../ui/BotaoLink'
import { Caixa } from '../ui/Caixa'

interface MinhasContasProps {
  contas: Conta[]
}

export function MinhasContas({ contas }: MinhasContasProps) {
  return (
    <Caixa
      titulo="Minhas contas"
      acao={
        <Link to="/contas" className="text-sm font-medium text-rosa hover:underline">
          Gerenciar
        </Link>
      }
    >
      {contas.length === 0 ? (
        <div className="py-4 text-center">
          <p className="mb-3 text-sm text-gray-500">Você ainda não tem conta no MassPay.</p>
          <BotaoLink to="/contas/nova">Abrir conta</BotaoLink>
        </div>
      ) : (
        <ul className="space-y-3">
          {contas.map((conta) => (
            <li key={conta.id} className="flex items-center gap-3 rounded-xl bg-gray-50 p-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-rosa-claro text-rosa">
                <LuWallet aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900">Conta {conta.numeroConta}</p>
                <p className="truncate text-xs text-gray-500">
                  {conta.tipoConta === 'CORRENTE' ? 'Corrente' : 'Poupança'} · Ag. {conta.agencia}
                  {conta.statusConta !== 'ATIVA' && ` · ${conta.statusConta}`}
                </p>
              </div>
              <span className="text-sm font-semibold text-gray-900">{formatarMoeda(conta.saldoDisponivel)}</span>
            </li>
          ))}
        </ul>
      )}
    </Caixa>
  )
}
