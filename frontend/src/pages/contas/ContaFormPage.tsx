import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ContaFormulario } from '../../components/contas/ContaFormulario'
import { Alerta } from '../../components/ui/Alerta'
import { CabecalhoPagina } from '../../components/ui/CabecalhoPagina'
import { Carregando } from '../../components/ui/Carregando'
import { useAuth } from '../../contexts/AuthContext/useAuth'
import { mensagemDeErro } from '../../services/api'
import { contaService } from '../../services/contaService'
import type { Conta, ContaForm } from '../../types/Conta'

// Atende /contas/nova e /contas/:id/editar
export function ContaFormPage() {
  const { id } = useParams()
  const edicao = id !== undefined
  const navigate = useNavigate()
  const { usuario } = useAuth()
  const [conta, setConta] = useState<Conta | undefined>(undefined)
  const [carregando, setCarregando] = useState(edicao)
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    async function carregar() {
      try {
        setConta(await contaService.buscar(Number(id)))
      } catch (e) {
        setErro(mensagemDeErro(e))
      } finally {
        setCarregando(false)
      }
    }
    if (id) {
      carregar()
    }
  }, [id])

  async function salvar(dados: ContaForm) {
    if (edicao) {
      const atualizada = await contaService.atualizar(Number(id), dados)
      navigate('/contas', { state: { mensagem: `Conta ${atualizada.numeroConta} atualizada.` } })
    } else {
      const criada = await contaService.criar(dados)
      navigate('/contas', { state: { mensagem: `Conta ${criada.numeroConta} aberta.` } })
    }
  }

  return (
    <>
      <CabecalhoPagina
        titulo={edicao ? 'Editar conta' : 'Abrir conta'}
        subtitulo={edicao ? 'Altere os dados da conta' : 'Abra uma nova conta MassPay'}
      />
      {carregando ? (
        <Carregando />
      ) : erro ? (
        <Alerta>{erro}</Alerta>
      ) : (
        <ContaFormulario usuarioId={usuario!.id} inicial={conta} aoSalvar={salvar} aoCancelar={() => navigate('/contas')} />
      )}
    </>
  )
}
