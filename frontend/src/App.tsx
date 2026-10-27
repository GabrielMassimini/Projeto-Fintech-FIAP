import { Route, Routes } from 'react-router-dom'
import { LayoutPrivado } from './components/layout/LayoutPrivado'
import { InicioPage } from './pages/InicioPage'
import { LoginPage } from './pages/LoginPage'
import { NaoEncontradoPage } from './pages/NaoEncontradoPage'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      {/* Páginas que exigem login: todas usam a barra lateral e o cabeçalho */}
      <Route path="/" element={<LayoutPrivado />}>
        <Route index element={<InicioPage />} />
      </Route>

      {/* Qualquer outro endereço cai na página de erro personalizada */}
      <Route path="*" element={<NaoEncontradoPage />} />
    </Routes>
  )
}

export default App
