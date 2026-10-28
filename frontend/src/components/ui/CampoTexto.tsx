import type { InputHTMLAttributes } from 'react'

interface CampoTextoProps extends InputHTMLAttributes<HTMLInputElement> {
  rotulo: string
  erro?: string
}

// O <label> envolve o <input>, assim clicar no texto também foca o campo
export function CampoTexto({ rotulo, erro, className = '', ...props }: CampoTextoProps) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-sm font-medium text-gray-700">{rotulo}</span>
      <input
        className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm outline-none transition placeholder:text-gray-400 focus:border-rosa focus:ring-2 focus:ring-rosa-claro disabled:bg-gray-50 disabled:text-gray-500 ${
          erro ? 'border-red-400' : 'border-gray-200'
        }`}
        {...props}
      />
      {erro && <span className="mt-1 block text-xs text-red-600">{erro}</span>}
    </label>
  )
}
