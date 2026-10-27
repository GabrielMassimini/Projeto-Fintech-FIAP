import { useId, type ReactNode, type SelectHTMLAttributes } from 'react'

interface CampoSelecaoProps extends SelectHTMLAttributes<HTMLSelectElement> {
  rotulo: string
  erro?: string
  children: ReactNode // os <option>
}

export function CampoSelecao({ rotulo, erro, className = '', children, ...props }: CampoSelecaoProps) {
  const id = useId()
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-gray-700">
        {rotulo}
      </label>
      <select
        id={id}
        aria-invalid={erro ? true : undefined}
        className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-rosa focus:ring-2 focus:ring-rosa-claro disabled:bg-gray-50 disabled:text-gray-500 ${
          erro ? 'border-red-400' : 'border-gray-200'
        }`}
        {...props}
      >
        {children}
      </select>
      {erro && <p className="mt-1 text-xs text-red-600">{erro}</p>}
    </div>
  )
}
