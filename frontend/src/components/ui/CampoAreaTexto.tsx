import type { TextareaHTMLAttributes } from 'react'

interface CampoAreaTextoProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  rotulo: string
  erro?: string
}

export function CampoAreaTexto({ rotulo, erro, className = '', ...props }: CampoAreaTextoProps) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-sm font-medium text-gray-700">{rotulo}</span>
      <textarea
        rows={3}
        className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm outline-none transition placeholder:text-gray-400 focus:border-rosa focus:ring-2 focus:ring-rosa-claro ${
          erro ? 'border-red-400' : 'border-gray-200'
        }`}
        {...props}
      />
      {erro && <span className="mt-1 block text-xs text-red-600">{erro}</span>}
    </label>
  )
}
