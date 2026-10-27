import type { Conta, ContaForm } from '../types/Conta'
import { api } from './api'

export const contaService = {
  listar: (usuarioId?: number) => api.get<Conta[]>(usuarioId ? `/contas?usuarioId=${usuarioId}` : '/contas'),
  buscar: (id: number) => api.get<Conta>(`/contas/${id}`),
  criar: (dados: ContaForm) => api.post<Conta>('/contas', dados),
  atualizar: (id: number, dados: ContaForm) => api.put<Conta>(`/contas/${id}`, dados),
  excluir: (id: number) => api.delete(`/contas/${id}`),
}
