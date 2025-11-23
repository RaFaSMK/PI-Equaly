"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { apiFetch } from "../../../lib/api";
import { setAuth } from "../../../lib/auth";
import { useToast } from "../../../components/Toaster";

export default function LoginPcdPage() {
  const router = useRouter();
  const { show } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    senha: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await apiFetch<{
        token: string;
        usuario: {
          id: number;
          nome: string;
          email: string;
          tipo: string;
        };
      }>("/auth/login", {
        method: "POST",
        body: JSON.stringify(form),
      });

      // Verifica se é PCD
      if (response.usuario.tipo !== "PCD") {
        show("Este login é apenas para candidatos", "error");
        setLoading(false);
        return;
      }

      setAuth({ token: response.token, usuario: response.usuario });
      show("Login realizado com sucesso!", "success");
      router.push("/vagas");
    } catch (err) {
      show(err instanceof Error ? err.message : "Erro ao fazer login", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Painel esquerdo roxo com imagem */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#755fe3] flex-col items-center justify-center text-white p-12 relative">
        <div className="max-w-xl w-full space-y-10">
          <div className="relative w-full max-w-[520px] aspect-video mx-auto">
            <Image
              src="/ImagemLoginPCD.png"
              alt="Profissionais PCD colaborando em ambiente inclusivo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div className="text-center space-y-3">
            <h1 className="text-4xl font-bold">Sua Carreira Sem Limites.</h1>
            <p className="text-lg opacity-95">
              A rede profissional inclusiva para talentos PCD.
            </p>
          </div>
        </div>
      </div>

      {/* Painel direito branco - Formulário */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-[#755fe3] mb-2">
              Login Candidato
            </h2>
            <p className="text-gray-600">ou use seu e-mail para login:</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <input
                type="email"
                placeholder="Email"
                required
                className="w-full px-4 py-3 rounded-lg bg-gray-50 border-2 border-gray-200 focus:border-[#755fe3] focus:ring-2 focus:ring-[#755fe3]/20 text-gray-800 placeholder-gray-400 transition-all"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Senha"
                required
                className="w-full px-4 py-3 rounded-lg bg-gray-50 border-2 border-gray-200 focus:border-[#755fe3] focus:ring-2 focus:ring-[#755fe3]/20 text-gray-800 placeholder-gray-400 transition-all"
                value={form.senha}
                onChange={(e) => setForm({ ...form, senha: e.target.value })}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#755fe3] text-white font-bold rounded-full hover:bg-[#6248e5] transition-all disabled:opacity-50 shadow-md"
            >
              {loading ? "ENTRANDO..." : "ENTRAR"}
            </button>
          </form>

          <div className="text-center space-y-2">
            <p className="text-sm text-gray-600">
              Não tem conta?{" "}
              <Link
                href="/cadastro/pcd"
                className="text-[#755fe3] hover:underline font-semibold"
              >
                Cadastre-se aqui
              </Link>
            </p>
            <p className="text-sm text-gray-600">
              É uma empresa?{" "}
              <Link
                href="/login/empresa"
                className="text-[#755fe3] hover:underline font-semibold"
              >
                Faça login como empresa
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
