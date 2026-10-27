import type { IconType } from 'react-icons'
import { LuBriefcase, LuCar, LuClapperboard, LuHouse, LuLaptop, LuReceipt, LuShoppingCart } from 'react-icons/lu'

// O script do banco grava os nomes sem acento; aqui ficam o nome para exibir e o ícone de cada um
const categorias: Record<string, { nome: string; icone: IconType }> = {
  Salario: { nome: 'Salário', icone: LuBriefcase },
  Freelance: { nome: 'Freelance', icone: LuLaptop },
  Alimentacao: { nome: 'Alimentação', icone: LuShoppingCart },
  Moradia: { nome: 'Moradia', icone: LuHouse },
  Transporte: { nome: 'Transporte', icone: LuCar },
  Lazer: { nome: 'Lazer', icone: LuClapperboard },
}

export function nomeDaCategoria(nomeCategoria: string): string {
  return categorias[nomeCategoria]?.nome ?? nomeCategoria
}

export function iconeDaCategoria(nomeCategoria: string): IconType {
  return categorias[nomeCategoria]?.icone ?? LuReceipt
}
