import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { authService } from '../../services/authService'
import type { Usuario } from '../../types/Usuario'
import { AuthContext } from './AuthContext'

const CHAVE_STORAGE = 'masspay:usuario'

// Mantém o login ao recarregar a página
function lerUsuarioSalvo(): Usuario | null {
  try {
    const salvo = localStorage.getItem(CHAVE_STORAGE)
    return salvo ? (JSON.parse(salvo) as Usuario) : null
  } catch {
    return null
  }
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [usuario, setUsuario] = useState<Usuario | null>(lerUsuarioSalvo)

  const guardar = useCallback((novo: Usuario | null) => {
    setUsuario(novo)
    if (novo) {
      localStorage.setItem(CHAVE_STORAGE, JSON.stringify(novo))
    } else {
      localStorage.removeItem(CHAVE_STORAGE)
    }
  }, [])

  const entrar = useCallback(
    async (email: string, senha: string) => {
      const logado = await authService.login(email, senha)
      guardar(logado)
    },
    [guardar],
  )

  const sair = useCallback(() => guardar(null), [guardar])

  const valor = useMemo(
    () => ({ usuario, entrar, sair, atualizarUsuarioLogado: guardar }),
    [usuario, entrar, sair, guardar],
  )

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>
}
