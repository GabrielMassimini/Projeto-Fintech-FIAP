import { useState } from 'react'
import { LuPlus, LuTrendingUp } from 'react-icons/lu'
import { AcoesLinha } from '../../components/ui/AcoesLinha'
import { Alerta } from '../../components/ui/Alerta'
import { BotaoLink } from '../../components/ui/BotaoLink'
import { CabecalhoPagina } from '../../components/ui/CabecalhoPagina'
import { Carregando } from '../../components/ui/Carregando'
import { EstadoVazio } from '../../components/ui/EstadoVazio'
import { Etiqueta, type CorEtiqueta } from '../../components/ui/Etiqueta'
import { ModalConfirmacao } from '../../components/ui/ModalConfirmacao'
import { Tabela, type Coluna } from '../../components/ui/Tabela'
import { useAuth } from '../../contexts/AuthContext/useAuth'
import { useCarregar } from '../../hooks/useCarregar'
import { useMensagemDaRota } from '../../hooks/useMensagemDaRota'
import { mensagemDeErro } from '../../services/api'
import { investimentoService } from '../../services/investimentoService'
import type { Investimento, StatusInvestimento } from '../../types/Investimento'
import { formatarData, formatarMoeda, formatarPercentualAno } from '../../utils/formatadores'
import { nomesTipoInvestimento } from '../../utils/investimentos'

const corDoStatus: Record<StatusInvestimento, CorEtiqueta> = {
  ATIVO: 'verde',
  RESGATADO: 'roxo',
  ENCERRADO: 'cinza',
}

export function InvestimentosPage() {
  const { usuario } = useAuth()
  const { dados, setDados, carregando, erro } = useCarregar(
    () => investimentoService.listarDoUsuario(usuario!.id),
    [usuario?.id],
  )
  const mensagemRota = useMensagemDaRota()
  const [paraExcluir, setParaExcluir] = useState<Investimento | null>(null)
  const [excluindo, setExcluindo] = useState(false)
  const [aviso, setAviso] = useState<{ tipo: 'erro' | 'sucesso'; texto: string } | null>(null)

  const investimentos = dados ?? []
  const totalAtivo = investimentos
    .filter((i) => i.statusInvestimento === 'ATIVO')
    .reduce((total, i) => total + i.valorAplicado, 0)

  async function confirmarExclusao() {
    if (!paraExcluir) {
      return
    }
    setExcluindo(true)
    try {
      await investimentoService.excluir(paraExcluir.id)
      setDados(investimentos.filter((i) => i.id !== paraExcluir.id))
      setAviso({
        tipo: 'sucesso',
        texto:
          paraExcluir.statusInvestimento === 'ATIVO'
            ? `Aplicação "${paraExcluir.nomeInvestimento}" cancelada e ${formatarMoeda(paraExcluir.valorAplicado)} devolvidos à conta.`
            : `Investimento "${paraExcluir.nomeInvestimento}" excluído.`,
      })
    } catch (e) {
      setAviso({ tipo: 'erro', texto: mensagemDeErro(e) })
    } finally {
      setExcluindo(false)
      setParaExcluir(null)
    }
  }

  const colunas: Coluna<Investimento>[] = [
    {
      titulo: 'Investimento',
      conteudo: (i) => (
        <div>
          <p className="font-medium text-gray-900">{i.nomeInvestimento}</p>
          <p className="text-xs text-gray-500">{nomesTipoInvestimento[i.tipoInvestimento]}</p>
        </div>
      ),
    },
    { titulo: 'Conta', conteudo: (i) => <span className="whitespace-nowrap">{i.conta.numeroConta}</span> },
    {
      titulo: 'Valor aplicado',
      alinharDireita: true,
      conteudo: (i) => <span className="whitespace-nowrap font-semibold text-gray-900">{formatarMoeda(i.valorAplicado)}</span>,
    },
    {
      titulo: 'Rentabilidade',
      alinharDireita: true,
      conteudo: (i) => formatarPercentualAno(i.percentualRendimento),
    },
    { titulo: 'Aplicação', conteudo: (i) => formatarData(i.dataAplicacao) },
    { titulo: 'Vencimento', conteudo: (i) => formatarData(i.dataVencimento) },
    {
      titulo: 'Status',
      conteudo: (i) => <Etiqueta cor={corDoStatus[i.statusInvestimento]}>{i.statusInvestimento}</Etiqueta>,
    },
    {
      titulo: 'Ações',
      alinharDireita: true,
      conteudo: (i) => (
        <AcoesLinha
          editarPara={`/investimentos/${i.id}/editar`}
          aoExcluir={() => setParaExcluir(i)}
          descricao={`investimento ${i.nomeInvestimento}`}
        />
      ),
    },
  ]

  return (
    <>
      <CabecalhoPagina
        titulo="Investimentos"
        subtitulo={investimentos.length > 0 ? `Total em aplicações ativas: ${formatarMoeda(totalAtivo)}` : 'Suas aplicações'}
        acoes={
          <BotaoLink to="/investimentos/novo">
            <LuPlus aria-hidden /> Novo investimento
          </BotaoLink>
        }
      />

      <div className="space-y-4">
        {aviso ? <Alerta tipo={aviso.tipo}>{aviso.texto}</Alerta> : mensagemRota && <Alerta tipo="sucesso">{mensagemRota}</Alerta>}
        {erro && <Alerta>{erro}</Alerta>}

        {carregando ? (
          <Carregando />
        ) : investimentos.length === 0 ? (
          <EstadoVazio icone={LuTrendingUp} titulo="Nenhum investimento ainda">
            <p>Aplique parte do saldo de uma conta em CDB, Tesouro e outros.</p>
            <BotaoLink to="/investimentos/novo">Novo investimento</BotaoLink>
          </EstadoVazio>
        ) : (
          <Tabela colunas={colunas} itens={investimentos} chave={(i) => i.id} />
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
