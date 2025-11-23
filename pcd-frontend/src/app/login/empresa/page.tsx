"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiFetch } from "../../../lib/api";
import { setAuth } from "../../../lib/auth";
import { useToast } from "../../../components/Toaster";

export default function LoginEmpresaPage() {
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

      // Verifica se é EMPRESA
      if (response.usuario.tipo !== "EMPRESA") {
        show("Este login é apenas para empresas", "error");
        setLoading(false);
        return;
      }

      setAuth({ token: response.token, usuario: response.usuario });
      show("Login realizado com sucesso!", "success");
      router.push("/empresa/painel");
    } catch (err) {
      show(err instanceof Error ? err.message : "Erro ao fazer login", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Painel esquerdo roxo */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#755fe3] flex-col items-center justify-center text-white p-12">
        <div className="max-w-md text-center space-y-6">
          <h1 className="text-5xl font-bold">Bem-vindo!</h1>
          <p className="text-lg opacity-90">Para se manter conectado conosco</p>
          <p className="text-lg opacity-90">
            faça login com suas informações pessoais
          </p>
          <Link
            href="/cadastro/empresa"
            className="inline-block mt-8 px-12 py-3 border-2 border-white rounded-full text-white font-semibold hover:bg-white hover:text-[#755fe3] transition-all"
          >
            CADASTRAR
          </Link>
        </div>
      </div>

      {/* Painel direito branco - Formulário */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-[#755fe3] mb-2">
              Login Empresa
            </h2>
            <p className="text-gray-500">ou use seu e-mail para login:</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="email"
                placeholder="Email"
                required
                className="w-full px-4 py-3 rounded-lg bg-gray-100 border-none focus:ring-2 focus:ring-[#755fe3] text-gray-800"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Senha"
                required
                className="w-full px-4 py-3 rounded-lg bg-gray-100 border-none focus:ring-2 focus:ring-[#755fe3] text-gray-800"
                value={form.senha}
                onChange={(e) => setForm({ ...form, senha: e.target.value })}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#755fe3] text-white font-bold rounded-full hover:opacity-90 transition-all disabled:opacity-50"
            >
              {loading ? "ENTRANDO..." : "ENTRAR"}
            </button>
          </form>

          <div className="text-center space-y-2">
            <p className="text-sm text-gray-600">
              Não tem conta?{" "}
              <Link
                href="/cadastro/empresa"
                className="text-[#755fe3] hover:underline font-semibold"
              >
                Cadastre-se aqui
              </Link>
            </p>
            <p className="text-sm text-gray-600">
              É um candidato?{" "}
              <Link
                href="/login/pcd"
                className="text-[#755fe3] hover:underline font-semibold"
              >
                Faça login como candidato
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
