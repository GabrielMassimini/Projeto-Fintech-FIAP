import { useState } from 'react'
import { ErroApi, mensagemDeErro } from '../services/api'

// Controla o envio de um formulário: botão "salvando", mensagem geral e erros de cada campo.
export function useEnvio() {
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [campos, setCampos] = useState<Record<string, string>>({})

  async function enviar(acao: () => Promise<void>) {
    setEnviando(true)
    setErro(null)
    setCampos({})
    try {
      await acao()
    } catch (e) {
      setErro(mensagemDeErro(e))
      if (e instanceof ErroApi && e.campos) {
        setCampos(e.campos)
      }
      setEnviando(false)
    }
  }

  return { enviando, erro, campos, enviar }
}
