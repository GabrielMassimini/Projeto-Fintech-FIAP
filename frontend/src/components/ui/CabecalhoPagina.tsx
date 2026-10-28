import type { ReactNode } from 'react'

interface CabecalhoPaginaProps {
  titulo: string
  subtitulo?: string
  acoes?: ReactNode
}

export function CabecalhoPagina({ titulo, subtitulo, acoes }: CabecalhoPaginaProps) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">{titulo}</h1>
        {subtitulo && <p className="text-sm text-gray-500">{subtitulo}</p>}
      </div>
      {acoes && <div className="flex flex-wrap gap-2">{acoes}</div>}
    </div>
  )
}
