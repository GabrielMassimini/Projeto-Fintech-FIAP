import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { LuPlus, LuTrendingUp } from 'react-icons/lu'
import { AcoesLinha } from '../../components/ui/AcoesLinha'
import { Alerta } from '../../components/ui/Alerta'
import { BotaoLink } from '../../components/ui/BotaoLink'
import { CabecalhoPagina } from '../../components/ui/CabecalhoPagina'
import { Carregando } from '../../components/ui/Carregando'
import { EstadoVazio } from '../../components/ui/EstadoVazio'
import { Etiqueta } from '../../components/ui/Etiqueta'
import { ModalConfirmacao } from '../../components/ui/ModalConfirmacao'
import { useAuth } from '../../contexts/AuthContext/useAuth'
import { mensagemDeErro } from '../../services/api'
import { investimentoService } from '../../services/investimentoService'
import type { Investimento } from '../../types/Investimento'
import { formatarData, formatarMoeda, formatarPercentualAno } from '../../utils/formatadores'
import { nomesTipoInvestimento } from '../../utils/investimentos'

function corDoStatus(status: string) {
  if (status === 'ATIVO') return 'verde'
  if (status === 'RESGATADO') return 'roxo'
  return 'cinza'
}

export function InvestimentosPage() {
  const { usuario } = useAuth()
  const location = useLocation()
  const [investimentos, setInvestimentos] = useState<Investimento[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const [sucesso, setSucesso] = useState<string | null>(location.state?.mensagem ?? null)
  const [paraExcluir, setParaExcluir] = useState<Investimento | null>(null)
  const [excluindo, setExcluindo] = useState(false)

  useEffect(() => {
    async function carregar() {
      try {
        setInvestimentos(await investimentoService.listarDoUsuario(usuario!.id))
      } catch (e) {
        setErro(mensagemDeErro(e))
      } finally {
        setCarregando(false)
      }
    }
    carregar()
  }, [usuario])

  let totalAtivo = 0
  for (const i of investimentos) {
    if (i.statusInvestimento === 'ATIVO') {
      totalAtivo += i.valorAplicado
    }
  }

  async function confirmarExclusao() {
    if (!paraExcluir) {
      return
    }
    setExcluindo(true)
    setErro(null)
    setSucesso(null)
    try {
      await investimentoService.excluir(paraExcluir.id)
      setInvestimentos(investimentos.filter((i) => i.id !== paraExcluir.id))
      if (paraExcluir.statusInvestimento === 'ATIVO') {
        setSucesso(
          `Aplicação "${paraExcluir.nomeInvestimento}" cancelada e ${formatarMoeda(paraExcluir.valorAplicado)} devolvidos à conta.`,
        )
      } else {
        setSucesso(`Investimento "${paraExcluir.nomeInvestimento}" excluído.`)
      }
    } catch (e) {
      setErro(mensagemDeErro(e))
    } finally {
      setExcluindo(false)
      setParaExcluir(null)
    }
  }

  return (
    <>
      <CabecalhoPagina
        titulo="Investimentos"
        subtitulo={investimentos.length > 0 ? `Total em aplicações ativas: ${formatarMoeda(totalAtivo)}` : 'Suas aplicações'}
        acoes={
          <BotaoLink to="/investimentos/novo">
            <LuPlus /> Novo investimento
          </BotaoLink>
        }
      />

      <div className="space-y-4">
        {sucesso && <Alerta tipo="sucesso">{sucesso}</Alerta>}
        {erro && <Alerta>{erro}</Alerta>}

        {carregando ? (
          <Carregando />
        ) : investimentos.length === 0 ? (
          <EstadoVazio icone={LuTrendingUp} titulo="Nenhum investimento ainda">
            <p>Aplique parte do saldo de uma conta em CDB, Tesouro e outros.</p>
            <BotaoLink to="/investimentos/novo">Novo investimento</BotaoLink>
          </EstadoVazio>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-100 bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-4 py-3">Investimento</th>
                  <th className="px-4 py-3">Conta</th>
                  <th className="px-4 py-3 text-right">Valor aplicado</th>
                  <th className="px-4 py-3 text-right">Rentabilidade</th>
                  <th className="px-4 py-3">Aplicação</th>
                  <th className="px-4 py-3">Vencimento</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {investimentos.map((i) => (
                  <tr key={i.id} className="hover:bg-rosa-xclaro/60">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{i.nomeInvestimento}</p>
                      <p className="text-xs text-gray-500">{nomesTipoInvestimento[i.tipoInvestimento]}</p>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">{i.conta.numeroConta}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-right font-semibold text-gray-900">
                      {formatarMoeda(i.valorAplicado)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right">{formatarPercentualAno(i.percentualRendimento)}</td>
                    <td className="px-4 py-3">{formatarData(i.dataAplicacao)}</td>
                    <td className="px-4 py-3">{formatarData(i.dataVencimento)}</td>
                    <td className="px-4 py-3">
                      <Etiqueta cor={corDoStatus(i.statusInvestimento)}>{i.statusInvestimento}</Etiqueta>
                    </td>
                    <td className="px-4 py-3">
                      <AcoesLinha
                        editarPara={`/investimentos/${i.id}/editar`}
                        aoExcluir={() => setParaExcluir(i)}
                        descricao={`investimento ${i.nomeInvestimento}`}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ModalConfirmacao
        aberto={paraExcluir !== null}
        titulo="Excluir investimento?"
        processando={excluindo}
        aoConfirmar={confirmarExclusao}
        aoCancelar={() => setParaExcluir(null)}
      >
        <strong>{paraExcluir?.nomeInvestimento}</strong> será excluído.
        {paraExcluir?.statusInvestimento === 'ATIVO' &&
          ` Como ele ainda está ativo, ${formatarMoeda(paraExcluir.valorAplicado)} voltam para a conta ${paraExcluir.conta.numeroConta}.`}
      </ModalConfirmacao>
    </>
  )
}
