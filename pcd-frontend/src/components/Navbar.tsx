"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getAuth, clearAuth } from "../lib/auth";
import Image from "next/image";

function getInitialTheme() {
  if (typeof window === "undefined") return "light";
  return localStorage.getItem("theme") || "light";
}

function setHtmlTheme(theme: string) {
  if (typeof document !== "undefined") {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }
}

export default function Navbar() {
  const [userName, setUserName] = useState<string | null>(
    () => getAuth()?.usuario?.nome ?? null
  );
  const [userTipo, setUserTipo] = useState<string | null>(
    () => getAuth()?.usuario?.tipo ?? null
  );
  const [theme, setTheme] = useState<string>(() => getInitialTheme());

  useEffect(() => {
    setHtmlTheme(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  function handleLogout() {
    clearAuth();
    setUserName(null);
    setUserTipo(null);
  }

  function toggleTheme() {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }

  return (
    <header className="w-full border-b border-zinc-200 bg-white dark:bg-zinc-900">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-semibold text-zinc-900 dark:text-white"
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
          <button
            onClick={toggleTheme}
            aria-label="Alternar tema"
            className="rounded-full border border-zinc-300 bg-white dark:bg-zinc-800 p-2 text-zinc-700 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition"
          >
            {theme === "light" ? (
              <svg
                width={20}
                height={20}
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="10" cy="10" r="5" fill="#755fe3" />
                <path
                  d="M10 2v2M10 16v2M2 10h2M16 10h2M4.22 4.22l1.42 1.42M14.36 14.36l1.42 1.42M4.22 15.78l1.42-1.42M14.36 5.64l1.42-1.42"
                  stroke="#755fe3"
                  strokeWidth="1.5"
                />
              </svg>
            ) : (
              <svg
                width={20}
                height={20}
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15.5 10A5.5 5.5 0 0 1 10 15.5c-3.04 0-5.5-2.46-5.5-5.5 0-3.04 2.46-5.5 5.5-5.5A5.5 5.5 0 0 1 15.5 10Z"
                  fill="#755fe3"
                />
              </svg>
            )}
          </button>
          <Link
            href="/vagas"
            className="rounded-md px-3 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            Vagas
          </Link>
          {userName ? (
            <div className="flex items-center gap-3">
              {userTipo === "PCD" && (
                <Link
                  href="/dashboard"
                  className="rounded-md px-3 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  Dashboard
                </Link>
              )}
              {userTipo === "EMPRESA" && (
                <Link
                  href="/empresa/painel"
                  className="rounded-md px-3 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  Painel Empresa
                </Link>
              )}
              <span className="hidden sm:inline text-sm text-zinc-600 dark:text-zinc-300">
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
                className="rounded-md px-3 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800"
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
