import type { Conta, ContaForm } from '../types/Conta'
import { api } from './api'

export const contaService = {
  listar: (usuarioId: number): Promise<Conta[]> => api.get(`/contas?usuarioId=${usuarioId}`),
  buscar: (id: number): Promise<Conta> => api.get(`/contas/${id}`),
  criar: (dados: ContaForm): Promise<Conta> => api.post('/contas', dados),
  atualizar: (id: number, dados: ContaForm): Promise<Conta> => api.put(`/contas/${id}`, dados),
  excluir: (id: number) => api.delete(`/contas/${id}`),
}
