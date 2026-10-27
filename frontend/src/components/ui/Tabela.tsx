import type { ReactNode } from 'react'

export interface Coluna<T> {
  titulo: string
  conteudo: (item: T) => ReactNode
  alinharDireita?: boolean
}

interface TabelaProps<T> {
  colunas: Coluna<T>[]
  itens: T[]
  chave: (item: T) => number | string
}

// Tabela genérica: cada página diz quais colunas quer e como mostrar cada uma
export function Tabela<T>({ colunas, itens, chave }: TabelaProps<T>) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-gray-100 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
          <tr>
            {colunas.map((coluna) => (
              <th key={coluna.titulo} scope="col" className={`whitespace-nowrap px-4 py-3 font-semibold ${coluna.alinharDireita ? 'text-right' : ''}`}>
                {coluna.titulo}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {itens.map((item) => (
            <tr key={chave(item)} className="transition hover:bg-rosa-xclaro/60">
              {colunas.map((coluna) => (
                <td key={coluna.titulo} className={`px-4 py-3 align-middle ${coluna.alinharDireita ? 'text-right' : ''}`}>
                  {coluna.conteudo(item)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
