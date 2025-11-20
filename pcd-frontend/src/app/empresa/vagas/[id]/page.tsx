"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { apiFetch } from "../../../../lib/api";
import { getAuth } from "../../../../lib/auth";

type Pcd = { id: number; nome: string; email: string };

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
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro ao atualizar status");
    }
  }

  if (!token) return <p>Faça login para ver as candidaturas.</p>;
  if (loading) return <p>Carregando...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-zinc-900">
        Candidaturas da Vaga #{vagaId}
      </h1>
      <div className="space-y-3">
        {list.map((c) => (
          <div
            key={c.id}
            className="rounded-lg border border-zinc-200 bg-white p-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-sm text-zinc-600">Candidato</p>
                <p className="text-zinc-900">{c.pcd?.nome ?? "PCD"}</p>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="rounded bg-zinc-100 px-2 py-0.5">
                  {c.status}
                </span>
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
              </div>
            </div>
          </div>
        ))}
        {list.length === 0 && (
          <p className="text-zinc-600">Nenhuma candidatura para esta vaga.</p>
        )}
      </div>
    </div>
  );
}
