"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiFetch } from "../../lib/api";

type Empresa = { id: number; nomeFantasia: string };

type Vaga = {
  id: number;
  titulo: string;
  descricao: string;
  escolaridade?: string | null;
  empresa: Empresa;
};

export default function VagasPage() {
  const [vagas, setVagas] = useState<Vaga[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await apiFetch<{ data: Vaga[] }>("/vagas");
        setVagas(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao carregar vagas");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <p>Carregando vagas...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div>
      <h1 className="mb-4 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
        Vagas
      </h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {vagas.map((vaga) => (
          <Link
            key={vaga.id}
            href={`/vagas/${vaga.id}`}
            className="block rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-4 hover:bg-zinc-50 dark:hover:bg-zinc-700"
          >
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              {vaga.titulo}
            </h2>
            <p className="mt-1 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">
              {vaga.descricao}
            </p>
            <div className="mt-2 flex items-center justify-between text-sm text-zinc-700 dark:text-zinc-300">
              <span>{vaga.empresa?.nomeFantasia ?? "Empresa"}</span>
              {vaga.escolaridade && (
                <span className="rounded bg-zinc-100 dark:bg-zinc-700 px-2 py-0.5">
                  {vaga.escolaridade}
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
