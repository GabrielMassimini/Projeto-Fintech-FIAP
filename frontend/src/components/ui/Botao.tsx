import type { ComponentProps } from 'react'
import { classesBotao, type VarianteBotao } from './estilosBotao'

// ComponentProps<'button'> inclui o ref (React 19 permite passar ref como prop)
interface BotaoProps extends ComponentProps<'button'> {
  variante?: VarianteBotao
}

export function Botao({ variante = 'principal', className = '', type = 'button', ...props }: BotaoProps) {
  return <button type={type} className={classesBotao(variante, className)} {...props} />
}
