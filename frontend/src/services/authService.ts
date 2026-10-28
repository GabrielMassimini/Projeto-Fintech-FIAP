import type { Usuario } from '../types/Usuario'
import { api } from './api'

export const authService = {
  login: (email: string, senha: string): Promise<Usuario> => api.post('/auth/login', { email, senha }),
}
