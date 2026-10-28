import type { ButtonHTMLAttributes } from 'react'
import { classesBotao, type VarianteBotao } from './estilosBotao'

interface BotaoProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: VarianteBotao
}

export function Botao({ variante = 'principal', className = '', type = 'button', ...props }: BotaoProps) {
  return <button type={type} className={classesBotao(variante, className)} {...props} />
}
