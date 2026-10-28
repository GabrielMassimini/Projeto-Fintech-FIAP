import { useEffect, useState } from 'react'
import { LuPiggyBank, LuPlus, LuTrendingDown, LuTrendingUp, LuWallet } from 'react-icons/lu'
import { InvestimentosAtivos } from '../components/inicio/InvestimentosAtivos'
import { MinhasContas } from '../components/inicio/MinhasContas'
import { TransacoesRecentes } from '../components/inicio/TransacoesRecentes'
import { Alerta } from '../components/ui/Alerta'
import { BotaoLink } from '../components/ui/BotaoLink'
import { Carregando } from '../components/ui/Carregando'
import { CartaoResumo } from '../components/ui/CartaoResumo'
import { useAuth } from '../contexts/AuthContext/useAuth'
import { mensagemDeErro } from '../services/api'
import { contaService } from '../services/contaService'
import { investimentoService } from '../services/investimentoService'
import { transacaoService } from '../services/transacaoService'
import type { Conta } from '../types/Conta'
import type { Investimento } from '../types/Investimento'
import type { Transacao } from '../types/Transacao'
import { diasAtrasIso, formatarMoeda } from '../utils/formatadores'

function somar(valores: number[]): number {
  return valores.reduce((total, valor) => total + valor, 0)
}

export function InicioPage() {
  const { usuario } = useAuth()
  const [contas, setContas] = useState<Conta[]>([])
  const [transacoes, setTransacoes] = useState<Transacao[]>([])
  const [investimentos, setInvestimentos] = useState<Investimento[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  // Busca as contas, transações e investimentos do usuário logado
  useEffect(() => {
    async function carregar() {
      try {
        setContas(await contaService.listar(usuario!.id))
        setTransacoes(await transacaoService.listarDoUsuario(usuario!.id))
        setInvestimentos(await investimentoService.listarDoUsuario(usuario!.id))
      } catch (e) {
        setErro(mensagemDeErro(e))
      } finally {
        setCarregando(false)
      }
    }
    carregar()
  }, [usuario])

  if (carregando) {
    return <Carregando texto="Carregando seu resumo..." />
  }

  // Datas AAAA-MM-DD podem ser comparadas como texto
  const inicioPeriodo = diasAtrasIso(30)
  const recentes = transacoes.filter((t) => t.dataTransacao >= inicioPeriodo)
  const saldo = somar(contas.map((c) => c.saldoDisponivel))
  const entradas = somar(recentes.filter((t) => t.tipoTransacao === 'RECEITA').map((t) => t.valor))
  const saidas = somar(recentes.filter((t) => t.tipoTransacao === 'DESPESA').map((t) => t.valor))
  const investido = somar(investimentos.filter((i) => i.statusInvestimento === 'ATIVO').map((i) => i.valorAplicado))

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Visão geral</h1>
          <p className="text-sm text-gray-500">Resumo das suas contas no MassPay</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <BotaoLink to="/investimentos/novo" variante="secundario">
            <LuTrendingUp /> Novo investimento
          </BotaoLink>
          <BotaoLink to="/transacoes/nova">
            <LuPlus /> Nova transação
          </BotaoLink>
        </div>
      </div>

      {erro && <Alerta>{erro}</Alerta>}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <CartaoResumo
          destaque
          titulo="Saldo disponível"
          valor={formatarMoeda(saldo)}
          rodape={`Somando ${contas.length} ${contas.length === 1 ? 'conta' : 'contas'}`}
          icone={LuWallet}
        />
        <CartaoResumo titulo="Entradas" valor={formatarMoeda(entradas)} rodape="Últimos 30 dias" icone={LuTrendingUp} cor="verde" />
        <CartaoResumo titulo="Saídas" valor={formatarMoeda(saidas)} rodape="Últimos 30 dias" icone={LuTrendingDown} cor="vermelho" />
        <CartaoResumo
          titulo="Investido"
          valor={formatarMoeda(investido)}
          rodape="Em aplicações ativas"
          icone={LuPiggyBank}
          cor="roxo"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <TransacoesRecentes transacoes={transacoes} />
        </div>
        <div className="space-y-6">
          <MinhasContas contas={contas} />
          <InvestimentosAtivos investimentos={investimentos} />
        </div>
      </div>
    </div>
  )
}
