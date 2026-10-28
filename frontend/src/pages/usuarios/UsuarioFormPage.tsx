import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { UsuarioFormulario } from '../../components/usuarios/UsuarioFormulario'
import { Alerta } from '../../components/ui/Alerta'
import { CabecalhoPagina } from '../../components/ui/CabecalhoPagina'
import { Carregando } from '../../components/ui/Carregando'
import { useAuth } from '../../contexts/AuthContext/useAuth'
import { mensagemDeErro } from '../../services/api'
import { usuarioService } from '../../services/usuarioService'
import type { Usuario, UsuarioForm } from '../../types/Usuario'

// Atende /usuarios/novo (cadastro) e /usuarios/:id/editar (edição)
export function UsuarioFormPage() {
  const { id } = useParams()
  const edicao = id !== undefined
  const navigate = useNavigate()
  const { usuario: logado, atualizarUsuarioLogado } = useAuth()
  const [usuario, setUsuario] = useState<Usuario | undefined>(undefined)
  const [carregando, setCarregando] = useState(edicao)
  const [erro, setErro] = useState<string | null>(null)

  // Na edição, busca o usuário para preencher o formulário
  useEffect(() => {
    async function carregar() {
      try {
        setUsuario(await usuarioService.buscar(Number(id)))
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

  async function salvar(dados: UsuarioForm) {
    if (edicao) {
      const atualizado = await usuarioService.atualizar(Number(id), dados)
      if (atualizado.id === logado?.id) {
        atualizarUsuarioLogado(atualizado) // o nome no cabeçalho muda na hora
      }
      navigate('/usuarios', { state: { mensagem: `Usuário ${atualizado.nomeCompleto} atualizado.` } })
    } else {
      const criado = await usuarioService.criar(dados)
      navigate('/usuarios', { state: { mensagem: `Usuário ${criado.nomeCompleto} cadastrado.` } })
    }
  }

  return (
    <>
      <CabecalhoPagina
        titulo={edicao ? 'Editar usuário' : 'Novo usuário'}
        subtitulo={edicao ? 'Altere os dados e salve' : 'Cadastre uma pessoa para usar o MassPay'}
      />
      {carregando ? (
        <Carregando />
      ) : erro ? (
        <Alerta>{erro}</Alerta>
      ) : (
        <UsuarioFormulario inicial={usuario} aoSalvar={salvar} aoCancelar={() => navigate('/usuarios')} />
      )}
    </>
  )
}
