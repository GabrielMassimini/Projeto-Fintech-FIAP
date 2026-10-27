const moeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

export function formatarMoeda(valor: number | null | undefined): string {
  return moeda.format(valor ?? 0)
}

// '2026-10-01' -> '01/10/2026' (sem passar por Date, para não sofrer com fuso horário)
export function formatarData(data: string | null | undefined): string {
  if (!data) {
    return '—'
  }
  const [ano, mes, dia] = data.split('-')
  return `${dia}/${mes}/${ano}`
}

// 'Ana Paula Souza' -> 'AS'
export function iniciais(nome: string): string {
  const partes = nome.trim().split(/\s+/)
  const primeira = partes[0]?.[0] ?? ''
  const ultima = partes.length > 1 ? partes[partes.length - 1][0] : ''
  return (primeira + ultima).toUpperCase()
}

export function primeiroNome(nome: string): string {
  return nome.trim().split(/\s+/)[0] ?? nome
}

function paraIso(data: Date): string {
  const mes = String(data.getMonth() + 1).padStart(2, '0')
  const dia = String(data.getDate()).padStart(2, '0')
  return `${data.getFullYear()}-${mes}-${dia}`
}

// Data de hoje no formato AAAA-MM-DD, para os campos <input type="date">
export function hojeIso(): string {
  return paraIso(new Date())
}

// Data de N dias atrás no formato AAAA-MM-DD
export function diasAtrasIso(dias: number): string {
  const data = new Date()
  data.setDate(data.getDate() - dias)
  return paraIso(data)
}
