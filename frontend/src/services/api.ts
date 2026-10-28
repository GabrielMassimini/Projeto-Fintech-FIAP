// Endereço da API vem do arquivo .env (VITE_API_URL)
const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api'

// Erro da API: o backend devolve { status, mensagem, campos } quando algo dá errado
export class ErroApi extends Error {
  status: number
  campos: Record<string, string> | null

  constructor(status: number, mensagem: string, campos: Record<string, string> | null = null) {
    super(mensagem)
    this.status = status
    this.campos = campos
  }
}

// Faz a chamada com fetch e já trata os erros da API
async function requisicao(caminho: string, opcoes: RequestInit = {}) {
  let resposta: Response
  try {
    resposta = await fetch(`${API_URL}${caminho}`, {
      ...opcoes,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch {
    throw new ErroApi(0, 'Não foi possível conectar à API. Verifique se o backend está rodando.')
  }

  if (!resposta.ok) {
    const corpo = await resposta.json().catch(() => null)
    throw new ErroApi(resposta.status, corpo?.mensagem ?? `Erro ${resposta.status}`, corpo?.campos ?? null)
  }

  // 204 No Content (DELETE) não tem corpo
  if (resposta.status === 204) {
    return null
  }
  return resposta.json()
}

export const api = {
  get: (caminho: string) => requisicao(caminho),
  post: (caminho: string, corpo: object) => requisicao(caminho, { method: 'POST', body: JSON.stringify(corpo) }),
  put: (caminho: string, corpo: object) => requisicao(caminho, { method: 'PUT', body: JSON.stringify(corpo) }),
  delete: (caminho: string) => requisicao(caminho, { method: 'DELETE' }),
}

// Mensagem para mostrar na tela a partir de qualquer erro
export function mensagemDeErro(erro: unknown): string {
  if (erro instanceof Error) {
    return erro.message
  }
  return 'Ocorreu um erro inesperado'
}
