import { useEffect, useState } from 'react'
import { LuTags } from 'react-icons/lu'
import { Alerta } from '../components/ui/Alerta'
import { CabecalhoPagina } from '../components/ui/CabecalhoPagina'
import { Carregando } from '../components/ui/Carregando'
import { EstadoVazio } from '../components/ui/EstadoVazio'
import { Etiqueta } from '../components/ui/Etiqueta'
import { mensagemDeErro } from '../services/api'
import { categoriaService } from '../services/categoriaService'
import type { Categoria } from '../types/Categoria'
import { iconeDaCategoria, nomeDaCategoria } from '../utils/categorias'

// Página do CategoriaController: só consulta, porque as categorias são criadas pelo script do banco
export function CategoriasPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    async function carregar() {
      try {
        setCategorias(await categoriaService.listar())
      } catch (e) {
        setErro(mensagemDeErro(e))
      } finally {
        setCarregando(false)
      }
    }
    carregar()
  }, [])

  return (
    <>
      <CabecalhoPagina titulo="Categorias" subtitulo="Categorias usadas para classificar as transações" />

      <div className="space-y-4">
        {erro && <Alerta>{erro}</Alerta>}

        {carregando ? (
          <Carregando />
        ) : categorias.length === 0 ? (
          <EstadoVazio icone={LuTags} titulo="Nenhuma categoria cadastrada">
            <p>Rode o script database/01_criar_banco_masspay.sql para criar as categorias.</p>
          </EstadoVazio>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-100 bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-4 py-3">Categoria</th>
                  <th className="px-4 py-3">Descrição</th>
                  <th className="px-4 py-3">Tipo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {categorias.map((c) => {
                  const Icone = iconeDaCategoria(c.nomeCategoria)
                  return (
                    <tr key={c.id} className="hover:bg-rosa-xclaro/60">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-rosa-claro text-rosa">
                            <Icone />
                          </span>
                          <span className="font-medium text-gray-900">{nomeDaCategoria(c.nomeCategoria)}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{c.descricao || '-'}</td>
                      <td className="px-4 py-3">
                        {c.tipoMovimentacao === 'RECEITA' ? (
                          <Etiqueta cor="verde">Receita</Etiqueta>
                        ) : (
                          <Etiqueta cor="vermelho">Despesa</Etiqueta>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  )
}
