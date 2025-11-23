"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { apiFetch } from "../../../../lib/api";
import { getAuth } from "../../../../lib/auth";
import { useToast } from "../../../../components/Toaster";

type Barreira = { id: number; nome: string };

type Deficiencia = {
  id: number;
  nome: string;
  subtipos?: Array<{ id: number; nome: string }>;
};

type Pcd = {
  id: number;
  nome: string;
  email: string;
  telefone?: string;
  escolaridade?: string;
  deficiencias?: Deficiencia[];
  barreirasPcd?: Array<{ barreira: Barreira }>;
};

type Candidatura = {
  id: number;
  status: "ENVIADA" | "ACEITA" | "REJEITADA";
  pcd: Pcd;
};

export default function CandidaturasVagaPage() {
  const { id } = useParams<{ id: string }>();
  const vagaId = Number(id);
  const auth = getAuth();
  const token = auth?.token;

  const [list, setList] = useState<Candidatura[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedPcdId, setExpandedPcdId] = useState<number | null>(null);
  const [pcdDetails, setPcdDetails] = useState<Record<number, Pcd>>({});
  const { show } = useToast();

  async function carregar() {
    if (!token) return;
    try {
      const data = await apiFetch<Candidatura[]>(
        `/candidaturas/vaga/${vagaId}`,
        { authToken: token }
      );
      setList(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao carregar candidaturas"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, vagaId]);

  async function setStatus(
    candidaturaId: number,
    status: Candidatura["status"]
  ) {
    if (!token) return;
    try {
      await apiFetch(`/candidaturas/${candidaturaId}/status`, {
        method: "PATCH",
        authToken: token,
        body: JSON.stringify({ status }),
      });
      await carregar();
      show("Status atualizado com sucesso!", "success");
    } catch (err) {
      show(
        err instanceof Error ? err.message : "Erro ao atualizar status",
        "error"
      );
    }
  }

  async function togglePcdDetails(pcdId: number) {
    if (expandedPcdId === pcdId) {
      setExpandedPcdId(null);
      return;
    }

    // Se já carregamos os detalhes, apenas expande
    if (pcdDetails[pcdId]) {
      setExpandedPcdId(pcdId);
      return;
    }

    // Buscar detalhes do PCD
    if (!token) return;
    try {
      const details = await apiFetch<{ data: Pcd }>(`/pcd/${pcdId}`, {
        authToken: token,
      });
      setPcdDetails((prev) => ({ ...prev, [pcdId]: details.data }));
      setExpandedPcdId(pcdId);
    } catch (err) {
      show(
        err instanceof Error ? err.message : "Erro ao carregar detalhes do PCD",
        "error"
      );
    }
  }

  if (!token) return <p className="">Faça login para ver as candidaturas.</p>;
  if (loading) return <p className="">Carregando...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-zinc-900">
        Candidaturas da Vaga #{vagaId}
      </h1>
      <div className="space-y-3">
        {list.map((c) => {
          const details = pcdDetails[c.pcd.id];
          const isExpanded = expandedPcdId === c.pcd.id;

          return (
            <div
              key={c.id}
              className="rounded-lg border border-zinc-200 bg-white p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-sm text-zinc-600">Candidato</p>
                  <p className="text-lg font-semibold text-zinc-900">
                    {c.pcd?.nome ?? "PCD"}
                  </p>
                  <p className="text-sm text-zinc-600">{c.pcd?.email}</p>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span
                    className={`rounded px-2 py-0.5 font-medium ${
                      c.status === "ACEITA"
                        ? "bg-green-100 text-green-800"
                        : c.status === "REJEITADA"
                        ? "bg-red-100 text-red-800"
                        : "bg-zinc-100 text-zinc-900"
                    }`}
                  >
                    {c.status}
                  </span>
                  {c.status === "ENVIADA" && (
                    <>
                      <button
                        onClick={() => setStatus(c.id, "ACEITA")}
                        className="rounded-md bg-emerald-600 px-3 py-1 text-white hover:opacity-95"
                      >
                        Aceitar
                      </button>
                      <button
                        onClick={() => setStatus(c.id, "REJEITADA")}
                        className="rounded-md bg-red-600 px-3 py-1 text-white hover:opacity-95"
                      >
                        Rejeitar
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Botão Ver Detalhes */}
              <button
                onClick={() => togglePcdDetails(c.pcd.id)}
                className="mt-3 text-sm text-[#755fe3] hover:underline"
              >
                {isExpanded
                  ? "Ocultar detalhes ▲"
                  : "Ver detalhes do candidato ▼"}
              </button>

              {/* Detalhes expandidos */}
              {isExpanded && details && (
                <div className="mt-4 space-y-3 border-t border-zinc-200 pt-4">
                  {/* Informações básicas */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {details.telefone && (
                      <div>
                        <p className="text-xs font-medium text-zinc-600">
                          Telefone
                        </p>
                        <p className="text-sm text-zinc-900">
                          {details.telefone}
                        </p>
                      </div>
                    )}
                    {details.escolaridade && (
                      <div>
                        <p className="text-xs font-medium text-zinc-600">
                          Escolaridade
                        </p>
                        <p className="text-sm text-zinc-900">
                          {details.escolaridade}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Deficiências */}
                  {details.deficiencias && details.deficiencias.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-zinc-600 mb-2">
                        Deficiências
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {details.deficiencias.map((def) => (
                          <span
                            key={def.id}
                            className="rounded bg-blue-100 text-blue-800 px-2 py-1 text-xs"
                          >
                            {def.nome}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Barreiras de Acessibilidade */}
                  {details.barreirasPcd && details.barreirasPcd.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-zinc-600 mb-2">
                        Barreiras de Acessibilidade
                      </p>
                      <div className="bg-amber-50 border border-amber-200 rounded-md p-3">
                        <p className="text-xs text-amber-800 mb-2">
                          Este candidato enfrenta as seguintes barreiras:
                        </p>
                        <ul className="space-y-1">
                          {details.barreirasPcd.map((b, idx) => (
                            <li
                              key={idx}
                              className="text-sm text-amber-900 flex items-start gap-2"
                            >
                              <span className="text-amber-600">•</span>
                              <span>{b.barreira.nome}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {details.barreirasPcd &&
                    details.barreirasPcd.length === 0 && (
                      <div className="bg-green-50 border border-green-200 rounded-md p-3">
                        <p className="text-xs text-green-800">
                          ✓ Este candidato não possui barreiras de
                          acessibilidade cadastradas.
                        </p>
                      </div>
                    )}
                </div>
              )}
            </div>
          );
        })}
        {list.length === 0 && (
          <p className="text-zinc-600">Nenhuma candidatura para esta vaga.</p>
        )}
      </div>
    </div>
  );
}
