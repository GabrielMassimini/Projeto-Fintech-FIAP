import type { ReactNode } from 'react'
import { LuCircleAlert, LuCircleCheck } from 'react-icons/lu'

interface AlertaProps {
  tipo?: 'erro' | 'sucesso'
  children: ReactNode
}

export function Alerta({ tipo = 'erro', children }: AlertaProps) {
  const estilos =
    tipo === 'erro' ? 'border-red-200 bg-red-50 text-red-700' : 'border-green-200 bg-green-50 text-green-700'
  const Icone = tipo === 'erro' ? LuCircleAlert : LuCircleCheck
  return (
    <div role={tipo === 'erro' ? 'alert' : 'status'} className={`flex items-start gap-2 rounded-xl border px-4 py-3 text-sm ${estilos}`}>
      <Icone className="mt-0.5 shrink-0" aria-hidden />
      <div>{children}</div>
    </div>
  )
}
