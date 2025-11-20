"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { apiFetch } from "../../lib/api";
import { setAuth } from "../../lib/auth";
import { useToast } from "../../components/Toaster";

export default function LoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const role = params.get("role") || "pcd";

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { show } = useToast();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      type Usuario = {
        id: number;
        nome: string;
        email: string;
        tipo: string;
        empresaId?: number | null;
        pcdId?: number | null;
      };
      const res = await apiFetch<{ usuario: Usuario; token: string }>(
        "/auth/login",
        {
          method: "POST",
          body: JSON.stringify({ email, senha }),
        }
      );
      setAuth({
        token: res.token,
        usuario: res.usuario,
        pcdId: res.usuario.pcdId ?? null,
      });
      show("Login realizado com sucesso", "success");
      // Se for PCD, leva para vagas ou dashboard
      if (res.usuario.tipo === "PCD") router.push("/vagas");
      else router.push("/vagas");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro ao entrar";
      setError(msg);
      show(msg, "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <h1 className="mb-6 text-2xl font-semibold text-zinc-900">
        Entrar {role === "empresa" ? "(Empresa)" : ""}
      </h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-zinc-800">
            E-mail
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#755fe3]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-800">
            Senha
          </label>
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#755fe3]"
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          disabled={loading}
          className="w-full rounded-md bg-[#755fe3] px-4 py-2 text-white hover:opacity-95 disabled:opacity-60"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
      <p className="mt-4 text-sm text-zinc-600">
        Ainda não tem conta?{" "}
        <a href="/cadastro/pcd" className="text-[#755fe3] underline">
          Cadastre-se
        </a>
      </p>
    </div>
  );
}
