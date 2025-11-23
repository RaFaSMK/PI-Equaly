"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getAuth } from "@/lib/auth";
import RequireAuth from "@/components/RequireAuth";

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth();
    if (!auth?.token) {
      router.push("/login");
    }
  }, [router]);

  return (
    <RequireAuth>
      <div className="min-h-screen bg-zinc-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-zinc-900">Administração</h1>
            <p className="text-zinc-600 mt-2">
              Gerencie barreiras e acessibilidades do sistema
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card Barreiras */}
            <Link
              href="/admin/barreiras"
              className="bg-white rounded-lg shadow-sm border border-zinc-200 p-6 hover:shadow-md transition-shadow group"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-200 transition-colors">
                  <svg
                    className="w-6 h-6 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-zinc-900">
                    Barreiras
                  </h2>
                  <p className="text-sm text-zinc-500">
                    Gerenciar barreiras de acessibilidade
                  </p>
                </div>
              </div>
              <p className="text-zinc-600 text-sm">
                Cadastre, edite ou remova barreiras que os PCDs podem enfrentar.
              </p>
              <div className="mt-4 flex items-center text-[#755fe3] font-medium text-sm group-hover:gap-2 transition-all">
                Acessar
                <svg
                  className="w-4 h-4 ml-1 group-hover:ml-2 transition-all"
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
              </div>
            </Link>

            {/* Card Acessibilidades */}
            <Link
              href="/admin/acessibilidades"
              className="bg-white rounded-lg shadow-sm border border-zinc-200 p-6 hover:shadow-md transition-shadow group"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-zinc-900">
                    Acessibilidades
                  </h2>
                  <p className="text-sm text-zinc-500">
                    Gerenciar recursos de acessibilidade
                  </p>
                </div>
              </div>
              <p className="text-zinc-600 text-sm">
                Cadastre, edite ou remova acessibilidades que as vagas podem
                oferecer.
              </p>
              <div className="mt-4 flex items-center text-[#755fe3] font-medium text-sm group-hover:gap-2 transition-all">
                Acessar
                <svg
                  className="w-4 h-4 ml-1 group-hover:ml-2 transition-all"
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
              </div>
            </Link>

            {/* Card Vínculos */}
            <Link
              href="/admin/vinculos"
              className="bg-white rounded-lg shadow-sm border border-zinc-200 p-6 hover:shadow-md transition-shadow group"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                  <svg
                    className="w-6 h-6 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-zinc-900">
                    Vínculos
                  </h2>
                  <p className="text-sm text-zinc-500">
                    Barreira ↔ Acessibilidade
                  </p>
                </div>
              </div>
              <p className="text-zinc-600 text-sm">
                Defina quais acessibilidades resolvem cada barreira para
                calcular compatibilidade.
              </p>
              <div className="mt-4 flex items-center text-[#755fe3] font-medium text-sm group-hover:gap-2 transition-all">
                Acessar
                <svg
                  className="w-4 h-4 ml-1 group-hover:ml-2 transition-all"
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
              </div>
            </Link>

            {/* Card Deficiências */}
            <Link
              href="/admin/deficiencias"
              className="bg-white rounded-lg shadow-sm border border-zinc-200 p-6 hover:shadow-md transition-shadow group"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-zinc-900">
                    Deficiências
                  </h2>
                  <p className="text-sm text-zinc-500">Tipos e Subtipos</p>
                </div>
              </div>
              <p className="text-zinc-600 text-sm">
                Gerencie tipos de deficiência e seus subtipos para categorização
                de vagas e PCDs.
              </p>
              <div className="mt-4 flex items-center text-[#755fe3] font-medium text-sm group-hover:gap-2 transition-all">
                Acessar
                <svg
                  className="w-4 h-4 ml-1 group-hover:ml-2 transition-all"
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
              </div>
            </Link>
          </div>

          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex gap-3">
              <svg
                className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div className="text-sm">
                <p className="font-medium text-blue-900 mb-1">
                  Sobre Barreiras e Acessibilidades
                </p>
                <p className="text-blue-700">
                  <strong>Barreiras</strong> são obstáculos que PCDs podem
                  enfrentar. <strong>Acessibilidades</strong> são recursos que
                  as vagas podem oferecer para superar essas barreiras. O
                  sistema calcula a compatibilidade entre eles automaticamente.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </RequireAuth>
  );
}
