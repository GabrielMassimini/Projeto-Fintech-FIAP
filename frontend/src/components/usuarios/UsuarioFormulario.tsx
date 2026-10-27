import { useState, type FormEvent } from 'react'
import { LuSave } from 'react-icons/lu'
import { useEnvio } from '../../hooks/useEnvio'
import type { StatusUsuario, Usuario, UsuarioForm } from '../../types/Usuario'
import { hojeIso, somenteNumeros } from '../../utils/formatadores'
import { Alerta } from '../ui/Alerta'
import { Botao } from '../ui/Botao'
import { Caixa } from '../ui/Caixa'
import { CampoSelecao } from '../ui/CampoSelecao'
import { CampoTexto } from '../ui/CampoTexto'

interface UsuarioFormularioProps {
  inicial?: Usuario // sem usuário inicial = cadastro
  aoSalvar: (dados: UsuarioForm) => Promise<void>
  aoCancelar: () => void
}

export function UsuarioFormulario({ inicial, aoSalvar, aoCancelar }: UsuarioFormularioProps) {
  const edicao = inicial !== undefined
  const [nomeCompleto, setNomeCompleto] = useState(inicial?.nomeCompleto ?? '')
  const [cpf, setCpf] = useState(inicial?.cpf ?? '')
  const [dataNascimento, setDataNascimento] = useState(inicial?.dataNascimento ?? '')
  const [email, setEmail] = useState(inicial?.email ?? '')
  const [telefone, setTelefone] = useState(inicial?.telefone ?? '')
  const [senha, setSenha] = useState('')
  const [status, setStatus] = useState<StatusUsuario>(inicial?.status ?? 'ATIVO')
  const { enviando, erro, campos, enviar } = useEnvio()

  function handleSubmit(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    enviar(() =>
      aoSalvar({
        nomeCompleto: nomeCompleto.trim(),
        cpf,
        dataNascimento,
        email: email.trim(),
        telefone: telefone.trim(),
        // Na edição, senha em branco = manter a atual
        senha: senha === '' ? undefined : senha,
        status: edicao ? status : undefined,
      }),
    )
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-4">
      {erro && <Alerta>{erro}</Alerta>}
      <Caixa>
        <div className="grid gap-4 sm:grid-cols-2">
          <CampoTexto
            className="sm:col-span-2"
            rotulo="Nome completo"
            value={nomeCompleto}
            onChange={(e) => setNomeCompleto(e.target.value)}
            erro={campos.nomeCompleto}
            maxLength={150}
            required
          />
          <CampoTexto
            rotulo="CPF (só números)"
            inputMode="numeric"
            placeholder="12345678909"
            value={cpf}
            // Aceita colar "123.456.789-09": guarda só os 11 números
            onChange={(e) => setCpf(somenteNumeros(e.target.value).slice(0, 11))}
            erro={campos.cpf}
            required
          />
          <CampoTexto
            rotulo="Data de nascimento"
            type="date"
            max={hojeIso()}
            value={dataNascimento}
            onChange={(e) => setDataNascimento(e.target.value)}
            erro={campos.dataNascimento}
            required
          />
          <CampoTexto
            rotulo="E-mail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            erro={campos.email}
            maxLength={150}
            required
          />
          <CampoTexto
            rotulo="Telefone (opcional)"
            type="tel"
            placeholder="11987654321"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            erro={campos.telefone}
            maxLength={20}
          />
          <CampoTexto
            rotulo={edicao ? 'Nova senha (deixe em branco para manter)' : 'Senha'}
            type="password"
            autoComplete="new-password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            erro={campos.senha}
            minLength={6}
            maxLength={50}
            required={!edicao}
          />
          {edicao && (
            <CampoSelecao rotulo="Status" value={status} onChange={(e) => setStatus(e.target.value as StatusUsuario)} erro={campos.status}>
              <option value="ATIVO">Ativo</option>
              <option value="INATIVO">Inativo (não consegue fazer login)</option>
            </CampoSelecao>
          )}
        </div>
      </Caixa>
      <div className="flex justify-end gap-2">
        <Botao variante="secundario" onClick={aoCancelar} disabled={enviando}>
          Cancelar
        </Botao>
        <Botao type="submit" disabled={enviando}>
          <LuSave aria-hidden /> {enviando ? 'Salvando...' : 'Salvar'}
        </Botao>
      </div>
    </form>
  )
}
