import { Link } from 'react-router-dom'
import { LuPencil, LuTrash2 } from 'react-icons/lu'

interface AcoesLinhaProps {
  editarPara: string
  aoExcluir: () => void
  descricao: string // para leitores de tela: "Editar conta 10001-0"
}

// Botões de editar e excluir no fim de cada linha das tabelas
export function AcoesLinha({ editarPara, aoExcluir, descricao }: AcoesLinhaProps) {
  return (
    <div className="flex justify-end gap-1">
      <Link
        to={editarPara}
        className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rosa"
        aria-label={`Editar ${descricao}`}
        title="Editar"
      >
        <LuPencil />
      </Link>
      <button
        type="button"
        onClick={aoExcluir}
        className="rounded-lg p-2 text-gray-500 transition hover:bg-red-50 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
        aria-label={`Excluir ${descricao}`}
        title="Excluir"
      >
        <LuTrash2 />
      </button>
    </div>
  )
}
