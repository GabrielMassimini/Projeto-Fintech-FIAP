import { Link } from 'react-router-dom'
import type { Transacao } from '../../types/Transacao'
import { formatarData, formatarMoeda } from '../../utils/formatadores'
import { iconeDaCategoria, nomeDaCategoria } from '../../utils/categorias'
import { Caixa } from '../ui/Caixa'

interface TransacoesRecentesProps {
  transacoes: Transacao[]
  limite?: number
}

export function TransacoesRecentes({ transacoes, limite = 5 }: TransacoesRecentesProps) {
  const recentes = transacoes.slice(0, limite)

  return (
    <Caixa
      titulo="Transações recentes"
      acao={
        <Link to="/transacoes" className="text-sm font-medium text-rosa hover:underline">
          Ver todas
        </Link>
      }
    >
      {recentes.length === 0 ? (
        <p className="py-6 text-center text-sm text-gray-500">Nenhuma transação ainda.</p>
      ) : (
        <ul className="divide-y divide-gray-100">
          {recentes.map((transacao) => {
            const receita = transacao.tipoTransacao === 'RECEITA'
            const Icone = iconeDaCategoria(transacao.categoria.nomeCategoria)
            return (
              <li key={transacao.id} className="flex items-center gap-3 py-3">
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                    receita ? 'bg-green-100 text-green-600' : 'bg-rosa-claro text-rosa'
                  }`}
                >
                  <Icone aria-hidden />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900">{transacao.descricao}</p>
                  <p className="text-xs text-gray-500">
                    {nomeDaCategoria(transacao.categoria.nomeCategoria)} · {formatarData(transacao.dataTransacao)} · Conta{' '}
                    {transacao.conta.numeroConta}
                  </p>
                </div>
                <span className={`whitespace-nowrap text-sm font-semibold ${receita ? 'text-green-600' : 'text-red-600'}`}>
                  {receita ? '+ ' : '- '}
                  {formatarMoeda(transacao.valor)}
                </span>
              </li>
            )
          })}
        </ul>
      )}
    </Caixa>
  )
}
