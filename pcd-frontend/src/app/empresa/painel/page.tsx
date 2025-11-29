"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "../../../lib/api";
import { getAuth } from "../../../lib/auth";
import Link from "next/link";
import RequireAuth from "../../../components/RequireAuth";
import { useToast } from "../../../components/Toaster";

type Empresa = {
  id: number;
  nomeFantasia: string;
  responsavelId: number | null;
  vagas?: {
    id: number;
    titulo: string;
    descricao?: string;
    escolaridade?: string | null;
    faixaSalarial?: string | null;
    metodoTrabalho?: string | null;
    acessibilidades?: Array<{ acessibilidadeId: number }>;
    subtiposAceitos?: Array<{ subtipoId: number }>;
  }[];
};

export default function PainelEmpresaPage() {
  const [mounted, setMounted] = useState(false);
  const [auth] = useState(() => getAuth());
  const token = auth?.token;
  const userId = auth?.usuario?.id ?? null;
  const { show } = useToast();

  const [empresa, setEmpresa] = useState<Empresa | null>(null);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [escolaridade, setEscolaridade] = useState("");
  const [faixaSalarial, setFaixaSalarial] = useState("");
  const [metodoTrabalho, setMetodoTrabalho] = useState("");
  const [acessibilidades, setAcessibilidades] = useState<
    Array<{ id: number; descricao: string }>
  >([]);
  const [acessibilidadesSelecionadas, setAcessibilidadesSelecionadas] =
    useState<number[]>([]);
  const [tipos, setTipos] = useState<
    Array<{
      id: number;
      nome: string;
      subtipos: Array<{ id: number; nome: string }>;
    }>
  >([]);
  const [subtiposSelecionados, setSubtiposSelecionados] = useState<number[]>(
    []
  );
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitulo, setEditTitulo] = useState("");
  const [editDescricao, setEditDescricao] = useState("");
  const [editEscolaridade, setEditEscolaridade] = useState("");
  const [editFaixaSalarial, setEditFaixaSalarial] = useState("");
  const [editMetodoTrabalho, setEditMetodoTrabalho] = useState("");
  const [editAcessibilidadesSelecionadas, setEditAcessibilidadesSelecionadas] =
    useState<number[]>([]);
  const [editSubtiposSelecionados, setEditSubtiposSelecionados] = useState<
    number[]
  >([]);

  // Permite apenas caracteres válidos para faixa salarial (R$, números, espaço, ponto, vírgula e hífen)
  function sanitizeFaixa(v: string) {
    return v.replace(/[^0-9R$.,\-\s]/g, "");
  }

  // Formata a faixa salarial para BRL com suporte a intervalo usando '-'
  function formatBRLFromDigits(value: string) {
    const digits = value.replace(/\D/g, "");
    if (!digits) return "";
    const n = parseInt(digits, 10);
    if (Number.isNaN(n)) return "";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
    }).format(n);
  }

  function formatFaixaMasked(input: string) {
    const sanitized = sanitizeFaixa(input);
    if (!sanitized) return "";
    const parts = sanitized.split("-");
    const formatted = parts
      .map((p) => formatBRLFromDigits(p.trim()))
      .filter((p) => p && p.length > 0)
      .join(" - ");
    return formatted;
  }

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!userId || !token) {
      setLoading(false);
      return;
    }
    (async () => {
      try {
        const detalhe = await apiFetch<Empresa>(`/empresas/minha`, {
          authToken: token,
        });
        setEmpresa(detalhe);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Erro ao carregar empresa"
        );
      } finally {
        setLoading(false);
      }
    })();
  }, [userId, token]);

  // Buscar acessibilidades e tipos disponíveis
  useEffect(() => {
    async function fetchData() {
      try {
        const [acessRes, tiposRes] = await Promise.all([
          apiFetch<{ data: Array<{ id: number; descricao: string }> }>(
            "/acessibilidades"
          ),
          apiFetch<{
            data: Array<{
              id: number;
              nome: string;
              subtipos: Array<{ id: number; nome: string }>;
            }>;
          }>("/tipos"),
        ]);
        setAcessibilidades(acessRes.data);
        // Normaliza evitando undefined em subtipos
        setTipos(
          tiposRes.data.map((t) => ({
            ...t,
            subtipos: Array.isArray(t.subtipos) ? t.subtipos : [],
          }))
        );
      } catch {
        // Silencioso, não é crítico
      }
    }
    fetchData();
  }, []);

  async function criarVaga(e: React.FormEvent) {
    e.preventDefault();
    if (!empresa) return;
    try {
      // Validações obrigatórias
      if (!escolaridade) {
        show("Informe a escolaridade da vaga.", "error");
        return;
      }
      if (acessibilidadesSelecionadas.length === 0) {
        show("Selecione ao menos uma acessibilidade oferecida.", "error");
        return;
      }

      setCreating(true);
      await apiFetch("/vagas", {
        method: "POST",
        body: JSON.stringify({
          empresaId: empresa.id,
          titulo,
          descricao,
          escolaridade,
          faixaSalarial: faixaSalarial || undefined,
          metodoTrabalho: metodoTrabalho || undefined,
          acessibilidadeIds: acessibilidadesSelecionadas,
          subtipoIds: subtiposSelecionados,
        }),
        authToken: token,
      });
      // refresh simples
      const detalhe = await apiFetch<Empresa>(`/empresas/${empresa.id}`);
      setEmpresa(detalhe);
      setTitulo("");
      setDescricao("");
      setEscolaridade("");
      setFaixaSalarial("");
      setMetodoTrabalho("");
      setAcessibilidadesSelecionadas([]);
      setSubtiposSelecionados([]);
      show("Vaga criada com sucesso!", "success");
    } catch (err) {
      show(err instanceof Error ? err.message : "Erro ao criar vaga", "error");
    } finally {
      setCreating(false);
    }
  }

  async function iniciarEdicao(v: {
    id: number;
    titulo: string;
    descricao?: string;
    escolaridade?: string | null;
    faixaSalarial?: string | null;
    metodoTrabalho?: string | null;
    acessibilidades?: Array<{ acessibilidadeId: number }>;
    subtiposAceitos?: Array<{ subtipoId: number }>;
  }) {
    setEditingId(v.id);
    setEditTitulo(v.titulo || "");
    setEditDescricao(v.descricao || "");
    setEditEscolaridade(v.escolaridade || "");
    setEditFaixaSalarial(v.faixaSalarial || "");
    setEditMetodoTrabalho(v.metodoTrabalho || "");
    setEditAcessibilidadesSelecionadas(
      v.acessibilidades?.map((a) => a.acessibilidadeId) || []
    );
    setEditSubtiposSelecionados(
      v.subtiposAceitos?.map((s) => s.subtipoId) || []
    );
  }

  async function salvarEdicao(e: React.FormEvent) {
    e.preventDefault();
    if (!editingId || !empresa) return;

    if (!editEscolaridade) {
      show("Informe a escolaridade da vaga.", "error");
      return;
    }
    if (editAcessibilidadesSelecionadas.length === 0) {
      show("Selecione ao menos uma acessibilidade oferecida.", "error");
      return;
    }
    try {
      await apiFetch(`/vagas/${editingId}`, {
        method: "PUT",
        body: JSON.stringify({
          titulo: editTitulo,
          descricao: editDescricao,
          escolaridade: editEscolaridade,
          faixaSalarial: editFaixaSalarial || undefined,
          metodoTrabalho: editMetodoTrabalho || undefined,
          acessibilidadeIds: editAcessibilidadesSelecionadas,
          subtipoIds: editSubtiposSelecionados,
        }),
        authToken: token,
      });
      const detalhe = await apiFetch<Empresa>(`/empresas/${empresa.id}`);
      setEmpresa(detalhe);
      setEditingId(null);
      show("Vaga atualizada com sucesso!", "success");
    } catch (err) {
      show(
        err instanceof Error ? err.message : "Erro ao atualizar vaga",
        "error"
      );
    }
  }

  async function excluirVaga(id: number) {
    if (!empresa) return;
    const ok = confirm("Excluir esta vaga?");
    if (!ok) return;
    try {
      await apiFetch(`/vagas/${id}`, { method: "DELETE", authToken: token });
      const detalhe = await apiFetch<Empresa>(`/empresas/${empresa.id}`);
      setEmpresa(detalhe);
      show("Vaga excluída com sucesso!", "success");
    } catch (err) {
      show(
        err instanceof Error ? err.message : "Erro ao excluir vaga",
        "error"
      );
    }
  }

  // Evita mismatch de hidratação entre SSR e cliente
  if (!mounted) return <p>Carregando...</p>;
  if (!auth || auth.usuario.tipo !== "EMPRESA") {
    return <p>Faça login como Empresa para acessar o painel.</p>;
  }
  if (loading) return <p>Carregando...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!empresa) return <p>Nenhuma empresa vinculada ao seu usuário.</p>;

  return (
    <RequireAuth role="EMPRESA">
      <div className="space-y-8">
        <section>
          <h1 className="text-2xl font-semibold text-zinc-900">
            Painel da Empresa
          </h1>
          <p className="text-sm text-zinc-600">{empresa.nomeFantasia}</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">Minhas Vagas</h2>
          <div className="space-y-2">
            {empresa.vagas?.map((v) => (
              <div
                key={v.id}
                className="rounded-lg border border-zinc-200 bg-white p-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="font-medium text-zinc-900 break-words">
                    {v.titulo}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      href={`/empresa/vagas/${v.id}`}
                      className="rounded-md bg-[#755fe3] px-3 py-1.5 text-sm text-white hover:opacity-95 font-medium"
                    >
                      Candidatos
                    </Link>
                    <button
                      onClick={() => iniciarEdicao(v)}
                      className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm hover:bg-zinc-50 font-medium"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => excluirVaga(v.id)}
                      className="rounded-md bg-red-600 px-3 py-1.5 text-sm text-white hover:opacity-95 font-medium"
                    >
                      Excluir
                    </button>
                  </div>
                </div>

                {editingId === v.id && (
                  <form onSubmit={salvarEdicao} className="mt-3 space-y-2">
                    <input
                      className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
                      placeholder="Título"
                      value={editTitulo}
                      onChange={(e) => setEditTitulo(e.target.value)}
                    />
                    <textarea
                      className="w-full rounded-md border border-zinc-300 p-2 text-sm"
                      rows={4}
                      placeholder="Descrição"
                      value={editDescricao}
                      onChange={(e) => setEditDescricao(e.target.value)}
                    />
                    <select
                      className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm bg-white"
                      value={editEscolaridade}
                      onChange={(e) => setEditEscolaridade(e.target.value)}
                    >
                      <option value="">Escolaridade (opcional)</option>
                      <option value="Ensino Fundamental Incompleto">
                        Ensino Fundamental Incompleto
                      </option>
                      <option value="Ensino Fundamental Completo">
                        Ensino Fundamental Completo
                      </option>
                      <option value="Ensino Médio Incompleto">
                        Ensino Médio Incompleto
                      </option>
                      <option value="Ensino Médio Completo">
                        Ensino Médio Completo
                      </option>
                      <option value="Ensino Superior Incompleto">
                        Ensino Superior Incompleto
                      </option>
                      <option value="Ensino Superior Completo">
                        Ensino Superior Completo
                      </option>
                    </select>
                    <input
                      className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
                      placeholder="Ex: R$ 2.000,00 - R$ 3.500,00"
                      inputMode="numeric"
                      pattern="[0-9R$.,\-\s]*"
                      value={editFaixaSalarial}
                      onChange={(e) =>
                        setEditFaixaSalarial(formatFaixaMasked(e.target.value))
                      }
                    />
                    <select
                      className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm bg-white"
                      value={editMetodoTrabalho}
                      onChange={(e) => setEditMetodoTrabalho(e.target.value)}
                    >
                      <option value="">Método de Trabalho (opcional)</option>
                      <option value="Remoto">Remoto</option>
                      <option value="Presencial">Presencial</option>
                      <option value="Híbrido">Híbrido</option>
                    </select>
                    <div className="border border-zinc-300 rounded-md bg-white p-3 max-h-40 overflow-y-auto">
                      <p className="text-xs font-medium text-zinc-700 mb-2">
                        Subtipos aceitos:
                      </p>
                      {tipos.length === 0 ? (
                        <p className="text-xs text-zinc-500">Carregando...</p>
                      ) : (
                        <div className="space-y-2">
                          {tipos.map((tipo) => (
                            <div key={tipo.id} className="space-y-1">
                              <p className="font-medium text-zinc-800 text-xs">
                                {tipo.nome}
                              </p>
                              <div className="pl-2 space-y-0.5">
                                {(
                                  (tipo.subtipos && tipo.subtipos.length > 0
                                    ? tipo.subtipos
                                    : []) || []
                                ).map((subtipo) => (
                                  <label
                                    key={subtipo.id}
                                    className="flex items-center gap-2 cursor-pointer hover:bg-zinc-50 px-1 py-0.5 rounded text-xs"
                                  >
                                    <input
                                      type="checkbox"
                                      checked={editSubtiposSelecionados.includes(
                                        subtipo.id
                                      )}
                                      onChange={(e) => {
                                        if (e.target.checked) {
                                          setEditSubtiposSelecionados([
                                            ...editSubtiposSelecionados,
                                            subtipo.id,
                                          ]);
                                        } else {
                                          setEditSubtiposSelecionados(
                                            editSubtiposSelecionados.filter(
                                              (id) => id !== subtipo.id
                                            )
                                          );
                                        }
                                      }}
                                      className="w-3 h-3 text-[#755fe3] border-zinc-300 rounded focus:ring-[#755fe3]"
                                    />
                                    <span className="text-zinc-900">
                                      {subtipo.nome}
                                    </span>
                                  </label>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="border border-zinc-300 rounded-md bg-white p-3 max-h-32 overflow-y-auto">
                      <p className="text-xs font-medium text-zinc-700 mb-2">
                        Acessibilidades oferecidas:
                      </p>
                      {acessibilidades.length === 0 ? (
                        <p className="text-xs text-zinc-500">Carregando...</p>
                      ) : (
                        <div className="space-y-1">
                          {acessibilidades.map((acessibilidade) => (
                            <label
                              key={acessibilidade.id}
                              className="flex items-center gap-2 cursor-pointer hover:bg-zinc-50 p-1 rounded text-xs"
                            >
                              <input
                                type="checkbox"
                                checked={editAcessibilidadesSelecionadas.includes(
                                  acessibilidade.id
                                )}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setEditAcessibilidadesSelecionadas([
                                      ...editAcessibilidadesSelecionadas,
                                      acessibilidade.id,
                                    ]);
                                  } else {
                                    setEditAcessibilidadesSelecionadas(
                                      editAcessibilidadesSelecionadas.filter(
                                        (id) => id !== acessibilidade.id
                                      )
                                    );
                                  }
                                }}
                                className="w-3 h-3 text-[#755fe3] border-zinc-300 rounded focus:ring-[#755fe3]"
                              />
                              <span className="text-zinc-900">
                                {acessibilidade.descricao}
                              </span>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                      <button className="rounded-md bg-emerald-600 px-4 py-2 text-sm text-white hover:opacity-95 font-medium">
                        Salvar
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="rounded-md border border-zinc-300 px-4 py-2 text-sm hover:bg-zinc-50 font-medium"
                      >
                        Cancelar
                      </button>
                    </div>
                  </form>
                )}
              </div>
            ))}
            {(!empresa.vagas || empresa.vagas.length === 0) && (
              <p className="text-zinc-600">Nenhuma vaga cadastrada.</p>
            )}
          </div>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-zinc-900">
            Criar nova vaga
          </h2>
          <form onSubmit={criarVaga} className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-zinc-800">
                Título
              </label>
              <input
                className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
                required
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-800">
                Descrição
              </label>
              <textarea
                className="mt-1 w-full rounded-md border border-zinc-300 p-2 text-sm"
                rows={5}
                required
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-zinc-800">
                  Escolaridade
                </label>
                <select
                  className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm"
                  required
                  value={escolaridade}
                  onChange={(e) => setEscolaridade(e.target.value)}
                >
                  <option value="">Selecione...</option>
                  <option value="Ensino Fundamental Incompleto">
                    Ensino Fundamental Incompleto
                  </option>
                  <option value="Ensino Fundamental Completo">
                    Ensino Fundamental Completo
                  </option>
                  <option value="Ensino Médio Incompleto">
                    Ensino Médio Incompleto
                  </option>
                  <option value="Ensino Médio Completo">
                    Ensino Médio Completo
                  </option>
                  <option value="Ensino Superior Incompleto">
                    Ensino Superior Incompleto
                  </option>
                  <option value="Ensino Superior Completo">
                    Ensino Superior Completo
                  </option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-800">
                  Faixa Salarial (opcional)
                </label>
                <input
                  className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
                  placeholder="Ex: R$ 2.000,00 - R$ 3.500,00"
                  inputMode="numeric"
                  pattern="[0-9R$.,\-\s]*"
                  value={faixaSalarial}
                  onChange={(e) =>
                    setFaixaSalarial(formatFaixaMasked(e.target.value))
                  }
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-800">
                Método de Trabalho (opcional)
              </label>
              <select
                className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm"
                value={metodoTrabalho}
                onChange={(e) => setMetodoTrabalho(e.target.value)}
              >
                <option value="">Selecione...</option>
                <option value="Remoto">Remoto</option>
                <option value="Presencial">Presencial</option>
                <option value="Híbrido">Híbrido</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-800 mb-2">
                Tipos de Deficiência Aceitos (opcional)
              </label>
              <div className="border border-zinc-300 rounded-md bg-white p-3 max-h-48 overflow-y-auto">
                {tipos.length === 0 ? (
                  <p className="text-sm text-zinc-500">Carregando tipos...</p>
                ) : (
                  <div className="space-y-3">
                    {tipos.map((tipo) => (
                      <div key={tipo.id} className="space-y-1.5">
                        <p className="font-medium text-zinc-900 text-xs">
                          {tipo.nome}
                        </p>
                        <div className="pl-3 space-y-1">
                          {(
                            (tipo.subtipos && tipo.subtipos.length > 0
                              ? tipo.subtipos
                              : []) || []
                          ).map((subtipo) => (
                            <label
                              key={subtipo.id}
                              className="flex items-center gap-2 cursor-pointer hover:bg-zinc-50 px-2 py-1 rounded"
                            >
                              <input
                                type="checkbox"
                                checked={subtiposSelecionados.includes(
                                  subtipo.id
                                )}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSubtiposSelecionados([
                                      ...subtiposSelecionados,
                                      subtipo.id,
                                    ]);
                                  } else {
                                    setSubtiposSelecionados(
                                      subtiposSelecionados.filter(
                                        (id) => id !== subtipo.id
                                      )
                                    );
                                  }
                                }}
                                className="w-3.5 h-3.5 text-[#755fe3] border-zinc-300 rounded focus:ring-[#755fe3]"
                              />
                              <span className="text-xs text-zinc-900">
                                {subtipo.nome}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {subtiposSelecionados.length > 0 && (
                <p className="mt-1 text-xs text-[#755fe3]">
                  {subtiposSelecionados.length} subtipo(s) selecionado(s)
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-800 mb-2">
                Acessibilidades Oferecidas
              </label>
              <div className="border border-zinc-300 rounded-md bg-white p-3 max-h-40 overflow-y-auto">
                {acessibilidades.length === 0 ? (
                  <p className="text-sm text-zinc-500">
                    Carregando acessibilidades...
                  </p>
                ) : (
                  <div className="space-y-2">
                    {acessibilidades.map((acessibilidade) => (
                      <label
                        key={acessibilidade.id}
                        className="flex items-center gap-2 cursor-pointer hover:bg-zinc-50 p-2 rounded"
                      >
                        <input
                          type="checkbox"
                          checked={acessibilidadesSelecionadas.includes(
                            acessibilidade.id
                          )}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setAcessibilidadesSelecionadas([
                                ...acessibilidadesSelecionadas,
                                acessibilidade.id,
                              ]);
                            } else {
                              setAcessibilidadesSelecionadas(
                                acessibilidadesSelecionadas.filter(
                                  (id) => id !== acessibilidade.id
                                )
                              );
                            }
                          }}
                          className="w-4 h-4 text-[#755fe3] border-zinc-300 rounded focus:ring-[#755fe3]"
                        />
                        <span className="text-sm text-zinc-900">
                          {acessibilidade.descricao}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
              {acessibilidadesSelecionadas.length > 0 && (
                <p className="mt-1 text-xs text-[#755fe3]">
                  {acessibilidadesSelecionadas.length} acessibilidade(s)
                  selecionada(s)
                </p>
              )}
            </div>
            <button
              disabled={creating}
              className="rounded-md bg-[#755fe3] px-4 py-2 text-white hover:opacity-95 disabled:opacity-60"
            >
              {creating ? "Criando..." : "Criar vaga"}
            </button>
          </form>
        </section>
      </div>
    </RequireAuth>
  );
}
