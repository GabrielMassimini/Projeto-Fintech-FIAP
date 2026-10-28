const moeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

export function formatarMoeda(valor: number | null | undefined): string {
  return moeda.format(valor ?? 0)
}

const numero = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 })

// 11.2 -> '11,2% a.a.'
export function formatarPercentualAno(valor: number | null | undefined): string {
  return valor == null ? '-' : `${numero.format(valor)}% a.a.`
}

// '2026-10-01' -> '01/10/2026' (sem passar por Date, para não sofrer com fuso horário)
export function formatarData(data: string | null | undefined): string {
  if (!data) {
    return '-'
  }
  const [ano, mes, dia] = data.split('-')
  return `${dia}/${mes}/${ano}`
}

// '12345678909' -> '123.456.789-09'
export function formatarCpf(cpf: string): string {
  return cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4')
}

export function somenteNumeros(texto: string): string {
  return texto.replace(/\D/g, '')
}

// Texto de um <input type="number"> para número; vazio vira null
export function paraNumero(texto: string): number | null {
  return texto.trim() === '' ? null : Number(texto)
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
