import type { ReactNode } from 'react'
import type { IconType } from 'react-icons'

interface EstadoVazioProps {
  icone: IconType
  titulo: string
  children?: ReactNode // texto e/ou botão de ação
}

export function EstadoVazio({ icone: Icone, titulo, children }: EstadoVazioProps) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-gray-200 bg-white px-6 py-12 text-center">
      <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-rosa-claro text-2xl text-rosa">
        <Icone aria-hidden />
      </span>
      <h2 className="font-semibold text-gray-900">{titulo}</h2>
      {children && <div className="mt-2 flex flex-col items-center gap-4 text-sm text-gray-500">{children}</div>}
    </div>
  )
}
