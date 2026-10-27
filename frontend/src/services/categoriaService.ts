import type { Categoria } from '../types/Categoria'
import { api } from './api'

export const categoriaService = {
  listar: () => api.get<Categoria[]>('/categorias'),
}
