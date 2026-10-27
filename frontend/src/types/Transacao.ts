import type { Categoria, TipoMovimentacao } from './Categoria'
import type { Conta } from './Conta'

export interface Transacao {
  id: number
  conta: Conta
  categoria: Categoria
  descricao: string
  tipoTransacao: TipoMovimentacao
  valor: number
  dataTransacao: string
  statusTransacao: string
  saldoApos: number | null
  detalhes: string | null
}

export interface TransacaoForm {
  conta: { id: number }
  categoria: { id: number }
  descricao: string
  valor: number
  dataTransacao: string
  detalhes: string
}
