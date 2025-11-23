"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAuth } from "@/lib/auth";
import { apiFetch } from "@/lib/api";
import { useToast } from "@/components/Toaster";
import RequireAuth from "@/components/RequireAuth";

interface Barreira {
  id: number;
  descricao: string;
}

export default function BarreirasAdminPage() {
  const router = useRouter();
  const { show } = useToast();
  const [barreiras, setBarreiras] = useState<Barreira[]>([]);
  const [loading, setLoading] = useState(true);
  const [novaDescricao, setNovaDescricao] = useState("");
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [editandoDescricao, setEditandoDescricao] = useState("");
  const [criando, setCriando] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    if (!auth?.token) {
      router.push("/login");
      return;
    }

    fetchBarreiras();
  }, [router]);

  async function fetchBarreiras() {
    try {
      const response = await apiFetch<{ data: Barreira[] }>("/barreiras");
      setBarreiras(response.data);
    } catch (error) {
      show("Erro ao carregar barreiras", "error");
    } finally {
      setLoading(false);
    }
  }

  async function handleCriar() {
    if (!novaDescricao.trim()) {
      show("Descrição é obrigatória", "error");
      return;
    }

    setCriando(true);
    try {
      const auth = getAuth();
      await apiFetch("/barreiras", {
        method: "POST",
        body: JSON.stringify({ descricao: novaDescricao.trim() }),
        authToken: auth?.token,
      });

      show("Barreira criada com sucesso!", "success");
      setNovaDescricao("");
      fetchBarreiras();
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      show(error.message || "Erro ao criar barreira", "error");
    } finally {
      setCriando(false);
    }
  }

  async function handleAtualizar(id: number) {
    if (!editandoDescricao.trim()) {
      show("Descrição é obrigatória", "error");
      return;
    }

    try {
      const auth = getAuth();
      await apiFetch(`/barreiras/${id}`, {
        method: "PUT",
        body: JSON.stringify({ descricao: editandoDescricao.trim() }),
        authToken: auth?.token,
      });

      show("Barreira atualizada com sucesso!", "success");
      setEditandoId(null);
      setEditandoDescricao("");
      fetchBarreiras();
    } catch (error: any) {
      show(error.message || "Erro ao atualizar barreira", "error");
    }
  }

  async function handleDeletar(id: number, descricao: string) {
    if (!confirm(`Tem certeza que deseja deletar a barreira "${descricao}"?`)) {
      return;
    }

    try {
      const auth = getAuth();
      await apiFetch(`/barreiras/${id}`, {
        method: "DELETE",
        authToken: auth?.token,
      });

      show("Barreira deletada com sucesso!", "success");
      fetchBarreiras();
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      show(error.message || "Erro ao deletar barreira", "error");
    }
  }

  function iniciarEdicao(barreira: Barreira) {
    setEditandoId(barreira.id);
    setEditandoDescricao(barreira.descricao);
  }

  function cancelarEdicao() {
    setEditandoId(null);
    setEditandoDescricao("");
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#755fe3] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-zinc-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <RequireAuth>
      <div className="min-h-screen bg-zinc-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-zinc-900">
              Gerenciar Barreiras
            </h1>
            <p className="text-zinc-600 mt-2">
              Crie, edite ou remova barreiras de acessibilidade
            </p>
          </div>

          {/* Formulário de Criação */}
          <div className="bg-white rounded-lg shadow-sm border border-zinc-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-zinc-900 mb-4">
              Nova Barreira
            </h2>
            <div className="flex gap-3">
              <input
                type="text"
                value={novaDescricao}
                onChange={(e) => setNovaDescricao(e.target.value)}
                placeholder="Descrição da barreira"
                className="flex-1 px-4 py-2 border border-zinc-300 rounded-md focus:ring-2 focus:ring-[#755fe3] focus:border-transparent"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !criando) {
                    handleCriar();
                  }
                }}
              />
              <button
                onClick={handleCriar}
                disabled={criando || !novaDescricao.trim()}
                className="px-6 py-2 bg-[#755fe3] text-white rounded-md hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {criando ? "Criando..." : "Criar"}
              </button>
            </div>
          </div>

          {/* Lista de Barreiras */}
          <div className="bg-white rounded-lg shadow-sm border border-zinc-200">
            <div className="p-6 border-b border-zinc-200">
              <h2 className="text-lg font-semibold text-zinc-900">
                Barreiras Cadastradas ({barreiras.length})
              </h2>
            </div>

            {barreiras.length === 0 ? (
              <div className="p-8 text-center text-zinc-500">
                Nenhuma barreira cadastrada ainda
              </div>
            ) : (
              <div className="divide-y divide-zinc-200">
                {barreiras.map((barreira) => (
                  <div
                    key={barreira.id}
                    className="p-4 hover:bg-zinc-50 transition-colors"
                  >
                    {editandoId === barreira.id ? (
                      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                        <input
                          type="text"
                          value={editandoDescricao}
                          onChange={(e) => setEditandoDescricao(e.target.value)}
                          className="flex-1 px-4 py-2 border border-zinc-300 rounded-md focus:ring-2 focus:ring-[#755fe3] focus:border-transparent"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleAtualizar(barreira.id);
                            } else if (e.key === "Escape") {
                              cancelarEdicao();
                            }
                          }}
                          autoFocus
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAtualizar(barreira.id)}
                            className="flex-1 sm:flex-none px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium"
                          >
                            Salvar
                          </button>
                          <button
                            onClick={cancelarEdicao}
                            className="flex-1 sm:flex-none px-4 py-2 bg-zinc-300 text-zinc-700 rounded-md hover:bg-zinc-400 font-medium"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-zinc-900 font-medium wrap-break-word">
                            {barreira.descricao}
                          </p>
                          <p className="text-xs text-zinc-500 mt-1">
                            ID: {barreira.id}
                          </p>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <button
                            onClick={() => iniciarEdicao(barreira)}
                            className="flex-1 sm:flex-none px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() =>
                              handleDeletar(barreira.id, barreira.descricao)
                            }
                            className="flex-1 sm:flex-none px-3 py-1.5 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 font-medium"
                          >
                            Deletar
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </RequireAuth>
  );
}
