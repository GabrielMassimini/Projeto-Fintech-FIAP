import { useState, type FormEvent } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { LuLogIn, LuShieldCheck, LuTrendingUp, LuWallet } from 'react-icons/lu'
import { Alerta } from '../components/ui/Alerta'
import { Botao } from '../components/ui/Botao'
import { CampoTexto } from '../components/ui/CampoTexto'
import { Logo } from '../components/ui/Logo'
import { useAuth } from '../contexts/AuthContext/useAuth'
import { mensagemDeErro } from '../services/api'

export function LoginPage() {
  const { usuario, entrar } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState<string | null>(null)
  const [enviando, setEnviando] = useState(false)

  // Volta para a página que a pessoa tentou abrir antes do login
  const destino = (location.state as { de?: string } | null)?.de ?? '/'

  if (usuario) {
    return <Navigate to={destino} replace />
  }

  async function handleSubmit(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    setErro(null)
    setEnviando(true)
    try {
      await entrar(email, senha)
      navigate(destino, { replace: true })
    } catch (e) {
      setErro(mensagemDeErro(e))
      setEnviando(false)
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Lado da marca (só em telas grandes) */}
      <div className="relative hidden flex-1 flex-col justify-between overflow-hidden bg-linear-to-br from-rosa to-rosa-escuro p-12 text-white lg:flex">
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-white/10" />
        <div className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-white/10" />
        <div className="relative w-fit rounded-2xl bg-white px-2">
          <Logo className="h-16 w-44" />
        </div>
        <div className="relative max-w-md">
          <h1 className="mb-4 text-4xl font-bold leading-tight">Seu dinheiro, organizado em um só lugar.</h1>
          <ul className="space-y-3 text-white/90">
            <li className="flex items-center gap-3">
              <LuWallet /> Contas, receitas e despesas sempre atualizadas
            </li>
            <li className="flex items-center gap-3">
              <LuTrendingUp /> Acompanhe seus investimentos
            </li>
            <li className="flex items-center gap-3">
              <LuShieldCheck /> Senha protegida com criptografia
            </li>
          </ul>
        </div>
        <p className="relative text-sm text-white/70">MassPay · Projeto Fintech FIAP</p>
      </div>

      {/* Formulário */}
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <Logo className="h-16 w-44" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Entrar</h2>
          <p className="mb-6 mt-1 text-sm text-gray-500">Acesse sua conta MassPay com e-mail e senha.</p>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {erro && <Alerta>{erro}</Alerta>}
            <CampoTexto
              rotulo="E-mail"
              type="email"
              autoComplete="email"
              placeholder="voce@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <CampoTexto
              rotulo="Senha"
              type="password"
              autoComplete="current-password"
              placeholder="Sua senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
            <Botao type="submit" className="w-full" disabled={enviando || !email || !senha}>
              <LuLogIn />
              {enviando ? 'Entrando...' : 'Entrar'}
            </Botao>
          </form>

          <p className="mt-6 rounded-xl bg-rosa-xclaro px-4 py-3 text-xs text-gray-600">
            Para testar, use o usuário de teste descrito no README do projeto.
          </p>
        </div>
      </div>
    </div>
  )
}
