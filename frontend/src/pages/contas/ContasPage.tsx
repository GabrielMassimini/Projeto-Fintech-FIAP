import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { LuPlus, LuWallet } from 'react-icons/lu'
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
import { contaService } from '../../services/contaService'
import type { Conta } from '../../types/Conta'
import { formatarData, formatarMoeda } from '../../utils/formatadores'

function corDoStatus(status: string) {
  if (status === 'ATIVA') return 'verde'
  if (status === 'BLOQUEADA') return 'amarelo'
  return 'cinza'
}

export function ContasPage() {
  const { usuario } = useAuth()
  const location = useLocation()
  const [contas, setContas] = useState<Conta[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const [sucesso, setSucesso] = useState<string | null>(location.state?.mensagem ?? null)
  const [paraExcluir, setParaExcluir] = useState<Conta | null>(null)
  const [excluindo, setExcluindo] = useState(false)

  useEffect(() => {
    async function carregar() {
      try {
        setContas(await contaService.listar(usuario!.id))
      } catch (e) {
        setErro(mensagemDeErro(e))
      } finally {
        setCarregando(false)
      }
    }
    carregar()
  }, [usuario])

  let saldoTotal = 0
  for (const conta of contas) {
    saldoTotal += conta.saldoDisponivel
  }

  async function confirmarExclusao() {
    if (!paraExcluir) {
      return
    }
    setExcluindo(true)
    setErro(null)
    setSucesso(null)
    try {
      await contaService.excluir(paraExcluir.id)
      setContas(contas.filter((c) => c.id !== paraExcluir.id))
      setSucesso(`Conta ${paraExcluir.numeroConta} excluída.`)
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
        titulo="Minhas contas"
        subtitulo={contas.length > 0 ? `Saldo somado: ${formatarMoeda(saldoTotal)}` : 'Suas contas no MassPay'}
        acoes={
          <BotaoLink to="/contas/nova">
            <LuPlus /> Abrir conta
          </BotaoLink>
        }
      />

      <div className="space-y-4">
        {sucesso && <Alerta tipo="sucesso">{sucesso}</Alerta>}
        {erro && <Alerta>{erro}</Alerta>}

        {carregando ? (
          <Carregando />
        ) : contas.length === 0 ? (
          <EstadoVazio icone={LuWallet} titulo="Você ainda não tem contas">
            <p>Abra uma conta para lançar transações e fazer investimentos.</p>
            <BotaoLink to="/contas/nova">Abrir conta</BotaoLink>
          </EstadoVazio>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-100 bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-4 py-3">Conta</th>
                  <th className="px-4 py-3">Tipo</th>
                  <th className="px-4 py-3 text-right">Saldo disponível</th>
                  <th className="px-4 py-3">Abertura</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {contas.map((c) => (
                  <tr key={c.id} className="hover:bg-rosa-xclaro/60">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{c.numeroConta}</p>
                      <p className="text-xs text-gray-500">Agência {c.agencia}</p>
                    </td>
                    <td className="px-4 py-3">{c.tipoConta === 'CORRENTE' ? 'Corrente' : 'Poupança'}</td>
                    <td className="px-4 py-3 text-right font-semibold text-gray-900">{formatarMoeda(c.saldoDisponivel)}</td>
                    <td className="px-4 py-3">{formatarData(c.dataAbertura)}</td>
                    <td className="px-4 py-3">
                      <Etiqueta cor={corDoStatus(c.statusConta)}>{c.statusConta}</Etiqueta>
                    </td>
                    <td className="px-4 py-3">
                      <AcoesLinha editarPara={`/contas/${c.id}/editar`} aoExcluir={() => setParaExcluir(c)} descricao={`conta ${c.numeroConta}`} />
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
