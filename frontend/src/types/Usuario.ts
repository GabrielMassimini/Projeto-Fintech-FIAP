export type StatusUsuario = 'ATIVO' | 'INATIVO'

export interface Usuario {
  id: number
  nomeCompleto: string
  cpf: string
  dataNascimento: string // AAAA-MM-DD
  email: string
  telefone: string | null
  dataCadastro: string
  status: StatusUsuario
}

// O que o formulário envia. A senha só é obrigatória no cadastro.
export interface UsuarioForm {
  nomeCompleto: string
  cpf: string
  dataNascimento: string
  email: string
  telefone: string
  senha?: string
  status?: StatusUsuario
}
