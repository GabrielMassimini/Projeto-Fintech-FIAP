import { useLocation } from 'react-router-dom'

// Lê a mensagem de sucesso que um formulário manda ao voltar para a lista:
// navigate('/contas', { state: { mensagem: 'Conta criada' } })
export function useMensagemDaRota(): string | null {
  const location = useLocation()
  return (location.state as { mensagem?: string } | null)?.mensagem ?? null
}
