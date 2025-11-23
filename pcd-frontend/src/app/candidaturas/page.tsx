"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getAuth } from "@/lib/auth";
import { api } from "@/lib/api";
import { FileText, MapPin, CalendarDays, Search } from "lucide-react";

interface Candidatura {
  id: number;
  vagaId: number;
  status: string;
  createdAt: string;
  vaga: {
    titulo: string;
    empresa: {
      nomeFantasia: string;
    };
    cidade: string;
    estado: string;
  };
}

export default function CandidaturasPage() {
  const router = useRouter();
  const [candidaturas, setCandidaturas] = useState<Candidatura[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const auth = getAuth();
    if (!auth || auth.usuario.tipo !== "PCD") {
      router.push("/login/pcd");
      return;
    }

    fetchCandidaturas();
  }, [router]);

  const fetchCandidaturas = async () => {
    try {
      setLoading(true);
      const auth = getAuth();
      const response = await api.get("/candidaturas/pcd", {
        headers: {
          Authorization: `Bearer ${auth?.token}`,
        },
      });
      setCandidaturas(response.data);
    } catch (err) {
      console.error("Erro ao buscar candidaturas:", err);
      setError("Erro ao carregar candidaturas");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pendente":
        return "bg-yellow-100 text-yellow-800";
      case "aceito":
        return "bg-green-100 text-green-800";
      case "rejeitado":
        return "bg-red-100 text-red-800";
      default:
        return "bg-zinc-100 text-zinc-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case "pendente":
        return "Pendente";
      case "aceito":
        return "Aceito";
      case "rejeitado":
        return "Rejeitado";
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#755fe3] mx-auto mb-4"></div>
          <p className="text-zinc-600">Carregando candidaturas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchCandidaturas}
            className="px-4 py-2 bg-[#755fe3] text-white rounded-md hover:opacity-90"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  if (candidaturas.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <FileText
            className="w-24 h-24 mx-auto mb-6 text-zinc-300"
            aria-hidden
          />
          <h1 className="text-2xl font-bold text-zinc-900 mb-3">
            Você não possui candidaturas
          </h1>
          <p className="text-zinc-600 mb-6">
            Comece sua jornada profissional explorando as vagas disponíveis e
            candidate-se às oportunidades que mais combinam com você!
          </p>
          <Link
            href="/vagas"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#755fe3] text-white rounded-md hover:opacity-90 transition-opacity font-medium"
          >
            <Search className="w-5 h-5" aria-hidden />
            Visualizar vagas disponíveis
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900 mb-2">
          Minhas Candidaturas
        </h1>
        <p className="text-zinc-600">
          Acompanhe o status das suas candidaturas às vagas
        </p>
      </div>

      <div className="space-y-4">
        {candidaturas.map((candidatura) => (
          <div
            key={candidatura.id}
            className="bg-white border border-zinc-200 rounded-lg p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-zinc-900 mb-1">
                  {candidatura.vaga.titulo}
                </h3>
                <p className="text-sm text-zinc-600 mb-2">
                  {candidatura.vaga.empresa?.nomeFantasia}
                </p>
                <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" aria-hidden />
                    {candidatura.vaga.cidade}, {candidatura.vaga.estado}
                  </span>
                  <span className="flex items-center gap-1">
                    <CalendarDays className="w-4 h-4" aria-hidden />
                    Candidatura em{" "}
                    {new Date(candidatura.createdAt).toLocaleDateString(
                      "pt-BR"
                    )}
                  </span>
                </div>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getStatusColor(
                  candidatura.status
                )}`}
              >
                {getStatusText(candidatura.status)}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <Link
          href="/vagas"
          className="inline-flex items-center gap-2 text-[#755fe3] hover:underline font-medium"
        >
          <Search className="w-5 h-5" aria-hidden />
          Buscar mais vagas
        </Link>
      </div>
    </div>
  );
}
