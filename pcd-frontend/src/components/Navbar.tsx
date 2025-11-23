"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { getAuth, clearAuth } from "../lib/auth";
import Image from "next/image";
import { useRouter } from "next/navigation";
import EditProfileModal from "./EditProfileModal";

export default function Navbar() {
  const router = useRouter();
  const [userName, setUserName] = useState<string | null>(null);
  const [userTipo, setUserTipo] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Atualiza o estado da autenticação quando o componente monta e quando há mudanças
  useEffect(() => {
    const updateAuth = () => {
      const auth = getAuth();
      setUserName(auth?.usuario?.nome ?? null);
      setUserTipo(auth?.usuario?.tipo ?? null);
      setUserEmail(auth?.usuario?.email ?? null);
    };

    updateAuth();

    // Escuta mudanças no localStorage (ex: login em outra aba)
    window.addEventListener("storage", updateAuth);
    // Escuta evento customizado de login/logout
    window.addEventListener("authChange", updateAuth);

    return () => {
      window.removeEventListener("storage", updateAuth);
      window.removeEventListener("authChange", updateAuth);
    };
  }, []);

  // Fecha dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleLogout() {
    clearAuth();
    setUserName(null);
    setUserTipo(null);
    // Dispara evento para atualizar outros componentes
    window.dispatchEvent(new Event("authChange"));
    router.push("/");
  }

  return (
    <header className="w-full border-b border-zinc-200 bg-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-3 py-2 sm:px-4 sm:py-3 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-1.5 sm:gap-2 text-lg sm:text-xl font-semibold text-zinc-900"
        >
          <Image
            src="/icon.svg"
            alt="Logo EQualy"
            width={24}
            height={24}
            className="h-5 w-5 sm:h-6 sm:w-6"
            priority
          />
          EQualy
        </Link>
        <div className="flex items-center gap-2 sm:gap-3">
          {(!userName || userTipo === "PCD") && (
            <Link
              href="/vagas"
              className="rounded-md px-2.5 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm font-medium text-zinc-700 hover:bg-zinc-100"
            >
              Vagas
            </Link>
          )}
          {userName ? (
            <div className="flex items-center gap-3">
              {userTipo === "PCD" ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 rounded-full hover:opacity-90 transition-opacity"
                  >
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-100 hover:bg-zinc-200 transition-colors">
                      <div className="w-8 h-8 rounded-full bg-zinc-400 flex items-center justify-center text-white font-semibold text-sm">
                        {userName.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm font-medium text-zinc-700 hidden sm:inline">
                        {userName.split(" ")[0]}
                      </span>
                      <svg
                        className={`w-4 h-4 text-zinc-600 transition-transform ${
                          dropdownOpen ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-zinc-200 py-2 z-50">
                      <div className="px-4 py-3 border-b border-zinc-200">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-zinc-400 flex items-center justify-center text-white font-semibold text-lg">
                            {userName.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-zinc-900 truncate">
                              {userName}
                            </p>
                            <p className="text-xs text-zinc-500 truncate">
                              {userEmail}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="py-1">
                        <Link
                          href="/dashboard"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                          Perfil
                        </Link>
                        <button
                          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50"
                          onClick={() => {
                            setDropdownOpen(false);
                            setEditModalOpen(true);
                          }}
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                          Meus Dados
                        </button>
                        <Link
                          href="/candidaturas"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <svg
                            className="w-4 h-4"
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
                          Minhas Inscrições
                        </Link>
                        <Link
                          href="/admin"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          Administração
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 border-t border-zinc-200 mt-1"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                            />
                          </svg>
                          Sair
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link
                    href="/admin"
                    className="rounded-md px-2.5 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm font-medium text-zinc-700 hover:bg-zinc-100"
                  >
                    Admin
                  </Link>
                  <Link
                    href="/empresa/painel"
                    className="rounded-md px-2.5 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm font-medium text-zinc-700 hover:bg-zinc-100"
                  >
                    Painel
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="rounded-md bg-[#755fe3] px-2.5 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm font-medium text-white hover:opacity-90"
                  >
                    Sair
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Link
                href="/login"
                className="rounded-md px-2.5 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm font-medium text-zinc-700 hover:bg-zinc-100"
              >
                Entrar
              </Link>
              <Link
                href="/login"
                className="rounded-md bg-[#755fe3] px-2.5 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm font-medium text-white hover:opacity-95"
              >
                Cadastrar
              </Link>
            </div>
          )}
        </div>
      </nav>
      <EditProfileModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
      />
    </header>
  );
}
