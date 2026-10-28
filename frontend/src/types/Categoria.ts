export type TipoMovimentacao = 'RECEITA' | 'DESPESA'

export interface Categoria {
  id: number
  nomeCategoria: string
  descricao: string | null
  tipoMovimentacao: TipoMovimentacao
  ativo: string
}
