import type { Transacao, TransacaoForm } from '../types/Transacao'
import { api } from './api'

export const transacaoService = {
  listarDoUsuario: (usuarioId: number) => api.get<Transacao[]>(`/transacoes?usuarioId=${usuarioId}`),
  buscar: (id: number) => api.get<Transacao>(`/transacoes/${id}`),
  criar: (dados: TransacaoForm) => api.post<Transacao>('/transacoes', dados),
  atualizar: (id: number, dados: TransacaoForm) => api.put<Transacao>(`/transacoes/${id}`, dados),
  excluir: (id: number) => api.delete(`/transacoes/${id}`),
}
