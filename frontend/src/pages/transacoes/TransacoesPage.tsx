import { useState } from 'react'
import { LuArrowLeftRight, LuPlus } from 'react-icons/lu'
import { AcoesLinha } from '../../components/ui/AcoesLinha'
import { Alerta } from '../../components/ui/Alerta'
import { BotaoLink } from '../../components/ui/BotaoLink'
import { CabecalhoPagina } from '../../components/ui/CabecalhoPagina'
import { CampoSelecao } from '../../components/ui/CampoSelecao'
import { Carregando } from '../../components/ui/Carregando'
import { EstadoVazio } from '../../components/ui/EstadoVazio'
import { Etiqueta } from '../../components/ui/Etiqueta'
import { ModalConfirmacao } from '../../components/ui/ModalConfirmacao'
import { Tabela, type Coluna } from '../../components/ui/Tabela'
import { useAuth } from '../../contexts/AuthContext/useAuth'
import { useCarregar } from '../../hooks/useCarregar'
import { useMensagemDaRota } from '../../hooks/useMensagemDaRota'
import { mensagemDeErro } from '../../services/api'
import { transacaoService } from '../../services/transacaoService'
import type { Transacao } from '../../types/Transacao'
import { nomeDaCategoria } from '../../utils/categorias'
import { formatarData, formatarMoeda } from '../../utils/formatadores'

export function TransacoesPage() {
  const { usuario } = useAuth()
  const { dados, setDados, carregando, erro } = useCarregar(() => transacaoService.listarDoUsuario(usuario!.id), [usuario?.id])
  const mensagemRota = useMensagemDaRota()
  const [filtroConta, setFiltroConta] = useState('')
  const [filtroTipo, setFiltroTipo] = useState('')
  const [paraExcluir, setParaExcluir] = useState<Transacao | null>(null)
  const [excluindo, setExcluindo] = useState(false)
  const [aviso, setAviso] = useState<{ tipo: 'erro' | 'sucesso'; texto: string } | null>(null)

  const transacoes = dados ?? []
  // Contas que aparecem nas transações, para o filtro
  const contas = [...new Map(transacoes.map((t) => [t.conta.id, t.conta])).values()]
  const filtradas = transacoes.filter(
    (t) => (filtroConta === '' || String(t.conta.id) === filtroConta) && (filtroTipo === '' || t.tipoTransacao === filtroTipo),
  )
  const entradas = filtradas.filter((t) => t.tipoTransacao === 'RECEITA').reduce((s, t) => s + t.valor, 0)
  const saidas = filtradas.filter((t) => t.tipoTransacao === 'DESPESA').reduce((s, t) => s + t.valor, 0)

  async function confirmarExclusao() {
    if (!paraExcluir) {
      return
    }
    setExcluindo(true)
    try {
      await transacaoService.excluir(paraExcluir.id)
      setDados(transacoes.filter((t) => t.id !== paraExcluir.id))
      setAviso({ tipo: 'sucesso', texto: `Transação "${paraExcluir.descricao}" excluída e saldo da conta corrigido.` })
    } catch (e) {
      setAviso({ tipo: 'erro', texto: mensagemDeErro(e) })
    } finally {
      setExcluindo(false)
      setParaExcluir(null)
    }
  }

  const colunas: Coluna<Transacao>[] = [
    { titulo: 'Data', conteudo: (t) => <span className="whitespace-nowrap">{formatarData(t.dataTransacao)}</span> },
    {
      titulo: 'Descrição',
      conteudo: (t) => (
        <div>
          <p className="font-medium text-gray-900">{t.descricao}</p>
          <p className="text-xs text-gray-500">{nomeDaCategoria(t.categoria.nomeCategoria)}</p>
        </div>
      ),
    },
    { titulo: 'Conta', conteudo: (t) => <span className="whitespace-nowrap">{t.conta.numeroConta}</span> },
    {
      titulo: 'Tipo',
      conteudo: (t) => (
        <Etiqueta cor={t.tipoTransacao === 'RECEITA' ? 'verde' : 'vermelho'}>
          {t.tipoTransacao === 'RECEITA' ? 'Receita' : 'Despesa'}
        </Etiqueta>
      ),
    },
    {
      titulo: 'Valor',
      alinharDireita: true,
      conteudo: (t) => (
        <span className={`whitespace-nowrap font-semibold ${t.tipoTransacao === 'RECEITA' ? 'text-green-600' : 'text-red-600'}`}>
          {t.tipoTransacao === 'RECEITA' ? '+ ' : '- '}
          {formatarMoeda(t.valor)}
        </span>
      ),
    },
    {
      titulo: 'Saldo após',
      alinharDireita: true,
      conteudo: (t) => <span className="whitespace-nowrap text-gray-500">{formatarMoeda(t.saldoApos)}</span>,
    },
    {
      titulo: 'Ações',
      alinharDireita: true,
      conteudo: (t) => (
        <AcoesLinha editarPara={`/transacoes/${t.id}/editar`} aoExcluir={() => setParaExcluir(t)} descricao={`transação ${t.descricao}`} />
      ),
    },
  ]

  return (
    <>
      <CabecalhoPagina
        titulo="Transações"
        subtitulo="Receitas e despesas das suas contas"
        acoes={
          <BotaoLink to="/transacoes/nova">
            <LuPlus aria-hidden /> Nova transação
          </BotaoLink>
        }
      />

      <div className="space-y-4">
        {aviso ? <Alerta tipo={aviso.tipo}>{aviso.texto}</Alerta> : mensagemRota && <Alerta tipo="sucesso">{mensagemRota}</Alerta>}
        {erro && <Alerta>{erro}</Alerta>}

        {carregando ? (
          <Carregando />
        ) : transacoes.length === 0 ? (
          <EstadoVazio icone={LuArrowLeftRight} titulo="Nenhuma transação ainda">
            <p>Lance sua primeira receita ou despesa.</p>
            <BotaoLink to="/transacoes/nova">Nova transação</BotaoLink>
          </EstadoVazio>
        ) : (
          <>
            <div className="flex flex-wrap items-end gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
              <CampoSelecao rotulo="Conta" value={filtroConta} onChange={(e) => setFiltroConta(e.target.value)} className="w-44">
                <option value="">Todas</option>
                {contas.map((conta) => (
                  <option key={conta.id} value={conta.id}>
                    {conta.numeroConta}
                  </option>
                ))}
              </CampoSelecao>
              <CampoSelecao rotulo="Tipo" value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value)} className="w-44">
                <option value="">Todos</option>
                <option value="RECEITA">Receitas</option>
                <option value="DESPESA">Despesas</option>
              </CampoSelecao>
              <p className="ml-auto text-sm text-gray-500">
                <span className="font-semibold text-green-600">+ {formatarMoeda(entradas)}</span> ·{' '}
                <span className="font-semibold text-red-600">- {formatarMoeda(saidas)}</span>
              </p>
            </div>
            {filtradas.length === 0 ? (
              <p className="py-8 text-center text-sm text-gray-500">Nenhuma transação com esses filtros.</p>
            ) : (
              <Tabela colunas={colunas} itens={filtradas} chave={(t) => t.id} />
            )}
          </>
        )}
      </div>

      <ModalConfirmacao
        aberto={paraExcluir !== null}
        titulo="Excluir transação?"
        processando={excluindo}
        aoConfirmar={confirmarExclusao}
        aoCancelar={() => setParaExcluir(null)}
      >
        <strong>{paraExcluir?.descricao}</strong> ({formatarMoeda(paraExcluir?.valor)}) será excluída e o saldo da conta
        voltará ao que era antes dela.
      </ModalConfirmacao>
    </>
  )
}
