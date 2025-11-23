"use client";

import { useRouter } from "next/navigation";
import { apiFetch } from "../../../lib/api";
import { setAuth } from "../../../lib/auth";
import { useToast } from "../../../components/Toaster";
import { useState } from "react";

export default function CadastroEmpresaPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { show } = useToast();
  const [loadingCep, setLoadingCep] = useState(false);

  const [form, setForm] = useState({
    razaoSocial: "",
    nomeFantasia: "",
    cnpj: "",
    inscricaoEstadual: "",
    porteEmpresa: "",
    setorAtuacao: "",
    sobre: "",
    site: "",
    cep: "",
    estado: "",
    cidade: "",
    endereco: "",
    numero: "",
    bairro: "",
    complemento: "",
    // Dados do responsável
    nomeResponsavel: "",
    cpfResponsavel: "",
    telefoneResponsavel: "",
    emailResponsavel: "",
    senhaResponsavel: "",
    confirmarSenha: "",
  });

  function update<K extends keyof typeof form>(
    key: K,
    value: (typeof form)[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  // Máscaras
  function maskCNPJ(value: string): string {
    return value
      .replace(/\D/g, "")
      .slice(0, 14)
      .replace(/(\d{2})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1/$2")
      .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
  }

  function maskCPF(value: string): string {
    return value
      .replace(/\D/g, "")
      .slice(0, 11)
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  }

  function maskPhone(value: string): string {
    return value
      .replace(/\D/g, "")
      .slice(0, 11)
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2");
  }

  function maskCEP(value: string): string {
    return value
      .replace(/\D/g, "")
      .slice(0, 8)
      .replace(/(\d{5})(\d)/, "$1-$2");
  }

  // Auto-preencher endereço quando CEP estiver completo
  async function handleCepChange(value: string) {
    const masked = maskCEP(value);
    update("cep", masked);

    const cepDigits = value.replace(/\D/g, "");
    if (cepDigits.length === 8) {
      setLoadingCep(true);
      try {
        const data = await fetch(`/api/endereco/${cepDigits}`).then((r) =>
          r.json()
        );
        if (data.error) {
          show(data.error, "error");
        } else {
          update("endereco", data.rua || "");
          update("bairro", data.bairro || "");
          update("cidade", data.cidade || "");
          update("estado", data.estado || "");
          show("Endereço preenchido!", "success");
          // Foca no campo número após preencher o endereço
          setTimeout(() => {
            document.getElementById("numero")?.focus();
          }, 100);
        }
      } catch (err) {
        show((err as Error).message || "Erro ao buscar CEP", "error");
      } finally {
        setLoadingCep(false);
      }
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // Validações
      if (form.senhaResponsavel !== form.confirmarSenha) {
        const msg = "As senhas não coincidem";
        setError(msg);
        show(msg, "error");
        setLoading(false);
        return;
      }
      const cnpjDigits = form.cnpj.replace(/\D/g, "");
      if (cnpjDigits.length < 14) {
        const msg = "CNPJ deve conter 14 dígitos";
        setError(msg);
        show(msg, "error");
        setLoading(false);
        return;
      }
      const cpfDigits = form.cpfResponsavel.replace(/\D/g, "");
      if (cpfDigits.length < 11) {
        const msg = "CPF do responsável deve conter 11 dígitos";
        setError(msg);
        show(msg, "error");
        setLoading(false);
        return;
      }

      // Criar usuário responsável primeiro
      const usuarioRes = await apiFetch<{
        usuario: { id: number; nome: string; email: string; tipo: string };
      }>("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          nome: form.nomeResponsavel,
          cpf: cpfDigits,
          telefone: form.telefoneResponsavel.replace(/\D/g, ""),
          email: form.emailResponsavel,
          senha: form.senhaResponsavel,
          tipo: "EMPRESA",
        }),
      });

      // Criar empresa com o responsavelId
      const empresaRes = await apiFetch<{
        id: number;
        nomeFantasia: string;
      }>("/empresas", {
        method: "POST",
        body: JSON.stringify({
          razaoSocial: form.razaoSocial,
          nomeFantasia: form.nomeFantasia,
          cnpj: cnpjDigits,
          inscricaoEstadual: form.inscricaoEstadual || undefined,
          porteEmpresa: form.porteEmpresa,
          setorAtuacao: form.setorAtuacao,
          sobre: form.sobre,
          site: form.site || undefined,
          cep: form.cep.replace(/\D/g, ""),
          estado: form.estado,
          cidade: form.cidade,
          endereco: form.endereco,
          numero: form.numero,
          bairro: form.bairro,
          complemento: form.complemento || undefined,
          responsavelId: usuarioRes.usuario.id,
        }),
      });

      // Fazer login automático
      const login = await apiFetch<{
        token: string;
        usuario: { id: number; nome: string; email: string; tipo: string };
      }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: form.emailResponsavel,
          senha: form.senhaResponsavel,
        }),
      });

      setAuth({
        token: login.token,
        usuario: {
          ...login.usuario,
          empresaId: empresaRes.id,
        },
      });

      show("Cadastro realizado com sucesso!", "success");
      router.push("/empresa/painel");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro no cadastro";
      setError(msg);
      show(msg, "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="mb-6 text-2xl font-semibold text-zinc-900">
        Cadastro de Empresa
      </h1>
      <form
        onSubmit={onSubmit}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2"
      >
        {/* Dados da Empresa */}
        <div className="sm:col-span-2">
          <h2 className="text-lg font-semibold text-zinc-900 mb-3">
            Dados da Empresa
          </h2>
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-zinc-800">
            Razão Social
          </label>
          <input
            className="mt-1 w-full rounded-md border border-zinc-300 bg-white text-zinc-900 px-3 py-2 text-sm focus:ring-2 focus:ring-[#755fe3]"
            required
            value={form.razaoSocial}
            onChange={(e) => update("razaoSocial", e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-800">
            Nome Fantasia
          </label>
          <input
            className="mt-1 w-full rounded-md border border-zinc-300 bg-white text-zinc-900 px-3 py-2 text-sm focus:ring-2 focus:ring-[#755fe3]"
            required
            value={form.nomeFantasia}
            onChange={(e) => update("nomeFantasia", e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-800">
            CNPJ
          </label>
          <input
            className="mt-1 w-full rounded-md border border-zinc-300 bg-white text-zinc-900 px-3 py-2 text-sm focus:ring-2 focus:ring-[#755fe3]"
            required
            placeholder="00.000.000/0000-00"
            value={form.cnpj}
            onChange={(e) => update("cnpj", maskCNPJ(e.target.value))}
            maxLength={18}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-800">
            Inscrição Estadual (opcional)
          </label>
          <input
            className="mt-1 w-full rounded-md border border-zinc-300 bg-white text-zinc-900 px-3 py-2 text-sm focus:ring-2 focus:ring-[#755fe3]"
            value={form.inscricaoEstadual}
            onChange={(e) => update("inscricaoEstadual", e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-800">
            Porte da Empresa
          </label>
          <select
            className="mt-1 w-full rounded-md border border-zinc-300 bg-white text-zinc-900 px-3 py-2 text-sm focus:ring-2 focus:ring-[#755fe3]"
            required
            value={form.porteEmpresa}
            onChange={(e) => update("porteEmpresa", e.target.value)}
          >
            <option value="">Selecione...</option>
            <option value="MEI">MEI</option>
            <option value="Microempresa">Microempresa</option>
            <option value="Pequeno Porte">Pequeno Porte</option>
            <option value="Médio Porte">Médio Porte</option>
            <option value="Grande Porte">Grande Porte</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-800">
            Setor de Atuação
          </label>
          <input
            className="mt-1 w-full rounded-md border border-zinc-300 bg-white text-zinc-900 px-3 py-2 text-sm focus:ring-2 focus:ring-[#755fe3]"
            required
            placeholder="Ex: Tecnologia, Saúde, Educação"
            value={form.setorAtuacao}
            onChange={(e) => update("setorAtuacao", e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-800">
            Site (opcional)
          </label>
          <input
            type="url"
            className="mt-1 w-full rounded-md border border-zinc-300 bg-white text-zinc-900 px-3 py-2 text-sm focus:ring-2 focus:ring-[#755fe3]"
            placeholder="https://www.exemplo.com.br"
            value={form.site}
            onChange={(e) => update("site", e.target.value)}
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-zinc-800">
            Sobre a Empresa
          </label>
          <textarea
            className="mt-1 w-full rounded-md border border-zinc-300 bg-white text-zinc-900 px-3 py-2 text-sm focus:ring-2 focus:ring-[#755fe3]"
            required
            rows={4}
            placeholder="Descreva brevemente a empresa, sua missão e valores..."
            value={form.sobre}
            onChange={(e) => update("sobre", e.target.value)}
          />
        </div>

        {/* Endereço */}
        <div className="sm:col-span-2">
          <h2 className="text-lg font-semibold text-zinc-900 mb-3 mt-4">
            Endereço
          </h2>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-800">CEP</label>
          <input
            className="mt-1 w-full rounded-md border border-zinc-300 bg-white text-zinc-900 px-3 py-2 text-sm focus:ring-2 focus:ring-[#755fe3]"
            required
            placeholder="00000-000"
            value={form.cep}
            onChange={(e) => handleCepChange(e.target.value)}
            maxLength={9}
          />
          {loadingCep && (
            <p className="mt-1 text-xs text-[#755fe3]">Buscando endereço...</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-800">
            Estado
          </label>
          <input
            className="mt-1 w-full rounded-md border border-zinc-300 bg-white text-zinc-900 px-3 py-2 text-sm focus:ring-2 focus:ring-[#755fe3]"
            required
            value={form.estado}
            onChange={(e) => update("estado", e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-800">
            Cidade
          </label>
          <input
            className="mt-1 w-full rounded-md border border-zinc-300 bg-white text-zinc-900 px-3 py-2 text-sm focus:ring-2 focus:ring-[#755fe3]"
            required
            value={form.cidade}
            onChange={(e) => update("cidade", e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-800">
            Endereço
          </label>
          <input
            className="mt-1 w-full rounded-md border border-zinc-300 bg-white text-zinc-900 px-3 py-2 text-sm focus:ring-2 focus:ring-[#755fe3]"
            required
            value={form.endereco}
            onChange={(e) => update("endereco", e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-800">
            Número
          </label>
          <input
            id="numero"
            className="mt-1 w-full rounded-md border border-zinc-300 bg-white text-zinc-900 px-3 py-2 text-sm focus:ring-2 focus:ring-[#755fe3]"
            required
            inputMode="numeric"
            pattern="[0-9]*"
            value={form.numero}
            onChange={(e) =>
              update("numero", e.target.value.replace(/\D/g, ""))
            }
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-800">
            Bairro
          </label>
          <input
            className="mt-1 w-full rounded-md border border-zinc-300 bg-white text-zinc-900 px-3 py-2 text-sm focus:ring-2 focus:ring-[#755fe3]"
            required
            value={form.bairro}
            onChange={(e) => update("bairro", e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-800">
            Complemento (opcional)
          </label>
          <input
            className="mt-1 w-full rounded-md border border-zinc-300 bg-white text-zinc-900 px-3 py-2 text-sm focus:ring-2 focus:ring-[#755fe3]"
            value={form.complemento}
            onChange={(e) => update("complemento", e.target.value)}
          />
        </div>

        {/* Dados do Responsável */}
        <div className="sm:col-span-2">
          <h2 className="text-lg font-semibold text-zinc-900 mb-3 mt-4">
            Dados do Responsável
          </h2>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-800">
            Nome do Responsável
          </label>
          <input
            className="mt-1 w-full rounded-md border border-zinc-300 bg-white text-zinc-900 px-3 py-2 text-sm focus:ring-2 focus:ring-[#755fe3]"
            required
            value={form.nomeResponsavel}
            onChange={(e) => update("nomeResponsavel", e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-800">
            CPF do Responsável
          </label>
          <input
            className="mt-1 w-full rounded-md border border-zinc-300 bg-white text-zinc-900 px-3 py-2 text-sm focus:ring-2 focus:ring-[#755fe3]"
            required
            placeholder="000.000.000-00"
            value={form.cpfResponsavel}
            onChange={(e) => update("cpfResponsavel", maskCPF(e.target.value))}
            maxLength={14}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-800">
            Telefone do Responsável
          </label>
          <input
            className="mt-1 w-full rounded-md border border-zinc-300 bg-white text-zinc-900 px-3 py-2 text-sm focus:ring-2 focus:ring-[#755fe3]"
            required
            placeholder="(00) 00000-0000"
            value={form.telefoneResponsavel}
            onChange={(e) =>
              update("telefoneResponsavel", maskPhone(e.target.value))
            }
            maxLength={15}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-800">
            E-mail do Responsável
          </label>
          <input
            type="email"
            className="mt-1 w-full rounded-md border border-zinc-300 bg-white text-zinc-900 px-3 py-2 text-sm focus:ring-2 focus:ring-[#755fe3]"
            required
            value={form.emailResponsavel}
            onChange={(e) => update("emailResponsavel", e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-800">
            Senha
          </label>
          <input
            type="password"
            className="mt-1 w-full rounded-md border border-zinc-300 bg-white text-zinc-900 px-3 py-2 text-sm focus:ring-2 focus:ring-[#755fe3]"
            required
            value={form.senhaResponsavel}
            onChange={(e) => update("senhaResponsavel", e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-800">
            Confirmar Senha
          </label>
          <input
            type="password"
            className="mt-1 w-full rounded-md border border-zinc-300 bg-white text-zinc-900 px-3 py-2 text-sm focus:ring-2 focus:ring-[#755fe3]"
            required
            value={form.confirmarSenha}
            onChange={(e) => update("confirmarSenha", e.target.value)}
          />
        </div>

        {error && (
          <p className="sm:col-span-2 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}

        <button
          disabled={loading}
          className={`sm:col-span-2 rounded-md bg-[#755fe3] px-4 py-2 text-white hover:opacity-95 disabled:opacity-60 ${
            loading ? "opacity-60 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Cadastrando..." : "Cadastrar Empresa"}
        </button>
      </form>
    </div>
  );
}
