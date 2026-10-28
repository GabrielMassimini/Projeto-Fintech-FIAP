import type { Usuario, UsuarioForm } from '../types/Usuario'
import { api } from './api'

export const usuarioService = {
  listar: (): Promise<Usuario[]> => api.get('/usuarios'),
  buscar: (id: number): Promise<Usuario> => api.get(`/usuarios/${id}`),
  criar: (dados: UsuarioForm): Promise<Usuario> => api.post('/usuarios', dados),
  atualizar: (id: number, dados: UsuarioForm): Promise<Usuario> => api.put(`/usuarios/${id}`, dados),
  excluir: (id: number) => api.delete(`/usuarios/${id}`),
}
