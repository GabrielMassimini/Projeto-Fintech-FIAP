import { useState, type ReactNode } from 'react'
import { authService } from '../../services/authService'
import type { Usuario } from '../../types/Usuario'
import { AuthContext } from './AuthContext'

const CHAVE_STORAGE = 'masspay:usuario'

// Mantém o login ao recarregar a página
function lerUsuarioSalvo(): Usuario | null {
  const salvo = localStorage.getItem(CHAVE_STORAGE)
  if (salvo) {
    return JSON.parse(salvo)
  }
  return null
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [usuario, setUsuario] = useState<Usuario | null>(lerUsuarioSalvo())

  // Guarda o usuário no estado e no localStorage
  function guardar(novo: Usuario | null) {
    setUsuario(novo)
    if (novo) {
      localStorage.setItem(CHAVE_STORAGE, JSON.stringify(novo))
    } else {
      localStorage.removeItem(CHAVE_STORAGE)
    }
  }

  async function entrar(email: string, senha: string) {
    const logado = await authService.login(email, senha)
    guardar(logado)
  }

  function sair() {
    guardar(null)
  }

  return (
    <AuthContext.Provider value={{ usuario, entrar, sair, atualizarUsuarioLogado: guardar }}>
      {children}
    </AuthContext.Provider>
  )
}
