// Endereço da API vem do arquivo .env (VITE_API_URL)
const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api'

// Erro padronizado: a API devolve { status, mensagem, campos } quando algo dá errado
export class ErroApi extends Error {
  status: number
  campos: Record<string, string> | null

  constructor(status: number, mensagem: string, campos: Record<string, string> | null = null) {
    super(mensagem)
    this.status = status
    this.campos = campos
  }
}

async function requisicao<T>(caminho: string, opcoes: RequestInit = {}): Promise<T> {
  let resposta: Response
  try {
    resposta = await fetch(`${API_URL}${caminho}`, {
      ...opcoes,
      headers: { 'Content-Type': 'application/json', ...opcoes.headers },
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
    return undefined as T
  }
  return resposta.json() as Promise<T>
}

export const api = {
  get: <T>(caminho: string) => requisicao<T>(caminho),
  post: <T>(caminho: string, corpo: unknown) =>
    requisicao<T>(caminho, { method: 'POST', body: JSON.stringify(corpo) }),
  put: <T>(caminho: string, corpo: unknown) =>
    requisicao<T>(caminho, { method: 'PUT', body: JSON.stringify(corpo) }),
  delete: (caminho: string) => requisicao<void>(caminho, { method: 'DELETE' }),
}

// Mensagem amigável para mostrar na tela a partir de qualquer erro
export function mensagemDeErro(erro: unknown): string {
  if (erro instanceof Error) {
    return erro.message
  }
  return 'Ocorreu um erro inesperado'
}
