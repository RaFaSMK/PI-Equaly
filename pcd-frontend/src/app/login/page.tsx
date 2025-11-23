"use client";

import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4">
      <div className="w-full max-w-md space-y-6 sm:space-y-8 p-6 sm:p-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[#755fe3] mb-4">
            Escolha o tipo de login
          </h1>
          <p className="text-gray-600">
            Selecione a opção que melhor se adequa ao seu perfil
          </p>
        </div>

        <div className="space-y-4">
          <Link
            href="/login/pcd"
            className="block w-full py-3 sm:py-4 px-4 sm:px-6 text-center bg-[#755fe3] text-white font-bold rounded-lg hover:opacity-90 transition-all text-sm sm:text-base"
          >
            Sou Candidato (PCD)
          </Link>

          <Link
            href="/login/empresa"
            className="block w-full py-3 sm:py-4 px-4 sm:px-6 text-center bg-white border-2 border-[#755fe3] text-[#755fe3] font-bold rounded-lg hover:bg-zinc-50 transition-all text-sm sm:text-base"
          >
            Sou Empresa
          </Link>
        </div>

        <div className="text-center text-sm text-gray-600">
          <p>
            Não tem conta?{" "}
            <Link
              href="/cadastro/pcd"
              className="text-[#755fe3] hover:underline font-semibold"
            >
              Cadastre-se como candidato
            </Link>
            {" ou "}
            <Link
              href="/cadastro/empresa"
              className="text-[#755fe3] hover:underline font-semibold"
            >
              cadastre-se como empresa
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
