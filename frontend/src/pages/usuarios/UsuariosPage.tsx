import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { LuUserPlus, LuUsers } from 'react-icons/lu'
import { AcoesLinha } from '../../components/ui/AcoesLinha'
import { Alerta } from '../../components/ui/Alerta'
import { BotaoLink } from '../../components/ui/BotaoLink'
import { CabecalhoPagina } from '../../components/ui/CabecalhoPagina'
import { Carregando } from '../../components/ui/Carregando'
import { EstadoVazio } from '../../components/ui/EstadoVazio'
import { Etiqueta } from '../../components/ui/Etiqueta'
import { ModalConfirmacao } from '../../components/ui/ModalConfirmacao'
import { useAuth } from '../../contexts/AuthContext/useAuth'
import { mensagemDeErro } from '../../services/api'
import { usuarioService } from '../../services/usuarioService'
import type { Usuario } from '../../types/Usuario'
import { formatarCpf, formatarData } from '../../utils/formatadores'

export function UsuariosPage() {
  const { usuario: logado, sair } = useAuth()
  const location = useLocation()
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const [sucesso, setSucesso] = useState<string | null>(location.state?.mensagem ?? null)
  const [paraExcluir, setParaExcluir] = useState<Usuario | null>(null)
  const [excluindo, setExcluindo] = useState(false)

  useEffect(() => {
    async function carregar() {
      try {
        setUsuarios(await usuarioService.listar())
      } catch (e) {
        setErro(mensagemDeErro(e))
      } finally {
        setCarregando(false)
      }
    }
    carregar()
  }, [])

  async function confirmarExclusao() {
    if (!paraExcluir) {
      return
    }
    setExcluindo(true)
    setErro(null)
    setSucesso(null)
    try {
      await usuarioService.excluir(paraExcluir.id)
      if (paraExcluir.id === logado?.id) {
        sair() // excluiu o próprio usuário: volta para o login
        return
      }
      setUsuarios(usuarios.filter((u) => u.id !== paraExcluir.id))
      setSucesso(`Usuário ${paraExcluir.nomeCompleto} excluído.`)
    } catch (e) {
      setErro(mensagemDeErro(e))
    } finally {
      setExcluindo(false)
      setParaExcluir(null)
    }
  }

  return (
    <>
      <CabecalhoPagina
        titulo="Usuários"
        subtitulo="Pessoas cadastradas no MassPay"
        acoes={
          <BotaoLink to="/usuarios/novo">
            <LuUserPlus /> Novo usuário
          </BotaoLink>
        }
      />

      <div className="space-y-4">
        {sucesso && <Alerta tipo="sucesso">{sucesso}</Alerta>}
        {erro && <Alerta>{erro}</Alerta>}

        {carregando ? (
          <Carregando />
        ) : usuarios.length === 0 ? (
          <EstadoVazio icone={LuUsers} titulo="Nenhum usuário cadastrado" />
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-100 bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-4 py-3">Nome</th>
                  <th className="px-4 py-3">CPF</th>
                  <th className="px-4 py-3">Nascimento</th>
                  <th className="px-4 py-3">Telefone</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {usuarios.map((u) => (
                  <tr key={u.id} className="hover:bg-rosa-xclaro/60">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">
                        {u.nomeCompleto} {u.id === logado?.id && <Etiqueta cor="rosa">você</Etiqueta>}
                      </p>
                      <p className="text-xs text-gray-500">{u.email}</p>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">{formatarCpf(u.cpf)}</td>
                    <td className="px-4 py-3">{formatarData(u.dataNascimento)}</td>
                    <td className="px-4 py-3">{u.telefone || '-'}</td>
                    <td className="px-4 py-3">
                      <Etiqueta cor={u.status === 'ATIVO' ? 'verde' : 'cinza'}>{u.status}</Etiqueta>
                    </td>
                    <td className="px-4 py-3">
                      <AcoesLinha editarPara={`/usuarios/${u.id}/editar`} aoExcluir={() => setParaExcluir(u)} descricao={u.nomeCompleto} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
