import type { Liquidez, TipoInvestimento } from '../types/Investimento'

export const nomesTipoInvestimento: Record<TipoInvestimento, string> = {
  CDB: 'CDB',
  CDI: 'CDI',
  TESOURO: 'Tesouro Direto',
  POUPANCA: 'Poupança',
  ACOES: 'Ações',
  FUNDO: 'Fundo de investimento',
}

export const nomesLiquidez: Record<Liquidez, string> = {
  DIARIA: 'Diária',
  VENCIMENTO: 'No vencimento',
  IMEDIATA: 'Imediata',
}
