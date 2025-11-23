"use client";

import { useEffect, useState } from "react";
import RequireAuth from "@/components/RequireAuth";
import { apiFetch } from "@/lib/api";
import { useToast } from "@/components/Toaster";
import { Check, Trash2 } from "lucide-react";

type Barreira = { id: number; descricao: string };
type Acessibilidade = { id: number; descricao: string };
type Vinculo = {
  barreiraId: number;
  acessibilidadeId: number;
  barreira: Barreira;
  acessibilidade: Acessibilidade;
};

export default function VinculosPage() {
  const { show } = useToast();
  const [vinculos, setVinculos] = useState<Vinculo[]>([]);
  const [barreiras, setBarreiras] = useState<Barreira[]>([]);
  const [acessibilidades, setAcessibilidades] = useState<Acessibilidade[]>([]);
  const [loading, setLoading] = useState(true);
  const [barreiraId, setBarreiraId] = useState("");
  const [acessibilidadeId, setAcessibilidadeId] = useState("");
  const [creating, setCreating] = useState(false);
  // Armazena qual vínculo está em confirmação de exclusão ("barreiraId-acessibilidadeId")
  const [confirming, setConfirming] = useState<string | null>(null);
  // Termo de busca para filtrar barreiras ou acessibilidades
  const [searchTerm, setSearchTerm] = useState("");
  // Ordenação e paginação
  const [sortBy, setSortBy] = useState<"barreira" | "qtd">("barreira");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  async function carregar() {
    try {
      const [vinculosData, barreirasData, acessibilidadesData] =
        await Promise.all([
          apiFetch<{ data: Vinculo[] }>("/barreira-acessibilidade"),
          apiFetch<{ data: Barreira[] }>("/barreiras"),
          apiFetch<{ data: Acessibilidade[] }>("/acessibilidades"),
        ]);

      setVinculos(vinculosData.data);
      setBarreiras(barreirasData.data);
      setAcessibilidades(acessibilidadesData.data);
    } catch {
      show("Erro ao carregar dados", "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function criar(e: React.FormEvent) {
    e.preventDefault();
    if (!barreiraId || !acessibilidadeId) return;

    setCreating(true);
    try {
      await apiFetch("/barreira-acessibilidade", {
        method: "POST",
        body: JSON.stringify({
          barreiraId: Number(barreiraId),
          acessibilidadeId: Number(acessibilidadeId),
        }),
      });

      await carregar();
      setBarreiraId("");
      setAcessibilidadeId("");
      show("Vínculo criado com sucesso!", "success");
    } catch (err) {
      show(
        err instanceof Error ? err.message : "Erro ao criar vínculo",
        "error"
      );
    } finally {
      setCreating(false);
    }
  }

  async function deletar(barreiraId: number, acessibilidadeId: number) {
    try {
      await apiFetch(
        `/barreira-acessibilidade/${barreiraId}/${acessibilidadeId}`,
        {
          method: "DELETE",
        }
      );

      await carregar();
      show("Vínculo excluído com sucesso!", "success");
    } catch (err) {
      show(
        err instanceof Error ? err.message : "Erro ao excluir vínculo",
        "error"
      );
    }
  }

  // Removido early return para garantir ordem consistente dos hooks; exibe loading dentro do JSX

  // Normaliza texto para busca
  function norm(t: string) {
    return t.toLowerCase();
  }

  // Aplica filtro de busca
  const filteredVinculos = vinculos.filter((v) => {
    if (!searchTerm.trim()) return true;
    const term = norm(searchTerm.trim());
    return (
      norm(v.barreira.descricao).includes(term) ||
      norm(v.acessibilidade.descricao).includes(term)
    );
  });

  // Agrupar vínculos por barreira para melhor visualização (já filtrados)
  const vinculosPorBarreira = filteredVinculos.reduce((acc, v) => {
    if (!acc[v.barreiraId]) {
      acc[v.barreiraId] = {
        barreira: v.barreira,
        acessibilidades: [],
      };
    }
    acc[v.barreiraId].acessibilidades.push(v.acessibilidade);
    return acc;
  }, {} as Record<number, { barreira: Barreira; acessibilidades: Acessibilidade[] }>);

  // Destaca termo de busca
  function highlight(text: string) {
    if (!searchTerm.trim()) return text;
    const term = searchTerm.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(${term})`, "ig");
    return text.split(regex).map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="bg-yellow-200 text-yellow-900 rounded px-0.5">
          {part}
        </mark>
      ) : (
        <span key={i}>{part}</span>
      )
    );
  }

  // Converter em array para ordenar
  const grupos = Object.values(vinculosPorBarreira).map((g) => ({
    barreira: g.barreira,
    acessibilidades: g.acessibilidades,
    qtd: g.acessibilidades.length,
  }));

  // Ordenação
  grupos.sort((a, b) => {
    if (sortBy === "barreira") {
      const cmp = a.barreira.descricao.localeCompare(
        b.barreira.descricao,
        "pt-BR"
      );
      return sortDir === "asc" ? cmp : -cmp;
    } else {
      const cmp = a.qtd - b.qtd;
      return sortDir === "asc" ? cmp : -cmp;
    }
  });

  // Resetar página quando filtros mudam
  // Resetar página quando parâmetros mudam
  useEffect(() => {
    setPage(1);
  }, [searchTerm, sortBy, sortDir, pageSize]);

  const totalPages = Math.max(1, Math.ceil(grupos.length / pageSize));
  const paginated = grupos.slice((page - 1) * pageSize, page * pageSize);

  function changePage(next: number) {
    if (next < 1 || next > totalPages) return;
    setPage(next);
  }

  function exportCsv() {
    if (filteredVinculos.length === 0) {
      show("Nada para exportar", "error");
      return;
    }
    const header =
      "barreira_id,barreira_descricao,acessibilidade_id,acessibilidade_descricao";
    const rows = filteredVinculos.map((v) =>
      [
        v.barreira.id,
        `"${v.barreira.descricao.replace(/"/g, '""')}"`,
        v.acessibilidade.id,
        `"${v.acessibilidade.descricao.replace(/"/g, '""')}"`,
      ].join(",")
    );
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "vinculos.csv";
    a.click();
    URL.revokeObjectURL(url);
    show("CSV exportado", "success");
  }

  return (
    <RequireAuth>
      {loading ? (
        <p className="text-sm text-zinc-600">Carregando...</p>
      ) : (
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-semibold text-zinc-900">
              Vínculos Barreira ↔ Acessibilidade
            </h1>
            <p className="text-sm text-zinc-600 mt-1">
              Defina quais acessibilidades resolvem cada barreira para calcular
              a compatibilidade entre PCDs e vagas.
            </p>
          </div>

          {/* Formulário de criação */}
          <div className="bg-white rounded-lg border border-zinc-200 p-6">
            <h2 className="text-lg font-semibold text-zinc-900 mb-4">
              Criar Novo Vínculo
            </h2>
            <form onSubmit={criar} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-800 mb-2">
                    Barreira
                  </label>
                  <select
                    className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm"
                    value={barreiraId}
                    onChange={(e) => setBarreiraId(e.target.value)}
                    required
                  >
                    <option value="">Selecione uma barreira...</option>
                    {barreiras.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.descricao}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-800 mb-2">
                    Acessibilidade que resolve
                  </label>
                  <select
                    className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm"
                    value={acessibilidadeId}
                    onChange={(e) => setAcessibilidadeId(e.target.value)}
                    required
                  >
                    <option value="">Selecione uma acessibilidade...</option>
                    {acessibilidades.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.descricao}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <button
                type="submit"
                disabled={creating}
                className="rounded-md bg-[#755fe3] px-4 py-2 text-white hover:opacity-95 disabled:opacity-60"
              >
                {creating ? "Criando..." : "Criar Vínculo"}
              </button>
            </form>
          </div>

          {/* Lista de vínculos agrupados */}
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <h2 className="text-lg font-semibold text-zinc-900">
                Vínculos Cadastrados ({filteredVinculos.length}
                {searchTerm.trim() &&
                  filteredVinculos.length !== vinculos.length && (
                    <span className="text-xs text-zinc-500">
                      {" "}
                      de {vinculos.length}
                    </span>
                  )}
                )
              </h2>
              <div className="flex flex-col lg:flex-row gap-3 lg:items-center">
                <div className="flex flex-wrap gap-3">
                  <select
                    value={sortBy}
                    onChange={(e) =>
                      setSortBy(e.target.value as "barreira" | "qtd")
                    }
                    className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-[#755fe3]"
                  >
                    <option value="barreira">Ordenar por Barreira</option>
                    <option value="qtd">Ordenar por Quantidade</option>
                  </select>
                  <select
                    value={sortDir}
                    onChange={(e) =>
                      setSortDir(e.target.value as "asc" | "desc")
                    }
                    className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-[#755fe3]"
                  >
                    <option value="asc">Ascendente</option>
                    <option value="desc">Descendente</option>
                  </select>
                  <select
                    value={pageSize}
                    onChange={(e) => setPageSize(Number(e.target.value))}
                    className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-[#755fe3]"
                  >
                    <option value={5}>5 por página</option>
                    <option value={10}>10 por página</option>
                    <option value={20}>20 por página</option>
                  </select>
                  <button
                    type="button"
                    onClick={exportCsv}
                    className="cursor-pointer rounded-md bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 text-sm font-medium"
                  >
                    Exportar CSV
                  </button>
                </div>
                {totalPages > 1 && (
                  <div className="flex items-center gap-2 mt-1">
                    <button
                      type="button"
                      onClick={() => changePage(page - 1)}
                      disabled={page === 1}
                      className="cursor-pointer rounded border border-zinc-300 px-2 py-1 text-sm disabled:opacity-40 hover:bg-zinc-50"
                    >
                      ◀
                    </button>
                    <span className="text-xs text-zinc-600">
                      Página {page} de {totalPages}
                    </span>
                    <button
                      type="button"
                      onClick={() => changePage(page + 1)}
                      disabled={page === totalPages}
                      className="cursor-pointer rounded border border-zinc-300 px-2 py-1 text-sm disabled:opacity-40 hover:bg-zinc-50"
                    >
                      ▶
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Campo de busca */}
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
              <input
                type="text"
                placeholder="Buscar por barreira ou acessibilidade..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-[#755fe3] focus:border-transparent"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="cursor-pointer rounded-md border border-zinc-300 px-3 py-2 text-sm hover:bg-zinc-50 font-medium"
                >
                  Limpar
                </button>
              )}
            </div>

            {Object.keys(vinculosPorBarreira).length === 0 ? (
              <p className="text-zinc-600 bg-white rounded-lg border border-zinc-200 p-4">
                {searchTerm.trim()
                  ? "Nenhum vínculo encontrado com o termo informado."
                  : "Nenhum vínculo cadastrado ainda."}
              </p>
            ) : (
              <div className="space-y-3">
                {paginated.map(({ barreira, acessibilidades: acesses }) => (
                  <div
                    key={barreira.id}
                    className="bg-white rounded-lg border border-zinc-200 p-4"
                  >
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <h3 className="font-semibold text-zinc-900">
                          🚧 {highlight(barreira.descricao)}
                        </h3>
                        <p className="text-xs text-zinc-500 mt-1">
                          {acesses.length} acessibilidade(s) vinculada(s)
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {acesses.map((acess) => (
                        <div
                          key={`${barreira.id}-${acess.id}`}
                          className="flex items-center gap-2 bg-green-50 text-green-800 px-3 py-1.5 rounded-md text-sm"
                        >
                          <Check className="w-4 h-4" aria-hidden />
                          <span>{acess.descricao}</span>
                          {confirming === `${barreira.id}-${acess.id}` ? (
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => {
                                  deletar(barreira.id, acess.id);
                                  setConfirming(null);
                                }}
                                className="cursor-pointer rounded bg-red-600 hover:bg-red-700 text-white px-2 py-0.5 text-xs font-medium"
                                aria-label="Confirmar remoção do vínculo"
                              >
                                Confirmar
                              </button>
                              <button
                                type="button"
                                onClick={() => setConfirming(null)}
                                className="cursor-pointer rounded bg-zinc-200 hover:bg-zinc-300 text-zinc-700 px-2 py-0.5 text-xs font-medium"
                                aria-label="Cancelar remoção"
                              >
                                Cancelar
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() =>
                                setConfirming(`${barreira.id}-${acess.id}`)
                              }
                              className="cursor-pointer inline-flex items-center gap-1 text-red-600 hover:text-red-700 px-2 py-0.5 rounded hover:bg-red-50 text-xs font-medium"
                              aria-label="Remover vínculo"
                            >
                              <Trash2 className="w-3.5 h-3.5" aria-hidden />
                              Remover
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Exemplo de uso */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">
              💡 Como funciona?
            </h3>
            <p className="text-sm text-blue-800">
              <strong>Exemplo:</strong> Se você criar um vínculo entre a
              barreira &quot;Auditiva&quot; e a acessibilidade &quot;Intérprete
              de Libras&quot;, quando um PCD com barreira &quot;Auditiva&quot;
              se candidatar a uma vaga que oferece &quot;Intérprete de
              Libras&quot;, o sistema calculará uma compatibilidade maior.
              Quanto mais barreiras forem resolvidas pelas acessibilidades da
              vaga, maior a % de compatibilidade.
            </p>
          </div>
        </div>
      )}
    </RequireAuth>
  );
}
