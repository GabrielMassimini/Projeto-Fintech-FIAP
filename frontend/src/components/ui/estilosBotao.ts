export type VarianteBotao = 'principal' | 'secundario' | 'perigo'

const base =
  'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60'

const variantes: Record<VarianteBotao, string> = {
  principal: 'bg-rosa text-white shadow-[0_2px_10px_rgba(237,20,91,0.28)] hover:bg-rosa-escuro focus-visible:ring-rosa',
  secundario: 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 focus-visible:ring-rosa',
  perigo: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500',
}

// Usado pelo <Botao> e pelo <BotaoLink>, para os dois terem a mesma aparência
export function classesBotao(variante: VarianteBotao = 'principal', extra = ''): string {
  return `${base} ${variantes[variante]} ${extra}`
}
