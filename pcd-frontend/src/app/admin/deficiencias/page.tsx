"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "../../../lib/api";
import { getAuth } from "../../../lib/auth";
import RequireAuth from "../../../components/RequireAuth";
import { useToast } from "../../../components/Toaster";
import Link from "next/link";

type Subtipo = {
  id: number;
  nome: string;
  tipoId: number;
};

type Tipo = {
  id: number;
  nome: string;
  subtipos: Subtipo[];
};

export default function DeficienciasAdminPage() {
  const { show } = useToast();
  const [mounted, setMounted] = useState(false);
  const [auth, setAuth] = useState<ReturnType<typeof getAuth> | null>(null);
  const token = auth?.token;

  const [tipos, setTipos] = useState<Tipo[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedTipos, setExpandedTipos] = useState<Set<number>>(new Set());

  // Modais
  const [showTipoModal, setShowTipoModal] = useState(false);
  const [showSubtipoModal, setShowSubtipoModal] = useState(false);
  const [editingTipo, setEditingTipo] = useState<Tipo | null>(null);
  const [editingSubtipo, setEditingSubtipo] = useState<Subtipo | null>(null);
  const [tipoParentId, setTipoParentId] = useState<number | null>(null);

  // Form states
  const [tipoNome, setTipoNome] = useState("");
  const [subtipoNome, setSubtipoNome] = useState("");

  // Confirmação de exclusão
  const [deleteConfirm, setDeleteConfirm] = useState<{
    type: "tipo" | "subtipo";
    id: number;
    nome: string;
  } | null>(null);

  useEffect(() => {
    setMounted(true);
    setAuth(getAuth());
  }, []);

  useEffect(() => {
    if (!token) return;
    carregarTipos();
  }, [token]);

  async function carregarTipos() {
    try {
      setLoading(true);
      const res = await apiFetch<{ data: Tipo[] }>("/tipos");
      setTipos(res.data);
    } catch (err) {
      show(
        err instanceof Error ? err.message : "Erro ao carregar tipos",
        "error"
      );
    } finally {
      setLoading(false);
    }
  }

  function toggleTipo(id: number) {
    setExpandedTipos((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  // TIPO: Criar/Editar
  function abrirModalTipo(tipo?: Tipo) {
    if (tipo) {
      setEditingTipo(tipo);
      setTipoNome(tipo.nome);
    } else {
      setEditingTipo(null);
      setTipoNome("");
    }
    setShowTipoModal(true);
  }

  async function salvarTipo() {
    if (!tipoNome.trim()) {
      show("Nome do tipo é obrigatório", "error");
      return;
    }

    try {
      if (editingTipo) {
        await apiFetch(`/tipos/${editingTipo.id}`, {
          method: "PUT",
          body: JSON.stringify({ nome: tipoNome }),
          authToken: token,
        });
        show("Tipo atualizado com sucesso!", "success");
      } else {
        await apiFetch("/tipos", {
          method: "POST",
          body: JSON.stringify({ nome: tipoNome }),
          authToken: token,
        });
        show("Tipo criado com sucesso!", "success");
      }
      setShowTipoModal(false);
      carregarTipos();
    } catch (err) {
      show(err instanceof Error ? err.message : "Erro ao salvar tipo", "error");
    }
  }

  // SUBTIPO: Criar/Editar
  function abrirModalSubtipo(tipoId: number, subtipo?: Subtipo) {
    setTipoParentId(tipoId);
    if (subtipo) {
      setEditingSubtipo(subtipo);
      setSubtipoNome(subtipo.nome);
    } else {
      setEditingSubtipo(null);
      setSubtipoNome("");
    }
    setShowSubtipoModal(true);
  }

  async function salvarSubtipo() {
    if (!subtipoNome.trim()) {
      show("Nome do subtipo é obrigatório", "error");
      return;
    }
    if (!tipoParentId) {
      show("Tipo pai não identificado", "error");
      return;
    }

    try {
      if (editingSubtipo) {
        await apiFetch(`/subtipos/${editingSubtipo.id}`, {
          method: "PUT",
          body: JSON.stringify({ nome: subtipoNome, tipoId: tipoParentId }),
          authToken: token,
        });
        show("Subtipo atualizado com sucesso!", "success");
      } else {
        await apiFetch("/subtipos", {
          method: "POST",
          body: JSON.stringify({ nome: subtipoNome, tipoId: tipoParentId }),
          authToken: token,
        });
        show("Subtipo criado com sucesso!", "success");
      }
      setShowSubtipoModal(false);
      carregarTipos();
    } catch (err) {
      show(
        err instanceof Error ? err.message : "Erro ao salvar subtipo",
        "error"
      );
    }
  }

  // EXCLUSÃO
  async function confirmarExclusao() {
    if (!deleteConfirm) return;

    try {
      if (deleteConfirm.type === "tipo") {
        await apiFetch(`/tipos/${deleteConfirm.id}`, {
          method: "DELETE",
          authToken: token,
        });
        show("Tipo excluído com sucesso!", "success");
      } else {
        await apiFetch(`/subtipos/${deleteConfirm.id}`, {
          method: "DELETE",
          authToken: token,
        });
        show("Subtipo excluído com sucesso!", "success");
      }
      setDeleteConfirm(null);
      carregarTipos();
    } catch (err) {
      show(err instanceof Error ? err.message : "Erro ao excluir", "error");
    }
  }

  if (!mounted) return null;
  if (!token) return <p>Faça login para acessar esta página.</p>;

  return (
    <RequireAuth role="DESENVOLVEDOR">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-zinc-900">
              Gerenciar Tipos de Deficiência
            </h1>
            <p className="text-sm text-zinc-600 mt-1">
              Crie, edite e exclua tipos e subtipos de deficiência
            </p>
          </div>
          <Link
            href="/admin"
            className="px-4 py-2 text-sm text-zinc-700 hover:text-zinc-900 underline"
          >
            ← Voltar ao Admin
          </Link>
        </div>

        <button
          onClick={() => abrirModalTipo()}
          className="px-4 py-2 bg-[#755fe3] text-white rounded-md hover:opacity-90 text-sm font-medium"
        >
          + Novo Tipo
        </button>

        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block w-6 h-6 border-2 border-[#755fe3] border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-2 text-sm text-zinc-600">Carregando...</p>
          </div>
        ) : tipos.length === 0 ? (
          <div className="bg-white border border-zinc-200 rounded-lg p-8 text-center">
            <p className="text-zinc-600">Nenhum tipo cadastrado ainda.</p>
            <p className="text-sm text-zinc-500 mt-1">
              Clique em "Novo Tipo" para começar.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {tipos.map((tipo) => {
              const isExpanded = expandedTipos.has(tipo.id);
              return (
                <div
                  key={tipo.id}
                  className="bg-white border border-zinc-200 rounded-lg overflow-hidden"
                >
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => toggleTipo(tipo.id)}
                        className="text-zinc-500 hover:text-zinc-700 focus:outline-none"
                      >
                        <svg
                          className={`w-5 h-5 transition-transform ${
                            isExpanded ? "rotate-90" : ""
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>
                      <div>
                        <h3 className="text-lg font-medium text-zinc-900">
                          {tipo.nome}
                        </h3>
                        <p className="text-xs text-zinc-500">
                          {tipo.subtipos.length} subtipo
                          {tipo.subtipos.length !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => abrirModalTipo(tipo)}
                        className="px-3 py-1.5 text-sm text-[#755fe3] hover:bg-[#755fe3]/10 rounded-md transition-colors"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() =>
                          setDeleteConfirm({
                            type: "tipo",
                            id: tipo.id,
                            nome: tipo.nome,
                          })
                        }
                        className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      >
                        Excluir
                      </button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="border-t border-zinc-200 bg-zinc-50 p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-medium text-zinc-700">
                          Subtipos
                        </h4>
                        <button
                          onClick={() => abrirModalSubtipo(tipo.id)}
                          className="px-3 py-1 text-xs bg-white border border-zinc-300 text-zinc-700 rounded hover:bg-zinc-100 transition-colors"
                        >
                          + Adicionar Subtipo
                        </button>
                      </div>

                      {tipo.subtipos.length === 0 ? (
                        <p className="text-sm text-zinc-500 italic">
                          Nenhum subtipo cadastrado.
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {tipo.subtipos.map((subtipo) => (
                            <div
                              key={subtipo.id}
                              className="bg-white border border-zinc-200 rounded-md p-3 flex items-center justify-between"
                            >
                              <span className="text-sm text-zinc-900">
                                {subtipo.nome}
                              </span>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() =>
                                    abrirModalSubtipo(tipo.id, subtipo)
                                  }
                                  className="px-2 py-1 text-xs text-[#755fe3] hover:bg-[#755fe3]/10 rounded transition-colors"
                                >
                                  Editar
                                </button>
                                <button
                                  onClick={() =>
                                    setDeleteConfirm({
                                      type: "subtipo",
                                      id: subtipo.id,
                                      nome: subtipo.nome,
                                    })
                                  }
                                  className="px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded transition-colors"
                                >
                                  Excluir
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Modal Tipo */}
        {showTipoModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <h2 className="text-xl font-semibold text-zinc-900 mb-4">
                {editingTipo ? "Editar Tipo" : "Novo Tipo"}
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1">
                    Nome do Tipo
                  </label>
                  <input
                    type="text"
                    value={tipoNome}
                    onChange={(e) => setTipoNome(e.target.value)}
                    placeholder="Ex: Deficiência Intelectual"
                    className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:ring-1 focus:ring-[#755fe3] focus:border-[#755fe3]"
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => setShowTipoModal(false)}
                    className="px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-100 rounded-md transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={salvarTipo}
                    className="px-4 py-2 text-sm bg-[#755fe3] text-white rounded-md hover:opacity-90 transition-opacity"
                  >
                    {editingTipo ? "Salvar" : "Criar"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal Subtipo */}
        {showSubtipoModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <h2 className="text-xl font-semibold text-zinc-900 mb-4">
                {editingSubtipo ? "Editar Subtipo" : "Novo Subtipo"}
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1">
                    Nome do Subtipo
                  </label>
                  <input
                    type="text"
                    value={subtipoNome}
                    onChange={(e) => setSubtipoNome(e.target.value)}
                    placeholder="Ex: Paraplegia T10"
                    className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:ring-1 focus:ring-[#755fe3] focus:border-[#755fe3]"
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => setShowSubtipoModal(false)}
                    className="px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-100 rounded-md transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={salvarSubtipo}
                    className="px-4 py-2 text-sm bg-[#755fe3] text-white rounded-md hover:opacity-90 transition-opacity"
                  >
                    {editingSubtipo ? "Salvar" : "Criar"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal Confirmação de Exclusão */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <h2 className="text-xl font-semibold text-zinc-900 mb-2">
                Confirmar Exclusão
              </h2>
              <p className="text-sm text-zinc-700 mb-4">
                Tem certeza que deseja excluir{" "}
                <strong>&quot;{deleteConfirm.nome}&quot;</strong>?
              </p>
              {deleteConfirm.type === "tipo" && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-4">
                  <p className="text-xs text-yellow-800">
                    ⚠️ Esta ação excluirá também todos os subtipos associados e
                    removerá referências em vagas e PCDs cadastrados.
                  </p>
                </div>
              )}
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-100 rounded-md transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmarExclusao}
                  className="px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  Excluir
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </RequireAuth>
  );
}
