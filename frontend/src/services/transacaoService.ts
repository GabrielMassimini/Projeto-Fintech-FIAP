import type { Transacao, TransacaoForm } from '../types/Transacao'
import { api } from './api'

export const transacaoService = {
  listarDoUsuario: (usuarioId: number): Promise<Transacao[]> => api.get(`/transacoes?usuarioId=${usuarioId}`),
  buscar: (id: number): Promise<Transacao> => api.get(`/transacoes/${id}`),
  criar: (dados: TransacaoForm): Promise<Transacao> => api.post('/transacoes', dados),
  atualizar: (id: number, dados: TransacaoForm): Promise<Transacao> => api.put(`/transacoes/${id}`, dados),
  excluir: (id: number) => api.delete(`/transacoes/${id}`),
}
