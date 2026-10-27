import type { Investimento, InvestimentoForm } from '../types/Investimento'
import { api } from './api'

export const investimentoService = {
  listarDoUsuario: (usuarioId: number) => api.get<Investimento[]>(`/investimentos?usuarioId=${usuarioId}`),
  buscar: (id: number) => api.get<Investimento>(`/investimentos/${id}`),
  criar: (dados: InvestimentoForm) => api.post<Investimento>('/investimentos', dados),
  atualizar: (id: number, dados: InvestimentoForm) => api.put<Investimento>(`/investimentos/${id}`, dados),
  excluir: (id: number) => api.delete(`/investimentos/${id}`),
}
