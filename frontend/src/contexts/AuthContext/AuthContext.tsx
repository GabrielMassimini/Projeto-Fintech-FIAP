import { createContext } from 'react'
import type { Usuario } from '../../types/Usuario'

export interface AuthContextType {
  usuario: Usuario | null
  entrar: (email: string, senha: string) => Promise<void>
  sair: () => void
  atualizarUsuarioLogado: (usuario: Usuario) => void
}

// undefined = componente usado fora do AuthProvider (o useAuth avisa)
export const AuthContext = createContext<AuthContextType | undefined>(undefined)
