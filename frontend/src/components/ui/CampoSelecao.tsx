import type { ReactNode, SelectHTMLAttributes } from 'react'

interface CampoSelecaoProps extends SelectHTMLAttributes<HTMLSelectElement> {
  rotulo: string
  erro?: string
  children: ReactNode // os <option>
}

export function CampoSelecao({ rotulo, erro, className = '', children, ...props }: CampoSelecaoProps) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-sm font-medium text-gray-700">{rotulo}</span>
      <select
        className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-rosa focus:ring-2 focus:ring-rosa-claro disabled:bg-gray-50 disabled:text-gray-500 ${
          erro ? 'border-red-400' : 'border-gray-200'
        }`}
        {...props}
      >
        {children}
      </select>
      {erro && <span className="mt-1 block text-xs text-red-600">{erro}</span>}
    </label>
  )
}
