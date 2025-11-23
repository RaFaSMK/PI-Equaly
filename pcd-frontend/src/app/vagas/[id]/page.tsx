"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { apiFetch } from "../../../lib/api";
import { getAuth } from "../../../lib/auth";
import { useToast } from "../../../components/Toaster";
import { Check } from "lucide-react";

type Vaga = {
  id: number;
  titulo: string;
  descricao: string;
  escolaridade?: string | null;
  faixaSalarial?: string | null;
  metodoTrabalho?: string | null;
  empresa?: { id: number; nomeFantasia: string; sobre?: string } | null;
  acessibilidades?: Array<{
    acessibilidade: { id: number; descricao: string };
  }>;
  compatibilidade?: number;
  barreirasResolvidas?: number;
  totalBarreiras?: number;
};

export default function VagaDetalhePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = Number(params.id);
  const [vaga, setVaga] = useState<Vaga | null>(null);
  const [mensagem, setMensagem] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [auth] = useState(() => getAuth());
  const { show } = useToast();

  useEffect(() => {
    (async () => {
      try {
        const data = await apiFetch<{ data: Vaga }>(`/vagas/${id}`);
        setVaga(data.data);

        // Se for PCD, buscar compatibilidade
        if (auth?.usuario?.tipo === "PCD" && auth.pcdId) {
          try {
            const compatData = await apiFetch<{
              compatibilidade: number;
              barreirasResolvidas: number;
              totalBarreiras: number;
            }>(`/vagas/compativeis?pcdId=${auth.pcdId}`);

            // Encontrar compatibilidade desta vaga específica
            const vagasCompativeis = compatData as any;
            const vagaCompativel = vagasCompativeis.data?.find(
              (v: any) => v.id === id
            );

            if (vagaCompativel) {
              setVaga((prev) =>
                prev
                  ? {
                      ...prev,
                      compatibilidade: vagaCompativel.compatibilidade,
                      barreirasResolvidas: vagaCompativel.barreirasResolvidas,
                      totalBarreiras: vagaCompativel.totalBarreiras,
                    }
                  : null
              );
            }
          } catch {
            // Silencioso, compatibilidade é opcional
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao carregar vaga");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, auth]);

  async function candidatar() {
    if (!auth?.token || auth.usuario.tipo !== "PCD") {
      router.push("/login");
      return;
    }
    try {
      await apiFetch("/candidaturas", {
        method: "POST",
        authToken: auth.token,
        body: JSON.stringify({ vagaId: id, mensagem }),
      });
      show("Candidatura enviada com sucesso!", "success");
      router.push("/dashboard");
    } catch (err) {
      show(err instanceof Error ? err.message : "Erro ao candidatar", "error");
    }
  }

  function getCompatibilityColor(percentage: number): string {
    if (percentage >= 80) return "text-green-600 bg-green-50 border-green-200";
    if (percentage >= 50)
      return "text-yellow-700 bg-yellow-50 border-yellow-200";
    return "text-red-600 bg-red-50 border-red-200";
  }

  function getCompatibilityBarColor(percentage: number): string {
    if (percentage >= 80) return "bg-green-500";
    if (percentage >= 50) return "bg-yellow-500";
    return "bg-red-500";
  }

  if (loading) return <p className="">Carregando...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!vaga) return <p className="">Vaga não encontrada</p>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-zinc-900">{vaga.titulo}</h1>
        <p className="text-lg text-zinc-600 mt-1">
          {vaga.empresa?.nomeFantasia}
        </p>
      </div>

      {/* Compatibilidade para PCD */}
      {auth?.usuario?.tipo === "PCD" &&
        typeof vaga.compatibilidade === "number" && (
          <div
            className={`border rounded-lg p-4 ${getCompatibilityColor(
              vaga.compatibilidade
            )}`}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">Compatibilidade com seu perfil</h3>
              <span className="text-2xl font-bold">
                {vaga.compatibilidade}%
              </span>
            </div>
            <div className="h-3 w-full bg-zinc-200 rounded-full overflow-hidden mb-2">
              <div
                className={`h-full transition-all ${getCompatibilityBarColor(
                  vaga.compatibilidade
                )}`}
                style={{ width: `${vaga.compatibilidade}%` }}
              />
            </div>
            <p className="text-sm">
              {vaga.barreirasResolvidas || 0} de {vaga.totalBarreiras || 0}{" "}
              barreiras atendidas por esta vaga
            </p>
          </div>
        )}

      {/* Informações principais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {vaga.metodoTrabalho && (
          <div className="border border-zinc-200 rounded-lg p-4 bg-white">
            <h3 className="text-xs font-medium text-zinc-600 mb-1">
              Método de Trabalho
            </h3>
            <p className="text-sm font-semibold text-zinc-900">
              {vaga.metodoTrabalho}
            </p>
          </div>
        )}
        {vaga.faixaSalarial && (
          <div className="border border-zinc-200 rounded-lg p-4 bg-white">
            <h3 className="text-xs font-medium text-zinc-600 mb-1">
              Faixa Salarial
            </h3>
            <p className="text-sm font-semibold text-zinc-900">
              {vaga.faixaSalarial}
            </p>
          </div>
        )}
        {vaga.escolaridade && (
          <div className="border border-zinc-200 rounded-lg p-4 bg-white">
            <h3 className="text-xs font-medium text-zinc-600 mb-1">
              Escolaridade
            </h3>
            <p className="text-sm font-semibold text-zinc-900">
              {vaga.escolaridade}
            </p>
          </div>
        )}
      </div>

      {/* Descrição */}
      <div className="border border-zinc-200 rounded-lg p-6 bg-white">
        <h2 className="text-lg font-semibold text-zinc-900 mb-3">
          Descrição da Vaga
        </h2>
        <p className="whitespace-pre-wrap text-zinc-700 leading-relaxed">
          {vaga.descricao}
        </p>
      </div>

      {/* Acessibilidades */}
      {vaga.acessibilidades && vaga.acessibilidades.length > 0 && (
        <div className="border border-zinc-200 rounded-lg p-6 bg-white">
          <h2 className="text-lg font-semibold text-zinc-900 mb-3">
            Acessibilidades Oferecidas
          </h2>
          <div className="flex flex-wrap gap-2">
            {vaga.acessibilidades.map((acc) => (
              <span
                key={acc.acessibilidade.id}
                className="inline-flex items-center gap-1.5 px-3 py-1 text-sm bg-green-100 text-green-800 rounded-full"
              >
                <Check className="w-4 h-4" aria-hidden />
                {acc.acessibilidade.descricao}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Sobre a empresa */}
      {vaga.empresa?.sobre && (
        <div className="border border-zinc-200 rounded-lg p-6 bg-white">
          <h2 className="text-lg font-semibold text-zinc-900 mb-3">
            Sobre a Empresa
          </h2>
          <p className="text-zinc-700 leading-relaxed">{vaga.empresa.sobre}</p>
        </div>
      )}

      {/* Formulário de candidatura */}
      {auth?.usuario?.tipo === "PCD" && (
        <div className="border border-[#755fe3] rounded-lg p-6 bg-purple-50">
          <h2 className="text-lg font-semibold text-zinc-900 mb-3">
            Candidate-se a esta vaga
          </h2>
          <label className="block text-sm font-medium text-zinc-800 mb-2">
            Mensagem opcional
          </label>
          <textarea
            value={mensagem}
            onChange={(e) => setMensagem(e.target.value)}
            rows={4}
            placeholder="Conte um pouco sobre você e por que se interessa por esta vaga..."
            className="w-full rounded-md border border-zinc-300 bg-white text-zinc-900 p-3 text-sm focus:ring-2 focus:ring-[#755fe3] mb-4"
          />
          <button
            onClick={candidatar}
            className="w-full md:w-auto rounded-md bg-[#755fe3] px-6 py-3 text-white font-semibold hover:opacity-95 transition-opacity"
          >
            Enviar Candidatura
          </button>
        </div>
      )}

      {!auth && (
        <div className="border border-zinc-300 rounded-lg p-6 bg-zinc-50 text-center">
          <p className="text-zinc-700 mb-4">
            Faça login como candidato PCD para se candidatar a esta vaga
          </p>
          <button
            onClick={() => router.push("/login/pcd")}
            className="rounded-md bg-[#755fe3] px-6 py-2 text-white hover:opacity-95"
          >
            Fazer Login
          </button>
        </div>
      )}
    </div>
  );
}
