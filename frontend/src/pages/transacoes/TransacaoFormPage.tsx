import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { LuWallet } from 'react-icons/lu'
import { TransacaoFormulario } from '../../components/transacoes/TransacaoFormulario'
import { Alerta } from '../../components/ui/Alerta'
import { BotaoLink } from '../../components/ui/BotaoLink'
import { CabecalhoPagina } from '../../components/ui/CabecalhoPagina'
import { Carregando } from '../../components/ui/Carregando'
import { EstadoVazio } from '../../components/ui/EstadoVazio'
import { useAuth } from '../../contexts/AuthContext/useAuth'
import { mensagemDeErro } from '../../services/api'
import { categoriaService } from '../../services/categoriaService'
import { contaService } from '../../services/contaService'
import { transacaoService } from '../../services/transacaoService'
import type { Categoria } from '../../types/Categoria'
import type { Conta } from '../../types/Conta'
import type { Transacao, TransacaoForm } from '../../types/Transacao'

// Atende /transacoes/nova e /transacoes/:id/editar
export function TransacaoFormPage() {
  const { id } = useParams()
  const edicao = id !== undefined
  const navigate = useNavigate()
  const { usuario } = useAuth()
  const [contas, setContas] = useState<Conta[]>([])
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [transacao, setTransacao] = useState<Transacao | undefined>(undefined)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  // O formulário precisa das contas e das categorias (e da transação, na edição)
  useEffect(() => {
    async function carregar() {
      try {
        setContas(await contaService.listar(usuario!.id))
        setCategorias(await categoriaService.listar())
        if (id) {
          setTransacao(await transacaoService.buscar(Number(id)))
        }
      } catch (e) {
        setErro(mensagemDeErro(e))
      } finally {
        setCarregando(false)
      }
    }
    carregar()
  }, [id, usuario])

  async function salvar(dados: TransacaoForm) {
    if (edicao) {
      const atualizada = await transacaoService.atualizar(Number(id), dados)
      navigate('/transacoes', { state: { mensagem: `Transação "${atualizada.descricao}" atualizada.` } })
    } else {
      const criada = await transacaoService.criar(dados)
      navigate('/transacoes', { state: { mensagem: `Transação "${criada.descricao}" lançada.` } })
    }
  }

  return (
    <>
      <CabecalhoPagina
        titulo={edicao ? 'Editar transação' : 'Nova transação'}
        subtitulo={edicao ? 'Ao mudar valor ou categoria, o saldo é corrigido pela diferença' : 'Lance uma receita ou despesa'}
      />
      {carregando ? (
        <Carregando />
      ) : erro ? (
        <Alerta>{erro}</Alerta>
      ) : contas.length === 0 ? (
        <EstadoVazio icone={LuWallet} titulo="Você precisa de uma conta">
          <p>As transações entram e saem do saldo de uma conta.</p>
          <BotaoLink to="/contas/nova">Abrir conta</BotaoLink>
        </EstadoVazio>
      ) : (
        <TransacaoFormulario
          contas={contas}
          categorias={categorias}
          inicial={transacao}
          aoSalvar={salvar}
          aoCancelar={() => navigate('/transacoes')}
        />
      )}
    </>
  )
}
