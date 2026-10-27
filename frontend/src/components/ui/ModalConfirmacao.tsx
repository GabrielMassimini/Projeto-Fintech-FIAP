import { useEffect, useRef, type ReactNode } from 'react'
import { LuTriangleAlert } from 'react-icons/lu'
import { Botao } from './Botao'

interface ModalConfirmacaoProps {
  aberto: boolean
  titulo: string
  children: ReactNode
  textoConfirmar?: string
  processando?: boolean
  aoConfirmar: () => void
  aoCancelar: () => void
}

// Janela "tem certeza?" usada antes de excluir qualquer registro
export function ModalConfirmacao({
  aberto,
  titulo,
  children,
  textoConfirmar = 'Excluir',
  processando = false,
  aoConfirmar,
  aoCancelar,
}: ModalConfirmacaoProps) {
  const botaoCancelar = useRef<HTMLButtonElement>(null)

  // Ao abrir: foco no "Cancelar" (opção segura) e tecla Esc fecha
  useEffect(() => {
    if (!aberto) {
      return
    }
    botaoCancelar.current?.focus()
    const aoTeclar = (evento: KeyboardEvent) => {
      if (evento.key === 'Escape' && !processando) {
        aoCancelar()
      }
    }
    window.addEventListener('keydown', aoTeclar)
    return () => window.removeEventListener('keydown', aoTeclar)
  }, [aberto, processando, aoCancelar])

  if (!aberto) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 p-4" onClick={() => !processando && aoCancelar()}>
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="modal-titulo"
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
        onClick={(evento) => evento.stopPropagation()}
      >
        <div className="flex gap-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-100 text-xl text-red-600">
            <LuTriangleAlert aria-hidden />
          </span>
          <div>
            <h2 id="modal-titulo" className="text-lg font-semibold text-gray-900">
              {titulo}
            </h2>
            <div className="mt-1 text-sm text-gray-600">{children}</div>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <Botao ref={botaoCancelar} variante="secundario" onClick={aoCancelar} disabled={processando}>
            Cancelar
          </Botao>
          <Botao variante="perigo" onClick={aoConfirmar} disabled={processando}>
            {processando ? 'Excluindo...' : textoConfirmar}
          </Botao>
        </div>
      </div>
    </div>
  )
}
