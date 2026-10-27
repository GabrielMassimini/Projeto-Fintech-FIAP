import type { Usuario } from '../types/Usuario'
import { api } from './api'

export const authService = {
  login: (email: string, senha: string) => api.post<Usuario>('/auth/login', { email, senha }),
}
