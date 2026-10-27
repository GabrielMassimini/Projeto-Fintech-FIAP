/* As dependências do useEffect vêm de quem usa o hook (ex.: o id da URL),
   então o linter não consegue conferi-las e a regra fica desligada neste arquivo. */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, type DependencyList } from 'react'
import { mensagemDeErro } from '../services/api'

// Busca dados da API quando a página abre (e de novo se as dependências mudarem).
export function useCarregar<T>(carregar: () => Promise<T>, dependencias: DependencyList = []) {
  const [dados, setDados] = useState<T | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    let ativo = true // evita atualizar o estado se a página fechar antes da resposta
    setCarregando(true)
    setErro(null)
    carregar()
      .then((resultado) => ativo && setDados(resultado))
      .catch((e) => ativo && setErro(mensagemDeErro(e)))
      .finally(() => ativo && setCarregando(false))
    return () => {
      ativo = false
    }
  }, dependencias)

  return { dados, setDados, carregando, erro }
}
