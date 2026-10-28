import { useState, type FormEvent } from 'react'
import { LuArrowDownLeft, LuArrowUpRight, LuSave } from 'react-icons/lu'
import { useEnvio } from '../../hooks/useEnvio'
import type { Categoria } from '../../types/Categoria'
import type { Conta } from '../../types/Conta'
import type { Transacao, TransacaoForm } from '../../types/Transacao'
import { nomeDaCategoria } from '../../utils/categorias'
import { formatarMoeda, hojeIso, paraNumero } from '../../utils/formatadores'
import { Alerta } from '../ui/Alerta'
import { Botao } from '../ui/Botao'
import { Caixa } from '../ui/Caixa'
import { CampoAreaTexto } from '../ui/CampoAreaTexto'
import { CampoSelecao } from '../ui/CampoSelecao'
import { CampoTexto } from '../ui/CampoTexto'

interface TransacaoFormularioProps {
  contas: Conta[]
  categorias: Categoria[]
  inicial?: Transacao
  aoSalvar: (dados: TransacaoForm) => Promise<void>
  aoCancelar: () => void
}

export function TransacaoFormulario({ contas, categorias, inicial, aoSalvar, aoCancelar }: TransacaoFormularioProps) {
  const edicao = inicial !== undefined
  const [contaId, setContaId] = useState(String(inicial?.conta.id ?? contas[0]?.id ?? ''))
  const [categoriaId, setCategoriaId] = useState(String(inicial?.categoria.id ?? ''))
  const [descricao, setDescricao] = useState(inicial?.descricao ?? '')
  const [valor, setValor] = useState(inicial ? String(inicial.valor) : '')
  const [dataTransacao, setDataTransacao] = useState(inicial?.dataTransacao ?? hojeIso())
  const [detalhes, setDetalhes] = useState(inicial?.detalhes ?? '')
  const { enviando, erro, campos, enviar } = useEnvio()

  const contaEscolhida = contas.find((c) => String(c.id) === contaId)
  const categoriaEscolhida = categorias.find((c) => String(c.id) === categoriaId)
  const receitas = categorias.filter((c) => c.tipoMovimentacao === 'RECEITA')
  const despesas = categorias.filter((c) => c.tipoMovimentacao === 'DESPESA')

  function handleSubmit(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    enviar(() =>
      aoSalvar({
        conta: { id: Number(contaId) },
        categoria: { id: Number(categoriaId) },
        descricao: descricao.trim(),
        valor: paraNumero(valor) ?? 0,
        dataTransacao,
        detalhes: detalhes.trim(),
      }),
    )
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-4">
      {erro && <Alerta>{erro}</Alerta>}
      <Caixa>
        <div className="grid gap-4 sm:grid-cols-2">
          <CampoSelecao
            rotulo={edicao ? 'Conta (não muda na edição)' : 'Conta'}
            value={contaId}
            onChange={(e) => setContaId(e.target.value)}
            erro={campos.conta}
            disabled={edicao}
            required
          >
            {contas.map((conta) => (
              <option key={conta.id} value={conta.id}>
                {conta.numeroConta} · {formatarMoeda(conta.saldoDisponivel)}
                {conta.statusConta !== 'ATIVA' ? ` (${conta.statusConta})` : ''}
              </option>
            ))}
          </CampoSelecao>
          <CampoSelecao rotulo="Categoria" value={categoriaId} onChange={(e) => setCategoriaId(e.target.value)} erro={campos.categoria} required>
            <option value="" disabled>
              Escolha uma categoria
            </option>
            <optgroup label="Receitas (entram na conta)">
              {receitas.map((c) => (
                <option key={c.id} value={c.id}>
                  {nomeDaCategoria(c.nomeCategoria)}
                </option>
              ))}
            </optgroup>
            <optgroup label="Despesas (saem da conta)">
              {despesas.map((c) => (
                <option key={c.id} value={c.id}>
                  {nomeDaCategoria(c.nomeCategoria)}
                </option>
              ))}
            </optgroup>
          </CampoSelecao>
          <CampoTexto
            className="sm:col-span-2"
            rotulo="Descrição"
            placeholder="Ex.: Supermercado, salário de novembro..."
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            erro={campos.descricao}
            maxLength={200}
            required
          />
          <CampoTexto
            rotulo="Valor (R$)"
            type="number"
            min="0.01"
            step="0.01"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            erro={campos.valor}
            required
          />
          <CampoTexto
            rotulo="Data"
            type="date"
            max={hojeIso()}
            value={dataTransacao}
            onChange={(e) => setDataTransacao(e.target.value)}
            erro={campos.dataTransacao}
            required
          />
          <CampoAreaTexto
            className="sm:col-span-2"
            rotulo="Detalhes (opcional)"
            value={detalhes}
            onChange={(e) => setDetalhes(e.target.value)}
            erro={campos.detalhes}
            maxLength={4000}
          />
        </div>

        {categoriaEscolhida && contaEscolhida && (
          <p
            className={`mt-4 flex items-center gap-2 rounded-xl px-4 py-3 text-sm ${
              categoriaEscolhida.tipoMovimentacao === 'RECEITA' ? 'bg-green-50 text-green-700' : 'bg-rosa-xclaro text-rosa-escuro'
            }`}
          >
            {categoriaEscolhida.tipoMovimentacao === 'RECEITA' ? (
              <>
                <LuArrowDownLeft /> Receita: o valor entra no saldo da conta {contaEscolhida.numeroConta}.
              </>
            ) : (
              <>
                <LuArrowUpRight /> Despesa: o valor sai do saldo da conta {contaEscolhida.numeroConta} (
                {formatarMoeda(contaEscolhida.saldoDisponivel)} disponíveis).
              </>
            )}
          </p>
        )}
      </Caixa>
      <div className="flex justify-end gap-2">
        <Botao variante="secundario" onClick={aoCancelar} disabled={enviando}>
          Cancelar
        </Botao>
        <Botao type="submit" disabled={enviando}>
          <LuSave /> {enviando ? 'Salvando...' : 'Salvar'}
        </Botao>
      </div>
    </form>
  )
}
