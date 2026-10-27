import type { Usuario, UsuarioForm } from '../types/Usuario'
import { api } from './api'

export const usuarioService = {
  listar: () => api.get<Usuario[]>('/usuarios'),
  buscar: (id: number) => api.get<Usuario>(`/usuarios/${id}`),
  criar: (dados: UsuarioForm) => api.post<Usuario>('/usuarios', dados),
  atualizar: (id: number, dados: UsuarioForm) => api.put<Usuario>(`/usuarios/${id}`, dados),
  excluir: (id: number) => api.delete(`/usuarios/${id}`),
}
