import { Route, Routes } from 'react-router-dom'
import { LayoutPrivado } from './components/layout/LayoutPrivado'
import { ContaFormPage } from './pages/contas/ContaFormPage'
import { ContasPage } from './pages/contas/ContasPage'
import { InicioPage } from './pages/InicioPage'
import { InvestimentoFormPage } from './pages/investimentos/InvestimentoFormPage'
import { InvestimentosPage } from './pages/investimentos/InvestimentosPage'
import { LoginPage } from './pages/LoginPage'
import { NaoEncontradoPage } from './pages/NaoEncontradoPage'
import { TransacaoFormPage } from './pages/transacoes/TransacaoFormPage'
import { TransacoesPage } from './pages/transacoes/TransacoesPage'
import { UsuarioFormPage } from './pages/usuarios/UsuarioFormPage'
import { UsuariosPage } from './pages/usuarios/UsuariosPage'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      {/* Páginas que exigem login: todas usam a barra lateral e o cabeçalho */}
      <Route path="/" element={<LayoutPrivado />}>
        <Route index element={<InicioPage />} />

        <Route path="contas" element={<ContasPage />} />
        <Route path="contas/nova" element={<ContaFormPage />} />
        <Route path="contas/:id/editar" element={<ContaFormPage />} />

        <Route path="transacoes" element={<TransacoesPage />} />
        <Route path="transacoes/nova" element={<TransacaoFormPage />} />
        <Route path="transacoes/:id/editar" element={<TransacaoFormPage />} />

        <Route path="investimentos" element={<InvestimentosPage />} />
        <Route path="investimentos/novo" element={<InvestimentoFormPage />} />
        <Route path="investimentos/:id/editar" element={<InvestimentoFormPage />} />

        <Route path="usuarios" element={<UsuariosPage />} />
        <Route path="usuarios/novo" element={<UsuarioFormPage />} />
        <Route path="usuarios/:id/editar" element={<UsuarioFormPage />} />
      </Route>

      {/* Qualquer outro endereço cai na página de erro personalizada */}
      <Route path="*" element={<NaoEncontradoPage />} />
    </Routes>
  )
}

export default App
