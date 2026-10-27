import { useState, type FormEvent } from 'react'
import { LuInfo, LuSave } from 'react-icons/lu'
import { useEnvio } from '../../hooks/useEnvio'
import type { Conta, ContaForm, StatusConta, TipoConta } from '../../types/Conta'
import { formatarMoeda, paraNumero } from '../../utils/formatadores'
import { Alerta } from '../ui/Alerta'
import { Botao } from '../ui/Botao'
import { Caixa } from '../ui/Caixa'
import { CampoSelecao } from '../ui/CampoSelecao'
import { CampoTexto } from '../ui/CampoTexto'

interface ContaFormularioProps {
  usuarioId: number // dono da conta (o usuário logado)
  inicial?: Conta
  aoSalvar: (dados: ContaForm) => Promise<void>
  aoCancelar: () => void
}

export function ContaFormulario({ usuarioId, inicial, aoSalvar, aoCancelar }: ContaFormularioProps) {
  const edicao = inicial !== undefined
  const [numeroConta, setNumeroConta] = useState(inicial?.numeroConta ?? '')
  const [agencia, setAgencia] = useState(inicial?.agencia ?? '0001')
  const [tipoConta, setTipoConta] = useState<TipoConta>(inicial?.tipoConta ?? 'CORRENTE')
  const [saldoInicial, setSaldoInicial] = useState('0')
  const [statusConta, setStatusConta] = useState<StatusConta>(inicial?.statusConta ?? 'ATIVA')
  const { enviando, erro, campos, enviar } = useEnvio()

  function handleSubmit(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    enviar(() =>
      aoSalvar({
        usuario: { id: inicial?.usuario.id ?? usuarioId },
        numeroConta: numeroConta.trim(),
        agencia: agencia.trim(),
        tipoConta,
        saldoDisponivel: edicao ? undefined : (paraNumero(saldoInicial) ?? 0),
        statusConta: edicao ? statusConta : undefined,
      }),
    )
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-4">
      {erro && <Alerta>{erro}</Alerta>}
      <Caixa>
        <div className="grid gap-4 sm:grid-cols-2">
          <CampoTexto
            rotulo="Número da conta"
            placeholder="10003-6"
            value={numeroConta}
            onChange={(e) => setNumeroConta(e.target.value)}
            erro={campos.numeroConta}
            maxLength={10}
            required
          />
          <CampoTexto
            rotulo="Agência"
            inputMode="numeric"
            value={agencia}
            onChange={(e) => setAgencia(e.target.value)}
            erro={campos.agencia}
            maxLength={5}
            required
          />
          <CampoSelecao rotulo="Tipo de conta" value={tipoConta} onChange={(e) => setTipoConta(e.target.value as TipoConta)} erro={campos.tipoConta}>
            <option value="CORRENTE">Corrente</option>
            <option value="POUPANCA">Poupança</option>
          </CampoSelecao>

          {edicao ? (
            <CampoSelecao rotulo="Status" value={statusConta} onChange={(e) => setStatusConta(e.target.value as StatusConta)} erro={campos.statusConta}>
              <option value="ATIVA">Ativa</option>
              <option value="BLOQUEADA">Bloqueada (não movimenta dinheiro)</option>
              <option value="ENCERRADA">Encerrada</option>
            </CampoSelecao>
          ) : (
            <CampoTexto
              rotulo="Depósito inicial (R$)"
              type="number"
              min="0"
              step="0.01"
              value={saldoInicial}
              onChange={(e) => setSaldoInicial(e.target.value)}
              erro={campos.saldoDisponivel}
            />
          )}
        </div>

        {edicao && (
          <p className="mt-4 flex items-start gap-2 rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-600">
            <LuInfo className="mt-0.5 shrink-0" aria-hidden />
            Saldo atual: <strong className="text-gray-900">{formatarMoeda(inicial.saldoDisponivel)}</strong>. O saldo só muda
            por transações e investimentos.
          </p>
        )}
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
