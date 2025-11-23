"use client";

import Link from "next/link";
import RequireAuth from "@/components/RequireAuth";
import {
  AlertTriangle,
  CheckCircle,
  Link as LinkIcon,
  FileText,
  ChevronRight,
} from "lucide-react";

export default function AdminPage() {
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

          <div className="grid grid-cols-1 gap-6">
            {/* Card Barreiras */}
            <Link
              href="/admin/barreiras"
              className="bg-white rounded-lg shadow-sm border border-zinc-200 p-6 hover:shadow-md transition-shadow group"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-200 transition-colors">
                  <AlertTriangle className="w-6 h-6 text-red-600" aria-hidden />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-zinc-900 text-pretty">
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
                <ChevronRight
                  className="w-4 h-4 ml-1 group-hover:ml-2 transition-all"
                  aria-hidden
                />
              </div>
            </Link>

            {/* Card Acessibilidades */}
            <Link
              href="/admin/acessibilidades"
              className="bg-white rounded-lg shadow-sm border border-zinc-200 p-6 hover:shadow-md transition-shadow group"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                  <CheckCircle className="w-6 h-6 text-green-600" aria-hidden />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-zinc-900 text-pretty">
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
                <ChevronRight
                  className="w-4 h-4 ml-1 group-hover:ml-2 transition-all"
                  aria-hidden
                />
              </div>
            </Link>

            {/* Card Vínculos */}
            <Link
              href="/admin/vinculos"
              className="bg-white rounded-lg shadow-sm border border-zinc-200 p-6 hover:shadow-md transition-shadow group"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                  <LinkIcon className="w-6 h-6 text-purple-600" aria-hidden />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-zinc-900 text-pretty">
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
                <ChevronRight
                  className="w-4 h-4 ml-1 group-hover:ml-2 transition-all"
                  aria-hidden
                />
              </div>
            </Link>

            {/* Card Deficiências */}
            <Link
              href="/admin/deficiencias"
              className="bg-white rounded-lg shadow-sm border border-zinc-200 p-6 hover:shadow-md transition-shadow group"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                  <FileText className="w-6 h-6 text-blue-600" aria-hidden />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-zinc-900 text-pretty">
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
                <ChevronRight
                  className="w-4 h-4 ml-1 group-hover:ml-2 transition-all"
                  aria-hidden
                />
              </div>
            </Link>
          </div>

          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <CheckCircle
                className="h-5 w-5 text-blue-600 mt-0.5 shrink-0"
                aria-hidden
              />
              <div className="flex-1">
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
