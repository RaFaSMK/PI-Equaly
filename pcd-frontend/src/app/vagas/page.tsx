"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiFetch } from "../../lib/api";
import { getAuth } from "../../lib/auth";

type Empresa = { id: number; nomeFantasia: string };

type Vaga = {
  id: number;
  titulo: string;
  descricao: string;
  escolaridade?: string | null;
  faixaSalarial?: string | null;
  metodoTrabalho?: string | null;
  empresa: Empresa;
  compatibilidade?: number;
  barreirasResolvidas?: number;
  totalBarreiras?: number;
};

export default function VagasPage() {
  const [vagas, setVagas] = useState<Vaga[]>([]);
  const [vagasFiltradas, setVagasFiltradas] = useState<Vaga[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const auth = getAuth();
  const isPcd = auth?.usuario?.tipo === "PCD";
  const pcdId = auth?.pcdId;

  // Filtros
  const [busca, setBusca] = useState("");
  const [filtroEscolaridade, setFiltroEscolaridade] = useState("");
  const [filtroMetodo, setFiltroMetodo] = useState("");
  const [filtroCompatibilidade, setFiltroCompatibilidade] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        // Se for PCD logado, buscar vagas com compatibilidade
        if (isPcd && pcdId) {
          const data = await apiFetch<{ data: Vaga[] }>(
            `/vagas/compativeis?pcdId=${pcdId}`
          );
          setVagas(data.data);
          setVagasFiltradas(data.data);
        } else {
          // Caso contrário, buscar todas as vagas normalmente
          const data = await apiFetch<{ data: Vaga[] }>("/vagas");
          setVagas(data.data);
          setVagasFiltradas(data.data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao carregar vagas");
      } finally {
        setLoading(false);
      }
    })();
  }, [isPcd, pcdId]);

  // Aplicar filtros
  useEffect(() => {
    let resultado = [...vagas];

    // Filtro de busca por palavra-chave
    if (busca.trim()) {
      const termo = busca.toLowerCase();
      resultado = resultado.filter(
        (v) =>
          v.titulo.toLowerCase().includes(termo) ||
          v.descricao.toLowerCase().includes(termo) ||
          v.empresa?.nomeFantasia?.toLowerCase().includes(termo)
      );
    }

    // Filtro de escolaridade
    if (filtroEscolaridade) {
      resultado = resultado.filter(
        (v) => v.escolaridade === filtroEscolaridade
      );
    }

    // Filtro de método de trabalho
    if (filtroMetodo) {
      resultado = resultado.filter((v) => v.metodoTrabalho === filtroMetodo);
    }

    // Filtro de compatibilidade mínima (só para PCDs)
    if (isPcd && filtroCompatibilidade > 0) {
      resultado = resultado.filter(
        (v) => (v.compatibilidade || 0) >= filtroCompatibilidade
      );
    }

    setVagasFiltradas(resultado);
  }, [
    busca,
    filtroEscolaridade,
    filtroMetodo,
    filtroCompatibilidade,
    vagas,
    isPcd,
  ]);

  // Função para determinar cor da barra de compatibilidade
  function getCompatibilityColor(percentage: number): string {
    if (percentage >= 80) return "bg-green-500";
    if (percentage >= 50) return "bg-yellow-500";
    return "bg-red-500";
  }

  // Função para determinar cor do badge
  function getCompatibilityBadgeColor(percentage: number): string {
    if (percentage >= 80) return "bg-green-100 text-green-800";
    if (percentage >= 50) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  }

  if (loading) return <p>Carregando vagas...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div>
      <h1 className="mb-4 text-2xl font-semibold text-zinc-900">
        Vagas Disponíveis
      </h1>
      {isPcd && (
        <p className="mb-4 text-sm text-zinc-600">
          As vagas estão ordenadas por compatibilidade com suas barreiras de
          acessibilidade.
        </p>
      )}

      {/* Filtros */}
      <div className="mb-6 space-y-3">
        <input
          type="text"
          placeholder="Buscar por título, descrição ou empresa..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="w-full rounded-md border border-zinc-300 px-4 py-2 text-sm focus:ring-2 focus:ring-[#755fe3] focus:border-transparent"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <select
            value={filtroEscolaridade}
            onChange={(e) => setFiltroEscolaridade(e.target.value)}
            className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-[#755fe3]"
          >
            <option value="">Todas escolaridades</option>
            <option value="Ensino Fundamental Incompleto">
              Fundamental Incompleto
            </option>
            <option value="Ensino Fundamental Completo">
              Fundamental Completo
            </option>
            <option value="Ensino Médio Incompleto">Médio Incompleto</option>
            <option value="Ensino Médio Completo">Médio Completo</option>
            <option value="Ensino Superior Incompleto">
              Superior Incompleto
            </option>
            <option value="Ensino Superior Completo">Superior Completo</option>
          </select>
          <select
            value={filtroMetodo}
            onChange={(e) => setFiltroMetodo(e.target.value)}
            className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-[#755fe3]"
          >
            <option value="">Todos os métodos</option>
            <option value="Remoto">Remoto</option>
            <option value="Presencial">Presencial</option>
            <option value="Híbrido">Híbrido</option>
          </select>
          {isPcd && (
            <select
              value={filtroCompatibilidade}
              onChange={(e) => setFiltroCompatibilidade(Number(e.target.value))}
              className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-[#755fe3]"
            >
              <option value="0">Qualquer compatibilidade</option>
              <option value="50">Mínimo 50% compatível</option>
              <option value="70">Mínimo 70% compatível</option>
              <option value="90">Mínimo 90% compatível</option>
            </select>
          )}
          {(busca ||
            filtroEscolaridade ||
            filtroMetodo ||
            filtroCompatibilidade > 0) && (
            <button
              onClick={() => {
                setBusca("");
                setFiltroEscolaridade("");
                setFiltroMetodo("");
                setFiltroCompatibilidade(0);
              }}
              className="rounded-md border border-zinc-300 px-3 py-2 text-sm hover:bg-zinc-50 font-medium"
            >
              Limpar filtros
            </button>
          )}
        </div>
        <p className="text-sm text-zinc-600">
          {vagasFiltradas.length} vaga(s) encontrada(s)
          {vagasFiltradas.length !== vagas.length &&
            ` de ${vagas.length} total`}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {vagasFiltradas.map((vaga) => (
          <Link
            key={vaga.id}
            href={`/vagas/${vaga.id}`}
            className="block rounded-lg border border-zinc-200 bg-white p-4 hover:bg-zinc-50 transition-shadow hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-2">
              <h2 className="text-lg font-semibold text-zinc-900">
                {vaga.titulo}
              </h2>
              {isPcd && typeof vaga.compatibilidade === "number" && (
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded ${getCompatibilityBadgeColor(
                    vaga.compatibilidade
                  )}`}
                >
                  {vaga.compatibilidade}%
                </span>
              )}
            </div>

            {/* Barra de compatibilidade */}
            {isPcd && typeof vaga.compatibilidade === "number" && (
              <div className="mt-2">
                <div className="h-2 w-full bg-zinc-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${getCompatibilityColor(
                      vaga.compatibilidade
                    )}`}
                    style={{ width: `${vaga.compatibilidade}%` }}
                  />
                </div>
                <p className="mt-1 text-xs text-zinc-500">
                  {vaga.barreirasResolvidas || 0} de {vaga.totalBarreiras || 0}{" "}
                  barreiras atendidas
                </p>
              </div>
            )}

            <p className="mt-2 line-clamp-2 text-sm text-zinc-600">
              {vaga.descricao}
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-zinc-700 font-medium">
                {vaga.empresa?.nomeFantasia ?? "Empresa"}
              </span>
              {vaga.escolaridade && (
                <span className="rounded bg-zinc-100 px-2 py-0.5 text-zinc-700">
                  {vaga.escolaridade}
                </span>
              )}
              {vaga.metodoTrabalho && (
                <span className="rounded bg-[#755fe3] bg-opacity-10 text-white px-2 py-0.5">
                  {vaga.metodoTrabalho}
                </span>
              )}
              {vaga.faixaSalarial && (
                <span className="rounded bg-emerald-100 text-emerald-700 px-2 py-0.5">
                  {vaga.faixaSalarial}
                </span>
              )}
            </div>
          </Link>
        ))}
        {vagasFiltradas.length === 0 && vagas.length === 0 && (
          <p className="col-span-2 text-center text-zinc-600">
            Nenhuma vaga disponível no momento.
          </p>
        )}
        {vagasFiltradas.length === 0 && vagas.length > 0 && (
          <p className="col-span-2 text-center text-zinc-600">
            Nenhuma vaga encontrada com os filtros aplicados.
          </p>
        )}
      </div>
    </div>
  );
}
