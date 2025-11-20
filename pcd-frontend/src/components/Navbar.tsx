"use client";

import Link from "next/link";
import { useState } from "react";
import { getAuth, clearAuth } from "../lib/auth";
import Image from "next/image";

export default function Navbar() {
  const [userName, setUserName] = useState<string | null>(
    () => getAuth()?.usuario?.nome ?? null
  );
  const [userTipo, setUserTipo] = useState<string | null>(
    () => getAuth()?.usuario?.tipo ?? null
  );

  function handleLogout() {
    clearAuth();
    setUserName(null);
    setUserTipo(null);
  }

  return (
    <header className="w-full border-b border-zinc-200 bg-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-semibold text-zinc-900"
        >
          <Image
            src="/icon.svg"
            alt="Logo EQualy"
            width={24}
            height={24}
            className="h-6 w-6"
            priority
          />
          EQualy
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href="/vagas"
            className="rounded-md px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100"
          >
            Vagas
          </Link>
          {userName ? (
            <div className="flex items-center gap-3">
              {userTipo === "PCD" && (
                <Link
                  href="/dashboard"
                  className="rounded-md px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100"
                >
                  Dashboard
                </Link>
              )}
              {userTipo === "EMPRESA" && (
                <Link
                  href="/empresa/painel"
                  className="rounded-md px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100"
                >
                  Painel Empresa
                </Link>
              )}
              <span className="hidden sm:inline text-sm text-zinc-600">
                Olá, {userName.split(" ")[0]}
              </span>
              <button
                onClick={handleLogout}
                className="rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white hover:opacity-90"
              >
                Sair
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="rounded-md px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100"
              >
                Entrar
              </Link>
              <Link
                href="/cadastro/pcd"
                className="rounded-md bg-[#755fe3] px-3 py-2 text-sm font-medium text-white hover:opacity-95"
              >
                Sou Candidato
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
