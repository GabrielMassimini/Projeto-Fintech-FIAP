import { useState } from 'react'
import { LuUserPlus, LuUsers } from 'react-icons/lu'
import { Alerta } from '../../components/ui/Alerta'
import { AcoesLinha } from '../../components/ui/AcoesLinha'
import { BotaoLink } from '../../components/ui/BotaoLink'
import { CabecalhoPagina } from '../../components/ui/CabecalhoPagina'
import { Carregando } from '../../components/ui/Carregando'
import { EstadoVazio } from '../../components/ui/EstadoVazio'
import { Etiqueta } from '../../components/ui/Etiqueta'
import { ModalConfirmacao } from '../../components/ui/ModalConfirmacao'
import { Tabela, type Coluna } from '../../components/ui/Tabela'
import { useAuth } from '../../contexts/AuthContext/useAuth'
import { useCarregar } from '../../hooks/useCarregar'
import { useMensagemDaRota } from '../../hooks/useMensagemDaRota'
import { mensagemDeErro } from '../../services/api'
import { usuarioService } from '../../services/usuarioService'
import type { Usuario } from '../../types/Usuario'
import { formatarCpf, formatarData } from '../../utils/formatadores'

export function UsuariosPage() {
  const { usuario: logado, sair } = useAuth()
  const { dados, setDados, carregando, erro } = useCarregar(() => usuarioService.listar())
  const mensagemRota = useMensagemDaRota()
  const [paraExcluir, setParaExcluir] = useState<Usuario | null>(null)
  const [excluindo, setExcluindo] = useState(false)
  const [aviso, setAviso] = useState<{ tipo: 'erro' | 'sucesso'; texto: string } | null>(null)

  const usuarios = dados ?? []

  async function confirmarExclusao() {
    if (!paraExcluir) {
      return
    }
    setExcluindo(true)
    try {
      await usuarioService.excluir(paraExcluir.id)
      if (paraExcluir.id === logado?.id) {
        sair() // excluiu a própria conta: volta para o login
        return
      }
      setDados(usuarios.filter((u) => u.id !== paraExcluir.id))
      setAviso({ tipo: 'sucesso', texto: `Usuário ${paraExcluir.nomeCompleto} excluído.` })
    } catch (e) {
      setAviso({ tipo: 'erro', texto: mensagemDeErro(e) })
    } finally {
      setExcluindo(false)
      setParaExcluir(null)
    }
  }

  const colunas: Coluna<Usuario>[] = [
    {
      titulo: 'Nome',
      conteudo: (u) => (
        <div>
          <p className="font-medium text-gray-900">
            {u.nomeCompleto} {u.id === logado?.id && <Etiqueta cor="rosa">você</Etiqueta>}
          </p>
          <p className="text-xs text-gray-500">{u.email}</p>
        </div>
      ),
    },
    { titulo: 'CPF', conteudo: (u) => <span className="whitespace-nowrap">{formatarCpf(u.cpf)}</span> },
    { titulo: 'Nascimento', conteudo: (u) => formatarData(u.dataNascimento) },
    { titulo: 'Telefone', conteudo: (u) => u.telefone || '—' },
    {
      titulo: 'Status',
      conteudo: (u) => <Etiqueta cor={u.status === 'ATIVO' ? 'verde' : 'cinza'}>{u.status}</Etiqueta>,
    },
    {
      titulo: 'Ações',
      alinharDireita: true,
      conteudo: (u) => (
        <AcoesLinha editarPara={`/usuarios/${u.id}/editar`} aoExcluir={() => setParaExcluir(u)} descricao={u.nomeCompleto} />
      ),
    },
  ]

  return (
    <>
      <CabecalhoPagina
        titulo="Usuários"
        subtitulo="Pessoas cadastradas no MassPay"
        acoes={
          <BotaoLink to="/usuarios/novo">
            <LuUserPlus aria-hidden /> Novo usuário
          </BotaoLink>
        }
      />

      <div className="space-y-4">
        {aviso ? <Alerta tipo={aviso.tipo}>{aviso.texto}</Alerta> : mensagemRota && <Alerta tipo="sucesso">{mensagemRota}</Alerta>}
        {erro && <Alerta>{erro}</Alerta>}

        {carregando ? (
          <Carregando />
        ) : usuarios.length === 0 ? (
          <EstadoVazio icone={LuUsers} titulo="Nenhum usuário cadastrado" />
        ) : (
          <Tabela colunas={colunas} itens={usuarios} chave={(u) => u.id} />
        )}
      </div>

      <ModalConfirmacao
        aberto={paraExcluir !== null}
        titulo="Excluir usuário?"
        processando={excluindo}
        aoConfirmar={confirmarExclusao}
        aoCancelar={() => setParaExcluir(null)}
      >
        <p>
          <strong>{paraExcluir?.nomeCompleto}</strong> será excluído. Usuários com contas abertas não podem ser excluídos.
        </p>
        {paraExcluir?.id === logado?.id && <p className="mt-2 font-medium text-red-600">Este é o seu usuário: você sairá do sistema.</p>}
      </ModalConfirmacao>
    </>
  )
}
