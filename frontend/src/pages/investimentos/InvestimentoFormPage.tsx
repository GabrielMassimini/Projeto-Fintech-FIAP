import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { LuWallet } from 'react-icons/lu'
import { InvestimentoFormulario } from '../../components/investimentos/InvestimentoFormulario'
import { Alerta } from '../../components/ui/Alerta'
import { BotaoLink } from '../../components/ui/BotaoLink'
import { CabecalhoPagina } from '../../components/ui/CabecalhoPagina'
import { Carregando } from '../../components/ui/Carregando'
import { EstadoVazio } from '../../components/ui/EstadoVazio'
import { useAuth } from '../../contexts/AuthContext/useAuth'
import { mensagemDeErro } from '../../services/api'
import { contaService } from '../../services/contaService'
import { investimentoService } from '../../services/investimentoService'
import type { Conta } from '../../types/Conta'
import type { Investimento, InvestimentoForm } from '../../types/Investimento'

// Atende /investimentos/novo e /investimentos/:id/editar
export function InvestimentoFormPage() {
  const { id } = useParams()
  const edicao = id !== undefined
  const navigate = useNavigate()
  const { usuario } = useAuth()
  const [contas, setContas] = useState<Conta[]>([])
  const [investimento, setInvestimento] = useState<Investimento | undefined>(undefined)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    async function carregar() {
      try {
        setContas(await contaService.listar(usuario!.id))
        if (id) {
          setInvestimento(await investimentoService.buscar(Number(id)))
        }
      } catch (e) {
        setErro(mensagemDeErro(e))
      } finally {
        setCarregando(false)
      }
    }
    carregar()
  }, [id, usuario])

  async function salvar(dados: InvestimentoForm) {
    if (edicao) {
      const atualizado = await investimentoService.atualizar(Number(id), dados)
      navigate('/investimentos', { state: { mensagem: `Investimento "${atualizado.nomeInvestimento}" atualizado.` } })
    } else {
      const criado = await investimentoService.criar(dados)
      navigate('/investimentos', { state: { mensagem: `Aplicação em "${criado.nomeInvestimento}" realizada.` } })
    }
  }

  return (
    <>
      <CabecalhoPagina
        titulo={edicao ? 'Editar investimento' : 'Novo investimento'}
        subtitulo={edicao ? 'Altere os dados ou registre o resgate' : 'Aplique parte do saldo de uma conta'}
      />
      {carregando ? (
        <Carregando />
      ) : erro ? (
        <Alerta>{erro}</Alerta>
      ) : contas.length === 0 ? (
        <EstadoVazio icone={LuWallet} titulo="Você precisa de uma conta">
          <p>O dinheiro do investimento sai do saldo de uma conta.</p>
          <BotaoLink to="/contas/nova">Abrir conta</BotaoLink>
        </EstadoVazio>
      ) : (
        <InvestimentoFormulario
          contas={contas}
          inicial={investimento}
          aoSalvar={salvar}
          aoCancelar={() => navigate('/investimentos')}
        />
      )}
    </>
  )
}
