import { useState } from 'react'
import { LuPlus, LuWallet } from 'react-icons/lu'
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
import { contaService } from '../../services/contaService'
import type { Conta, StatusConta } from '../../types/Conta'
import { formatarData, formatarMoeda } from '../../utils/formatadores'

const corDoStatus: Record<StatusConta, CorEtiqueta> = {
  ATIVA: 'verde',
  BLOQUEADA: 'amarelo',
  ENCERRADA: 'cinza',
}

export function ContasPage() {
  const { usuario } = useAuth()
  const { dados, setDados, carregando, erro } = useCarregar(() => contaService.listar(usuario!.id), [usuario?.id])
  const mensagemRota = useMensagemDaRota()
  const [paraExcluir, setParaExcluir] = useState<Conta | null>(null)
  const [excluindo, setExcluindo] = useState(false)
  const [aviso, setAviso] = useState<{ tipo: 'erro' | 'sucesso'; texto: string } | null>(null)

  const contas = dados ?? []
  const saldoTotal = contas.reduce((total, conta) => total + conta.saldoDisponivel, 0)

  async function confirmarExclusao() {
    if (!paraExcluir) {
      return
    }
    setExcluindo(true)
    try {
      await contaService.excluir(paraExcluir.id)
      setDados(contas.filter((c) => c.id !== paraExcluir.id))
      setAviso({ tipo: 'sucesso', texto: `Conta ${paraExcluir.numeroConta} excluída.` })
    } catch (e) {
      setAviso({ tipo: 'erro', texto: mensagemDeErro(e) })
    } finally {
      setExcluindo(false)
      setParaExcluir(null)
    }
  }

  const colunas: Coluna<Conta>[] = [
    {
      titulo: 'Conta',
      conteudo: (c) => (
        <div>
          <p className="font-medium text-gray-900">{c.numeroConta}</p>
          <p className="text-xs text-gray-500">Agência {c.agencia}</p>
        </div>
      ),
    },
    { titulo: 'Tipo', conteudo: (c) => (c.tipoConta === 'CORRENTE' ? 'Corrente' : 'Poupança') },
    {
      titulo: 'Saldo disponível',
      alinharDireita: true,
      conteudo: (c) => <span className="font-semibold text-gray-900">{formatarMoeda(c.saldoDisponivel)}</span>,
    },
    { titulo: 'Abertura', conteudo: (c) => formatarData(c.dataAbertura) },
    { titulo: 'Status', conteudo: (c) => <Etiqueta cor={corDoStatus[c.statusConta]}>{c.statusConta}</Etiqueta> },
    {
      titulo: 'Ações',
      alinharDireita: true,
      conteudo: (c) => (
        <AcoesLinha editarPara={`/contas/${c.id}/editar`} aoExcluir={() => setParaExcluir(c)} descricao={`conta ${c.numeroConta}`} />
      ),
    },
  ]

  return (
    <>
      <CabecalhoPagina
        titulo="Minhas contas"
        subtitulo={contas.length > 0 ? `Saldo somado: ${formatarMoeda(saldoTotal)}` : 'Suas contas no MassPay'}
        acoes={
          <BotaoLink to="/contas/nova">
            <LuPlus aria-hidden /> Abrir conta
          </BotaoLink>
        }
      />

      <div className="space-y-4">
        {aviso ? <Alerta tipo={aviso.tipo}>{aviso.texto}</Alerta> : mensagemRota && <Alerta tipo="sucesso">{mensagemRota}</Alerta>}
        {erro && <Alerta>{erro}</Alerta>}

        {carregando ? (
          <Carregando />
        ) : contas.length === 0 ? (
          <EstadoVazio icone={LuWallet} titulo="Você ainda não tem contas">
            <p>Abra uma conta para lançar transações e fazer investimentos.</p>
            <BotaoLink to="/contas/nova">Abrir conta</BotaoLink>
          </EstadoVazio>
        ) : (
          <Tabela colunas={colunas} itens={contas} chave={(c) => c.id} />
        )}
      </div>

      <ModalConfirmacao
        aberto={paraExcluir !== null}
        titulo="Excluir conta?"
        processando={excluindo}
        aoConfirmar={confirmarExclusao}
        aoCancelar={() => setParaExcluir(null)}
      >
        A conta <strong>{paraExcluir?.numeroConta}</strong> será excluída. Contas com transações ou investimentos não podem
        ser excluídas: apague-os antes.
      </ModalConfirmacao>
    </>
  )
}
