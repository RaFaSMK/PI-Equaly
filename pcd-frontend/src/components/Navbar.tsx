"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { getAuth, clearAuth } from "../lib/auth";
import Image from "next/image";
import { useRouter } from "next/navigation";
import EditProfileModal from "./EditProfileModal";
import {
  ChevronDown,
  User,
  Pencil,
  FileText,
  Settings,
  LogOut,
} from "lucide-react";

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
    <header className="w-full bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/80 border-b border-zinc-200">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-3 py-2.5 sm:px-4 sm:py-3.5 lg:px-8">
        <Link
          href="/"
          className="group flex items-center gap-2 sm:gap-2.5 text-lg sm:text-xl font-semibold text-zinc-900"
        >
          <Image
            src="/icon.svg"
            alt="Logo EQualy"
            width={28}
            height={28}
            className="h-6 w-6 sm:h-7 sm:w-7 transition-transform group-hover:scale-105"
            priority
          />
          <span>
            EQualy
            <span className="ml-2 align-middle text-[10px] font-medium text-white bg-[#755fe3] px-1.5 py-0.5 rounded-full hidden sm:inline">
              PCD
            </span>
          </span>
        </Link>
        <div className="flex items-center gap-2 sm:gap-3">
          {(!userName || userTipo === "PCD") && (
            <Link
              href="/vagas"
              className="rounded-md border border-[#755fe3] bg-[#755fe3] px-3 py-2 text-xs sm:text-sm font-semibold text-white transition-colors hover:bg-[#6248e5] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#755fe3]"
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
                      <ChevronDown
                        className={`w-4 h-4 text-zinc-600 transition-transform ${
                          dropdownOpen ? "rotate-180" : ""
                        }`}
                        aria-hidden
                      />
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
                          <User className="w-4 h-4" aria-hidden />
                          Perfil
                        </Link>
                        <button
                          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50"
                          onClick={() => {
                            setDropdownOpen(false);
                            setEditModalOpen(true);
                          }}
                        >
                          <Pencil className="w-4 h-4" aria-hidden />
                          Meus Dados
                        </button>
                        <Link
                          href="/candidaturas"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <FileText className="w-4 h-4" aria-hidden />
                          Minhas Inscrições
                        </Link>
                        <Link
                          href="/admin"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <Settings className="w-4 h-4" aria-hidden />
                          Administração
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 border-t border-zinc-200 mt-1"
                        >
                          <LogOut className="w-4 h-4" aria-hidden />
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
                    className="rounded-md border border-[#755fe3] bg-[#755fe3] px-2.5 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm font-semibold text-white transition-colors hover:bg-[#6248e5] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#755fe3]"
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
                className="rounded-md border border-[#755fe3] bg-[#755fe3] px-2.5 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#6248e5] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#755fe3]"
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
