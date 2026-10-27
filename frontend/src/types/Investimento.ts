import type { Conta } from './Conta'

export type TipoInvestimento = 'CDB' | 'CDI' | 'TESOURO' | 'POUPANCA' | 'ACOES' | 'FUNDO'
export type Liquidez = 'DIARIA' | 'VENCIMENTO' | 'IMEDIATA'
export type StatusInvestimento = 'ATIVO' | 'RESGATADO' | 'ENCERRADO'

export interface Investimento {
  id: number
  conta: Conta
  tipoInvestimento: TipoInvestimento
  nomeInvestimento: string
  valorAplicado: number
  rendimento: number | null
  percentualRendimento: number | null
  dataAplicacao: string
  dataVencimento: string | null
  liquidez: Liquidez | null
  statusInvestimento: StatusInvestimento
  dataCadastro: string
}

export interface InvestimentoForm {
  conta: { id: number }
  tipoInvestimento: TipoInvestimento
  nomeInvestimento: string
  valorAplicado: number
  rendimento: number | null
  percentualRendimento: number | null
  dataAplicacao: string
  dataVencimento: string | null
  liquidez: Liquidez | null
  statusInvestimento?: StatusInvestimento
}
