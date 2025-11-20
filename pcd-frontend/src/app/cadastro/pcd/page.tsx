"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { apiFetch } from "../../../lib/api";
import { setAuth } from "../../../lib/auth";
import { useToast } from "../../../components/Toaster";

export default function CadastroPcdPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { show } = useToast();

  // Campos mínimos obrigatórios segundo o backend
  const [form, setForm] = useState({
    nomeCompleto: "",
    cpf: "",
    email: "",
    telefone: "",
    dataNasc: "",
    escolaridade: "",
    endereco: {
      cep: "",
      estado: "",
      cidade: "",
      endereco: "",
      numero: "",
      bairro: "",
      complemento: "",
    },
    senha: "",
    confirmarSenha: "",
  });

  function update<K extends keyof typeof form>(
    key: K,
    value: (typeof form)[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // Validações rápidas no cliente
      if (form.senha !== form.confirmarSenha) {
        const msg = "As senhas não coincidem";
        setError(msg);
        show(msg, "error");
        setLoading(false);
        return;
      }
      const cpfDigits = form.cpf.replace(/\D/g, "");
      if (cpfDigits.length < 11) {
        const msg = "CPF deve conter 11 dígitos";
        setError(msg);
        show(msg, "error");
        setLoading(false);
        return;
      }

      const res = await apiFetch<{
        mensagem: string;
        pcd: { id: number };
        usuario: { id: number; nome: string; email: string; tipo: string };
      }>("/pcd", { method: "POST", body: JSON.stringify(form) });

      // depois do cadastro, efetua login automático
      const login = await apiFetch<{
        token: string;
        usuario: { id: number; nome: string; email: string; tipo: string };
      }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: form.email, senha: form.senha }),
      });

      setAuth({
        token: login.token,
        usuario: login.usuario,
        pcdId: res.pcd.id,
      });
      show("Cadastro realizado com sucesso", "success");
      router.push("/vagas");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro no cadastro";
      setError(msg);
      show(msg, "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-semibold text-zinc-900">
        Cadastro de Candidato PCD
      </h1>
      <form
        onSubmit={onSubmit}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2"
      >
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-zinc-800">
            Nome completo
          </label>
          <input
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:ring-2 focus:ring-[#755fe3]"
            required
            value={form.nomeCompleto}
            onChange={(e) => update("nomeCompleto", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-800">CPF</label>
          <input
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
            required
            value={form.cpf}
            onChange={(e) => update("cpf", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-800">
            Telefone
          </label>
          <input
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
            required
            value={form.telefone}
            onChange={(e) => update("telefone", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-800">
            E-mail
          </label>
          <input
            type="email"
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
            required
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-800">
            Data de Nascimento
          </label>
          <input
            type="date"
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
            required
            value={form.dataNasc}
            onChange={(e) => update("dataNasc", e.target.value)}
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-zinc-800">
            Escolaridade (opcional)
          </label>
          <input
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
            value={form.escolaridade}
            onChange={(e) => update("escolaridade", e.target.value)}
          />
        </div>

        {/* Endereço */}
        <div>
          <label className="block text-sm font-medium text-zinc-800">CEP</label>
          <input
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
            required
            value={form.endereco.cep}
            onChange={(e) =>
              update("endereco", { ...form.endereco, cep: e.target.value })
            }
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-800">
            Estado
          </label>
          <input
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
            required
            value={form.endereco.estado}
            onChange={(e) =>
              update("endereco", { ...form.endereco, estado: e.target.value })
            }
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-800">
            Cidade
          </label>
          <input
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
            required
            value={form.endereco.cidade}
            onChange={(e) =>
              update("endereco", { ...form.endereco, cidade: e.target.value })
            }
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-800">
            Endereço
          </label>
          <input
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
            required
            value={form.endereco.endereco}
            onChange={(e) =>
              update("endereco", { ...form.endereco, endereco: e.target.value })
            }
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-800">
            Número
          </label>
          <input
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
            required
            value={form.endereco.numero}
            onChange={(e) =>
              update("endereco", { ...form.endereco, numero: e.target.value })
            }
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-800">
            Bairro
          </label>
          <input
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
            required
            value={form.endereco.bairro}
            onChange={(e) =>
              update("endereco", { ...form.endereco, bairro: e.target.value })
            }
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-zinc-800">
            Complemento (opcional)
          </label>
          <input
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
            value={form.endereco.complemento}
            onChange={(e) =>
              update("endereco", {
                ...form.endereco,
                complemento: e.target.value,
              })
            }
          />
        </div>

        {/* Senhas */}
        <div>
          <label className="block text-sm font-medium text-zinc-800">
            Senha
          </label>
          <input
            type="password"
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
            required
            value={form.senha}
            onChange={(e) => update("senha", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-800">
            Confirmar Senha
          </label>
          <input
            type="password"
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
            required
            value={form.confirmarSenha}
            onChange={(e) => update("confirmarSenha", e.target.value)}
          />
        </div>

        {error && <p className="sm:col-span-2 text-sm text-red-600">{error}</p>}
        <button
          disabled={loading}
          className="sm:col-span-2 rounded-md bg-[#755fe3] px-4 py-2 text-white hover:opacity-95 disabled:opacity-60"
        >
          {loading ? "Cadastrando..." : "Cadastrar"}
        </button>
      </form>
    </div>
  );
}
