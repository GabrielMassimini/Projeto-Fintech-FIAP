import { useState, type FormEvent } from 'react'
import { LuInfo, LuSave } from 'react-icons/lu'
import { useEnvio } from '../../hooks/useEnvio'
import type { Conta } from '../../types/Conta'
import type {
  Investimento,
  InvestimentoForm,
  Liquidez,
  StatusInvestimento,
  TipoInvestimento,
} from '../../types/Investimento'
import { formatarMoeda, hojeIso, paraNumero } from '../../utils/formatadores'
import { nomesLiquidez, nomesTipoInvestimento } from '../../utils/investimentos'
import { Alerta } from '../ui/Alerta'
import { Botao } from '../ui/Botao'
import { Caixa } from '../ui/Caixa'
import { CampoSelecao } from '../ui/CampoSelecao'
import { CampoTexto } from '../ui/CampoTexto'

interface InvestimentoFormularioProps {
  contas: Conta[]
  inicial?: Investimento
  aoSalvar: (dados: InvestimentoForm) => Promise<void>
  aoCancelar: () => void
}

export function InvestimentoFormulario({ contas, inicial, aoSalvar, aoCancelar }: InvestimentoFormularioProps) {
  const edicao = inicial !== undefined
  // Depois de resgatado/encerrado, valor e rendimento ficam fixos (regra do backend)
  const encerrado = edicao && inicial.statusInvestimento !== 'ATIVO'

  const [contaId, setContaId] = useState(String(inicial?.conta.id ?? contas[0]?.id ?? ''))
  const [tipoInvestimento, setTipoInvestimento] = useState<TipoInvestimento>(inicial?.tipoInvestimento ?? 'CDB')
  const [nomeInvestimento, setNomeInvestimento] = useState(inicial?.nomeInvestimento ?? '')
  const [valorAplicado, setValorAplicado] = useState(inicial ? String(inicial.valorAplicado) : '')
  const [percentual, setPercentual] = useState(inicial?.percentualRendimento != null ? String(inicial.percentualRendimento) : '')
  const [rendimento, setRendimento] = useState(inicial?.rendimento != null ? String(inicial.rendimento) : '')
  const [dataAplicacao, setDataAplicacao] = useState(inicial?.dataAplicacao ?? hojeIso())
  const [dataVencimento, setDataVencimento] = useState(inicial?.dataVencimento ?? '')
  const [liquidez, setLiquidez] = useState<Liquidez | ''>(inicial?.liquidez ?? '')
  const [status, setStatus] = useState<StatusInvestimento>(inicial?.statusInvestimento ?? 'ATIVO')
  const { enviando, erro, campos, enviar } = useEnvio()

  const contaEscolhida = contas.find((c) => String(c.id) === contaId)
  const vaiResgatar = edicao && !encerrado && status !== 'ATIVO'

  function handleSubmit(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    enviar(() =>
      aoSalvar({
        conta: { id: Number(contaId) },
        tipoInvestimento,
        nomeInvestimento: nomeInvestimento.trim(),
        valorAplicado: paraNumero(valorAplicado) ?? 0,
        rendimento: paraNumero(rendimento),
        percentualRendimento: paraNumero(percentual),
        dataAplicacao,
        dataVencimento: dataVencimento || null,
        liquidez: liquidez || null,
        statusInvestimento: edicao ? status : undefined,
      }),
    )
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-4">
      {erro && <Alerta>{erro}</Alerta>}
      <Caixa>
        <div className="grid gap-4 sm:grid-cols-2">
          <CampoSelecao
            rotulo={edicao ? 'Conta (não muda na edição)' : 'Conta de onde sai o dinheiro'}
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
          <CampoSelecao
            rotulo="Tipo"
            value={tipoInvestimento}
            onChange={(e) => setTipoInvestimento(e.target.value as TipoInvestimento)}
            erro={campos.tipoInvestimento}
          >
            {Object.entries(nomesTipoInvestimento).map(([valor, nome]) => (
              <option key={valor} value={valor}>
                {nome}
              </option>
            ))}
          </CampoSelecao>
          <CampoTexto
            className="sm:col-span-2"
            rotulo="Nome do investimento"
            placeholder="Ex.: CDB MassPay 2028"
            value={nomeInvestimento}
            onChange={(e) => setNomeInvestimento(e.target.value)}
            erro={campos.nomeInvestimento}
            maxLength={100}
            required
          />
          <CampoTexto
            rotulo="Valor aplicado (R$)"
            type="number"
            min="0.01"
            step="0.01"
            value={valorAplicado}
            onChange={(e) => setValorAplicado(e.target.value)}
            erro={campos.valorAplicado}
            disabled={encerrado}
            required
          />
          <CampoTexto
            rotulo="Rentabilidade (% ao ano, opcional)"
            type="number"
            min="0"
            max="999.99"
            step="0.01"
            value={percentual}
            onChange={(e) => setPercentual(e.target.value)}
            erro={campos.percentualRendimento}
          />
          <CampoTexto
            rotulo="Data da aplicação"
            type="date"
            max={hojeIso()}
            value={dataAplicacao}
            onChange={(e) => setDataAplicacao(e.target.value)}
            erro={campos.dataAplicacao}
            required
          />
          <CampoTexto
            rotulo="Vencimento (opcional)"
            type="date"
            min={dataAplicacao}
            value={dataVencimento}
            onChange={(e) => setDataVencimento(e.target.value)}
            erro={campos.dataVencimento}
          />
          <CampoSelecao rotulo="Liquidez (opcional)" value={liquidez} onChange={(e) => setLiquidez(e.target.value as Liquidez | '')} erro={campos.liquidez}>
            <option value="">Não informada</option>
            {Object.entries(nomesLiquidez).map(([valor, nome]) => (
              <option key={valor} value={valor}>
                {nome}
              </option>
            ))}
          </CampoSelecao>

          {edicao && (
            <>
              <CampoSelecao
                rotulo="Status"
                value={status}
                onChange={(e) => setStatus(e.target.value as StatusInvestimento)}
                erro={campos.statusInvestimento}
              >
                {!encerrado && <option value="ATIVO">Ativo</option>}
                <option value="RESGATADO">Resgatado</option>
                <option value="ENCERRADO">Encerrado</option>
              </CampoSelecao>
              <CampoTexto
                rotulo="Rendimento obtido (R$, opcional)"
                type="number"
                min="0"
                step="0.01"
                value={rendimento}
                onChange={(e) => setRendimento(e.target.value)}
                erro={campos.rendimento}
                disabled={encerrado}
              />
            </>
          )}
        </div>

        <p className="mt-4 flex items-start gap-2 rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-600">
          <LuInfo className="mt-0.5 shrink-0" aria-hidden />
          {!edicao && contaEscolhida && (
            <span>
              O valor sai do saldo disponível da conta {contaEscolhida.numeroConta} ({formatarMoeda(contaEscolhida.saldoDisponivel)}).
            </span>
          )}
          {edicao && !encerrado && !vaiResgatar && <span>Se você mudar o valor aplicado, a diferença sai ou volta para a conta.</span>}
          {vaiResgatar && (
            <span>
              Ao salvar, o valor aplicado mais o rendimento voltam para a conta {inicial.conta.numeroConta}. Depois disso, o
              investimento não pode voltar a ficar ativo.
            </span>
          )}
          {encerrado && <span>Este investimento já foi {inicial.statusInvestimento.toLowerCase()}: valor e rendimento não mudam mais.</span>}
        </p>
      </Caixa>
      <div className="flex justify-end gap-2">
        <Botao variante="secundario" onClick={aoCancelar} disabled={enviando}>
          Cancelar
        </Botao>
        <Botao type="submit" disabled={enviando}>
          <LuSave aria-hidden /> {enviando ? 'Salvando...' : 'Salvar'}
        </Botao>
      </div>
    </form>
  )
}
