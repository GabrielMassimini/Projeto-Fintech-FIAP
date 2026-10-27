interface CarregandoProps {
  texto?: string
}

export function Carregando({ texto = 'Carregando...' }: CarregandoProps) {
  return (
    <div className="flex items-center justify-center gap-3 py-12 text-sm text-gray-500" role="status">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-rosa-claro border-t-rosa" aria-hidden />
      {texto}
    </div>
  )
}
