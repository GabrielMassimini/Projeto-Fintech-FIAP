import { useNavigate, useParams } from 'react-router-dom'
import { LuWallet } from 'react-icons/lu'
import { InvestimentoFormulario } from '../../components/investimentos/InvestimentoFormulario'
import { Alerta } from '../../components/ui/Alerta'
import { BotaoLink } from '../../components/ui/BotaoLink'
import { CabecalhoPagina } from '../../components/ui/CabecalhoPagina'
import { Carregando } from '../../components/ui/Carregando'
import { EstadoVazio } from '../../components/ui/EstadoVazio'
import { useAuth } from '../../contexts/AuthContext/useAuth'
import { useCarregar } from '../../hooks/useCarregar'
import { contaService } from '../../services/contaService'
import { investimentoService } from '../../services/investimentoService'
import type { InvestimentoForm } from '../../types/Investimento'

// Atende /investimentos/novo e /investimentos/:id/editar
export function InvestimentoFormPage() {
  const { id } = useParams<{ id: string }>()
  const edicao = id !== undefined
  const navigate = useNavigate()
  const { usuario } = useAuth()
  const { dados, carregando, erro } = useCarregar(
    () =>
      Promise.all([
        contaService.listar(usuario!.id),
        edicao ? investimentoService.buscar(Number(id)) : Promise.resolve(undefined),
      ]),
    [id, usuario?.id],
  )

  async function salvar(dadosForm: InvestimentoForm) {
    if (edicao) {
      const atualizado = await investimentoService.atualizar(Number(id), dadosForm)
      navigate('/investimentos', { state: { mensagem: `Investimento "${atualizado.nomeInvestimento}" atualizado.` } })
    } else {
      const criado = await investimentoService.criar(dadosForm)
      navigate('/investimentos', { state: { mensagem: `Aplicação em "${criado.nomeInvestimento}" realizada.` } })
    }
  }

  function conteudo() {
    if (carregando) {
      return <Carregando />
    }
    if (erro || !dados) {
      return <Alerta>{erro ?? 'Não foi possível carregar os dados'}</Alerta>
    }
    const [contas, investimento] = dados
    if (contas.length === 0) {
      return (
        <EstadoVazio icone={LuWallet} titulo="Você precisa de uma conta">
          <p>O dinheiro do investimento sai do saldo de uma conta.</p>
          <BotaoLink to="/contas/nova">Abrir conta</BotaoLink>
        </EstadoVazio>
      )
    }
    return (
      <InvestimentoFormulario
        contas={contas}
        inicial={investimento}
        aoSalvar={salvar}
        aoCancelar={() => navigate('/investimentos')}
      />
    )
  }

  return (
    <>
      <CabecalhoPagina
        titulo={edicao ? 'Editar investimento' : 'Novo investimento'}
        subtitulo={edicao ? 'Altere os dados ou registre o resgate' : 'Aplique parte do saldo de uma conta'}
      />
      {conteudo()}
    </>
  )
}
