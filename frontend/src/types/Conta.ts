import type { Usuario } from './Usuario'

export type TipoConta = 'CORRENTE' | 'POUPANCA'
export type StatusConta = 'ATIVA' | 'BLOQUEADA' | 'ENCERRADA'

export interface Conta {
  id: number
  usuario: Usuario
  numeroConta: string
  agencia: string
  tipoConta: TipoConta
  saldoDisponivel: number
  saldoBloqueado: number
  saldoTotal: number
  dataAbertura: string
  statusConta: StatusConta
}

export interface ContaForm {
  usuario: { id: number }
  numeroConta: string
  agencia: string
  tipoConta: TipoConta
  saldoDisponivel?: number // só na abertura
  statusConta?: StatusConta
}
