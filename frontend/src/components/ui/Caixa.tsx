import type { ReactNode } from 'react'

interface CaixaProps {
  titulo?: string
  acao?: ReactNode // ex.: um link "Ver todas" no canto
  className?: string
  children: ReactNode
}

// O bloco branco arredondado usado em todo o dashboard
export function Caixa({ titulo, acao, className = '', children }: CaixaProps) {
  return (
    <section className={`rounded-2xl border border-gray-100 bg-white p-5 shadow-sm ${className}`}>
      {(titulo || acao) && (
        <div className="mb-4 flex items-center justify-between gap-3">
          {titulo && <h2 className="text-base font-semibold text-gray-900">{titulo}</h2>}
          {acao}
        </div>
      )}
      {children}
    </section>
  )
}
