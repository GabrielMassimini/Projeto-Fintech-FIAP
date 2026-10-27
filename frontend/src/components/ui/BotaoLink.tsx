import { Link, type LinkProps } from 'react-router-dom'
import { classesBotao, type VarianteBotao } from './estilosBotao'

interface BotaoLinkProps extends LinkProps {
  variante?: VarianteBotao
}

// Um <Link> do React Router com cara de botão
export function BotaoLink({ variante = 'principal', className = '', ...props }: BotaoLinkProps) {
  return <Link className={classesBotao(variante, className)} {...props} />
}
