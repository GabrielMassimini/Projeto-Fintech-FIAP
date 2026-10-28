import { useLocation, useNavigate } from 'react-router-dom'
import { LuArrowLeft, LuHouse } from 'react-icons/lu'
import { Botao } from '../components/ui/Botao'
import { BotaoLink } from '../components/ui/BotaoLink'
import { Logo } from '../components/ui/Logo'

// Página de erro personalizada: aparece em qualquer endereço que não existe (rota "*")
export function NaoEncontradoPage() {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-rosa-xclaro px-6 text-center">
      <Logo className="mb-8 h-14 w-40 rounded-xl" />
      <p className="bg-linear-to-br from-rosa to-rosa-escuro bg-clip-text text-8xl font-bold text-transparent sm:text-9xl">
        404
      </p>
      <h1 className="mt-4 text-2xl font-semibold text-gray-900">Página não encontrada</h1>
      <p className="mt-2 max-w-md text-sm text-gray-500">
        O endereço <code className="rounded bg-white px-1.5 py-0.5 text-rosa">{location.pathname}</code> não existe no
        MassPay. Ele pode ter mudado ou ter sido digitado errado.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Botao variante="secundario" onClick={() => navigate(-1)}>
          <LuArrowLeft /> Voltar
        </Botao>
        <BotaoLink to="/">
          <LuHouse /> Ir para o início
        </BotaoLink>
      </div>
    </div>
  )
}
