import { useId, type TextareaHTMLAttributes } from 'react'

interface CampoAreaTextoProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  rotulo: string
  erro?: string
}

export function CampoAreaTexto({ rotulo, erro, className = '', ...props }: CampoAreaTextoProps) {
  const id = useId()
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-gray-700">
        {rotulo}
      </label>
      <textarea
        id={id}
        rows={3}
        aria-invalid={erro ? true : undefined}
        className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm outline-none transition placeholder:text-gray-400 focus:border-rosa focus:ring-2 focus:ring-rosa-claro ${
          erro ? 'border-red-400' : 'border-gray-200'
        }`}
        {...props}
      />
      {erro && <p className="mt-1 text-xs text-red-600">{erro}</p>}
    </div>
  )
}
