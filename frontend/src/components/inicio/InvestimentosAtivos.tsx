import { Link } from 'react-router-dom'
import { LuTrendingUp } from 'react-icons/lu'
import type { Investimento } from '../../types/Investimento'
import { formatarMoeda } from '../../utils/formatadores'
import { Caixa } from '../ui/Caixa'

interface InvestimentosAtivosProps {
  investimentos: Investimento[]
}

export function InvestimentosAtivos({ investimentos }: InvestimentosAtivosProps) {
  const ativos = investimentos.filter((investimento) => investimento.statusInvestimento === 'ATIVO')

  return (
    <Caixa
      titulo="Investimentos ativos"
      acao={
        <Link to="/investimentos" className="text-sm font-medium text-rosa hover:underline">
          Ver todos
        </Link>
      }
    >
      {ativos.length === 0 ? (
        <p className="py-4 text-center text-sm text-gray-500">Nenhum investimento ativo.</p>
      ) : (
        <ul className="space-y-3">
          {ativos.map((investimento) => (
            <li key={investimento.id} className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
                <LuTrendingUp aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-900">{investimento.nomeInvestimento}</p>
                <p className="text-xs text-gray-500">
                  {investimento.tipoInvestimento}
                  {investimento.percentualRendimento != null && ` · ${investimento.percentualRendimento}% a.a.`}
                </p>
              </div>
              <span className="text-sm font-semibold text-gray-900">{formatarMoeda(investimento.valorAplicado)}</span>
            </li>
          ))}
        </ul>
      )}
    </Caixa>
  )
}
