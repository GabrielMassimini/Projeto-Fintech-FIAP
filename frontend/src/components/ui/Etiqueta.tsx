import type { ReactNode } from 'react'

export type CorEtiqueta = 'verde' | 'vermelho' | 'amarelo' | 'cinza' | 'roxo' | 'rosa'

const cores: Record<CorEtiqueta, string> = {
  verde: 'bg-green-100 text-green-700',
  vermelho: 'bg-red-100 text-red-700',
  amarelo: 'bg-yellow-100 text-yellow-800',
  cinza: 'bg-gray-100 text-gray-600',
  roxo: 'bg-purple-100 text-purple-700',
  rosa: 'bg-rosa-claro text-rosa',
}

interface EtiquetaProps {
  cor?: CorEtiqueta
  children: ReactNode
}

// Pequeno selo colorido para status e tipos (ATIVA, RECEITA...)
export function Etiqueta({ cor = 'cinza', children }: EtiquetaProps) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${cores[cor]}`}>
      {children}
    </span>
  )
}
