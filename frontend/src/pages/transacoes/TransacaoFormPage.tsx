import { useNavigate, useParams } from 'react-router-dom'
import { LuWallet } from 'react-icons/lu'
import { TransacaoFormulario } from '../../components/transacoes/TransacaoFormulario'
import { Alerta } from '../../components/ui/Alerta'
import { BotaoLink } from '../../components/ui/BotaoLink'
import { CabecalhoPagina } from '../../components/ui/CabecalhoPagina'
import { Carregando } from '../../components/ui/Carregando'
import { EstadoVazio } from '../../components/ui/EstadoVazio'
import { useAuth } from '../../contexts/AuthContext/useAuth'
import { useCarregar } from '../../hooks/useCarregar'
import { categoriaService } from '../../services/categoriaService'
import { contaService } from '../../services/contaService'
import { transacaoService } from '../../services/transacaoService'
import type { TransacaoForm } from '../../types/Transacao'

// Atende /transacoes/nova e /transacoes/:id/editar
export function TransacaoFormPage() {
  const { id } = useParams<{ id: string }>()
  const edicao = id !== undefined
  const navigate = useNavigate()
  const { usuario } = useAuth()
  const { dados, carregando, erro } = useCarregar(
    () =>
      Promise.all([
        contaService.listar(usuario!.id),
        categoriaService.listar(),
        edicao ? transacaoService.buscar(Number(id)) : Promise.resolve(undefined),
      ]),
    [id, usuario?.id],
  )

  async function salvar(dadosForm: TransacaoForm) {
    if (edicao) {
      const atualizada = await transacaoService.atualizar(Number(id), dadosForm)
      navigate('/transacoes', { state: { mensagem: `Transação "${atualizada.descricao}" atualizada.` } })
    } else {
      const criada = await transacaoService.criar(dadosForm)
      navigate('/transacoes', { state: { mensagem: `Transação "${criada.descricao}" lançada.` } })
    }
  }

  function conteudo() {
    if (carregando) {
      return <Carregando />
    }
    if (erro || !dados) {
      return <Alerta>{erro ?? 'Não foi possível carregar os dados'}</Alerta>
    }
    const [contas, categorias, transacao] = dados
    if (contas.length === 0) {
      return (
        <EstadoVazio icone={LuWallet} titulo="Você precisa de uma conta">
          <p>As transações entram e saem do saldo de uma conta.</p>
          <BotaoLink to="/contas/nova">Abrir conta</BotaoLink>
        </EstadoVazio>
      )
    }
    return (
      <TransacaoFormulario
        contas={contas}
        categorias={categorias}
        inicial={transacao}
        aoSalvar={salvar}
        aoCancelar={() => navigate('/transacoes')}
      />
    )
  }

  return (
    <>
      <CabecalhoPagina
        titulo={edicao ? 'Editar transação' : 'Nova transação'}
        subtitulo={edicao ? 'Ao mudar valor ou categoria, o saldo é corrigido pela diferença' : 'Lance uma receita ou despesa'}
      />
      {conteudo()}
    </>
  )
}
