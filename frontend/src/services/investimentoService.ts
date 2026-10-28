import type { Investimento, InvestimentoForm } from '../types/Investimento'
import { api } from './api'

export const investimentoService = {
  listarDoUsuario: (usuarioId: number): Promise<Investimento[]> => api.get(`/investimentos?usuarioId=${usuarioId}`),
  buscar: (id: number): Promise<Investimento> => api.get(`/investimentos/${id}`),
  criar: (dados: InvestimentoForm): Promise<Investimento> => api.post('/investimentos', dados),
  atualizar: (id: number, dados: InvestimentoForm): Promise<Investimento> => api.put(`/investimentos/${id}`, dados),
  excluir: (id: number) => api.delete(`/investimentos/${id}`),
}
