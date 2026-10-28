import type { Categoria } from '../types/Categoria'
import { api } from './api'

export const categoriaService = {
  listar: (): Promise<Categoria[]> => api.get('/categorias'),
}
