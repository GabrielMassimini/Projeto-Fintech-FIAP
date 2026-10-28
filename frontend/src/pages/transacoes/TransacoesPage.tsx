import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
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
import { useAuth } from '../../contexts/AuthContext/useAuth'
import { mensagemDeErro } from '../../services/api'
import { contaService } from '../../services/contaService'
import { transacaoService } from '../../services/transacaoService'
import type { Conta } from '../../types/Conta'
import type { Transacao } from '../../types/Transacao'
import { nomeDaCategoria } from '../../utils/categorias'
import { formatarData, formatarMoeda } from '../../utils/formatadores'

export function TransacoesPage() {
  const { usuario } = useAuth()
  const location = useLocation()
  const [transacoes, setTransacoes] = useState<Transacao[]>([])
  const [contas, setContas] = useState<Conta[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const [sucesso, setSucesso] = useState<string | null>(location.state?.mensagem ?? null)
  const [filtroConta, setFiltroConta] = useState('')
  const [filtroTipo, setFiltroTipo] = useState('')
  const [paraExcluir, setParaExcluir] = useState<Transacao | null>(null)
  const [excluindo, setExcluindo] = useState(false)

  useEffect(() => {
    async function carregar() {
      try {
        setTransacoes(await transacaoService.listarDoUsuario(usuario!.id))
        setContas(await contaService.listar(usuario!.id)) // para o filtro por conta
      } catch (e) {
        setErro(mensagemDeErro(e))
      } finally {
        setCarregando(false)
      }
    }
    carregar()
  }, [usuario])

  // Aplica os filtros escolhidos e soma as entradas e saídas que sobraram
  const filtradas = transacoes.filter((t) => {
    const contaOk = filtroConta === '' || String(t.conta.id) === filtroConta
    const tipoOk = filtroTipo === '' || t.tipoTransacao === filtroTipo
    return contaOk && tipoOk
  })
  let entradas = 0
  let saidas = 0
  for (const t of filtradas) {
    if (t.tipoTransacao === 'RECEITA') {
      entradas += t.valor
    } else {
      saidas += t.valor
    }
  }

  async function confirmarExclusao() {
    if (!paraExcluir) {
      return
    }
    setExcluindo(true)
    setErro(null)
    setSucesso(null)
    try {
      await transacaoService.excluir(paraExcluir.id)
      setTransacoes(transacoes.filter((t) => t.id !== paraExcluir.id))
      setSucesso(`Transação "${paraExcluir.descricao}" excluída e saldo da conta corrigido.`)
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
        titulo="Transações"
        subtitulo="Receitas e despesas das suas contas"
        acoes={
          <BotaoLink to="/transacoes/nova">
            <LuPlus /> Nova transação
          </BotaoLink>
        }
      />

      <div className="space-y-4">
        {sucesso && <Alerta tipo="sucesso">{sucesso}</Alerta>}
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
              <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-sm">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-gray-100 bg-gray-50 text-xs uppercase text-gray-500">
                    <tr>
                      <th className="px-4 py-3">Data</th>
                      <th className="px-4 py-3">Descrição</th>
                      <th className="px-4 py-3">Conta</th>
                      <th className="px-4 py-3">Tipo</th>
                      <th className="px-4 py-3 text-right">Valor</th>
                      <th className="px-4 py-3 text-right">Saldo após</th>
                      <th className="px-4 py-3 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filtradas.map((t) => (
                      <tr key={t.id} className="hover:bg-rosa-xclaro/60">
                        <td className="whitespace-nowrap px-4 py-3">{formatarData(t.dataTransacao)}</td>
                        <td className="px-4 py-3">
                          <p className="font-medium text-gray-900">{t.descricao}</p>
                          <p className="text-xs text-gray-500">{nomeDaCategoria(t.categoria.nomeCategoria)}</p>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3">{t.conta.numeroConta}</td>
                        <td className="px-4 py-3">
                          {t.tipoTransacao === 'RECEITA' ? (
                            <Etiqueta cor="verde">Receita</Etiqueta>
                          ) : (
                            <Etiqueta cor="vermelho">Despesa</Etiqueta>
                          )}
                        </td>
                        <td
                          className={`whitespace-nowrap px-4 py-3 text-right font-semibold ${
                            t.tipoTransacao === 'RECEITA' ? 'text-green-600' : 'text-red-600'
                          }`}
                        >
                          {t.tipoTransacao === 'RECEITA' ? '+ ' : '- '}
                          {formatarMoeda(t.valor)}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-right text-gray-500">{formatarMoeda(t.saldoApos)}</td>
                        <td className="px-4 py-3">
                          <AcoesLinha
                            editarPara={`/transacoes/${t.id}/editar`}
                            aoExcluir={() => setParaExcluir(t)}
                            descricao={`transação ${t.descricao}`}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
