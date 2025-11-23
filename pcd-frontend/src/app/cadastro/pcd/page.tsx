"use client";

import { useRouter } from "next/navigation";
import { apiFetch } from "../../../lib/api";
import { setAuth } from "../../../lib/auth";
import { useToast } from "../../../components/Toaster";
import { useState, useEffect } from "react";

export default function CadastroPcdPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { show } = useToast();
  const [loadingCep, setLoadingCep] = useState(false);
  const [barreiras, setBarreiras] = useState<
    Array<{ id: number; descricao: string }>
  >([]);
  const [barreirasSelecionadas, setBarreirasSelecionadas] = useState<number[]>(
    []
  );
  const [tipos, setTipos] = useState<
    Array<{
      id: number;
      nome: string;
      subtipos: Array<{ id: number; nome: string }>;
    }>
  >([]);
  const [subtiposSelecionados, setSubtiposSelecionados] = useState<
    Array<{ id: number; cid?: string }>
  >([]);
  const [cidInputs, setCidInputs] = useState<Record<number, string>>({});

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
    },
    senha: "",
    confirmarSenha: "",
  });

  // Buscar barreiras e tipos de deficiência disponíveis
  useEffect(() => {
    async function fetchData() {
      try {
        const [barreirasRes, tiposRes] = await Promise.all([
          apiFetch<{ data: Array<{ id: number; descricao: string }> }>(
            "/barreiras"
          ),
          apiFetch<{
            data: Array<{
              id: number;
              nome: string;
              subtipos: Array<{ id: number; nome: string }>;
            }>;
          }>("/tipos"),
        ]);
        setBarreiras(barreirasRes.data);
        setTipos(tiposRes.data);
      } catch {
        show("Erro ao carregar dados", "error");
      }
    }
    fetchData();
  }, [show]);

  function update<K extends keyof typeof form>(
    key: K,
    value: (typeof form)[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  // Máscaras
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
    update("endereco", { ...form.endereco, cep: masked });

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
          update("endereco", {
            ...form.endereco,
            cep: masked,
            endereco: data.rua || "",
            bairro: data.bairro || "",
            cidade: data.cidade || "",
            estado: data.estado || "",
          });
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

  // Foca no próximo campo após preencher CPF
  function handleCPFChange(value: string) {
    const masked = maskCPF(value);
    update("cpf", masked);

    const cpfDigits = value.replace(/\D/g, "");
    if (cpfDigits.length === 11) {
      setTimeout(() => {
        document.getElementById("telefone")?.focus();
      }, 100);
    }
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
      }>("/pcd", {
        method: "POST",
        body: JSON.stringify({
          ...form,
          barreiraIds: barreirasSelecionadas,
          subtipoIds: subtiposSelecionados,
        }),
      });

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
            className="mt-1 w-full rounded-md border border-zinc-300 bg-white text-zinc-900 px-3 py-2 text-sm focus:ring-2 focus:ring-[#755fe3]"
            required
            value={form.nomeCompleto}
            onChange={(e) => update("nomeCompleto", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-800">CPF</label>
          <input
            id="cpf"
            className="mt-1 w-full rounded-md border border-zinc-300 bg-white text-zinc-900 px-3 py-2 text-sm"
            required
            placeholder="000.000.000-00"
            value={form.cpf}
            onChange={(e) => handleCPFChange(e.target.value)}
            maxLength={14}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-800">
            Telefone
          </label>
          <input
            id="telefone"
            className="mt-1 w-full rounded-md border border-zinc-300 bg-white text-zinc-900 px-3 py-2 text-sm"
            required
            placeholder="(00) 00000-0000"
            value={form.telefone}
            onChange={(e) => update("telefone", maskPhone(e.target.value))}
            maxLength={15}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-800">
            E-mail
          </label>
          <input
            type="email"
            className="mt-1 w-full rounded-md border border-zinc-300 bg-white text-zinc-900 px-3 py-2 text-sm"
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
            className="mt-1 w-full rounded-md border border-zinc-300 bg-white text-zinc-900 px-3 py-2 text-sm"
            required
            value={form.dataNasc}
            onChange={(e) => update("dataNasc", e.target.value)}
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-zinc-800">
            Escolaridade
          </label>
          <select
            className="mt-1 w-full rounded-md border border-zinc-300 bg-white text-zinc-900 px-3 py-2 text-sm"
            value={form.escolaridade}
            onChange={(e) => update("escolaridade", e.target.value)}
            required
          >
            <option value="">Selecione...</option>
            <option value="Ensino Fundamental Incompleto">
              Ensino Fundamental Incompleto
            </option>
            <option value="Ensino Fundamental Completo">
              Ensino Fundamental Completo
            </option>
            <option value="Ensino Médio Incompleto">
              Ensino Médio Incompleto
            </option>
            <option value="Ensino Médio Completo">Ensino Médio Completo</option>
            <option value="Ensino Superior Incompleto">
              Ensino Superior Incompleto
            </option>
            <option value="Ensino Superior Completo">
              Ensino Superior Completo
            </option>
          </select>
        </div>

        {/* Tipos e Subtipos de Deficiência */}
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-zinc-800 mb-2">
            Tipo(s) de Deficiência (opcional)
          </label>
          <div className="border border-zinc-300 rounded-md bg-white p-3 max-h-64 overflow-y-auto">
            {tipos.length === 0 ? (
              <p className="text-sm text-zinc-500">Carregando tipos...</p>
            ) : (
              <div className="space-y-4">
                {tipos.map((tipo) => (
                  <div key={tipo.id} className="space-y-2">
                    <p className="font-medium text-zinc-900 text-sm">
                      {tipo.nome}
                    </p>
                    <div className="pl-4 space-y-2">
                      {tipo.subtipos.map((subtipo) => {
                        const isSelected = subtiposSelecionados.some(
                          (s) => s.id === subtipo.id
                        );
                        return (
                          <div key={subtipo.id} className="space-y-1">
                            <label className="flex items-center gap-2 cursor-pointer hover:bg-zinc-50 p-2 rounded">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSubtiposSelecionados([
                                      ...subtiposSelecionados,
                                      { id: subtipo.id },
                                    ]);
                                  } else {
                                    setSubtiposSelecionados(
                                      subtiposSelecionados.filter(
                                        (s) => s.id !== subtipo.id
                                      )
                                    );
                                    // Remove CID input
                                    const newCids = { ...cidInputs };
                                    delete newCids[subtipo.id];
                                    setCidInputs(newCids);
                                  }
                                }}
                                className="w-4 h-4 text-[#755fe3] border-zinc-300 rounded focus:ring-[#755fe3]"
                              />
                              <span className="text-sm text-zinc-900">
                                {subtipo.nome}
                              </span>
                            </label>
                            {isSelected && (
                              <div className="pl-8">
                                <input
                                  type="text"
                                  placeholder="CID (opcional)"
                                  value={cidInputs[subtipo.id] || ""}
                                  onChange={(e) => {
                                    const newCids = {
                                      ...cidInputs,
                                      [subtipo.id]: e.target.value,
                                    };
                                    setCidInputs(newCids);
                                    // Atualizar no array de selecionados
                                    setSubtiposSelecionados(
                                      subtiposSelecionados.map((s) =>
                                        s.id === subtipo.id
                                          ? {
                                              id: s.id,
                                              cid: e.target.value || undefined,
                                            }
                                          : s
                                      )
                                    );
                                  }}
                                  className="w-full text-xs rounded border border-zinc-300 px-2 py-1 focus:ring-1 focus:ring-[#755fe3]"
                                />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          {subtiposSelecionados.length > 0 && (
            <p className="mt-1 text-xs text-[#755fe3]">
              {subtiposSelecionados.length} subtipo(s) selecionado(s)
            </p>
          )}
        </div>

        {/* Barreiras */}
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-zinc-800 mb-2">
            Barreiras de Acessibilidade (opcional)
          </label>
          <div className="border border-zinc-300 rounded-md bg-white p-3 max-h-48 overflow-y-auto">
            {barreiras.length === 0 ? (
              <p className="text-sm text-zinc-500">Carregando barreiras...</p>
            ) : (
              <div className="space-y-2">
                {barreiras.map((barreira) => (
                  <label
                    key={barreira.id}
                    className="flex items-center gap-2 cursor-pointer hover:bg-zinc-50 p-2 rounded"
                  >
                    <input
                      type="checkbox"
                      checked={barreirasSelecionadas.includes(barreira.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setBarreirasSelecionadas([
                            ...barreirasSelecionadas,
                            barreira.id,
                          ]);
                        } else {
                          setBarreirasSelecionadas(
                            barreirasSelecionadas.filter(
                              (id) => id !== barreira.id
                            )
                          );
                        }
                      }}
                      className="w-4 h-4 text-[#755fe3] border-zinc-300 rounded focus:ring-[#755fe3]"
                    />
                    <span className="text-sm text-zinc-900">
                      {barreira.descricao}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>
          {barreirasSelecionadas.length > 0 && (
            <p className="mt-1 text-xs text-[#755fe3]">
              {barreirasSelecionadas.length} barreira(s) selecionada(s)
            </p>
          )}
        </div>

        {/* Endereço */}
        <div>
          <label className="block text-sm font-medium text-zinc-800">CEP</label>
          <input
            className="mt-1 w-full rounded-md border border-zinc-300 bg-white text-zinc-900 px-3 py-2 text-sm"
            required
            placeholder="00000-000"
            value={form.endereco.cep}
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
            className="mt-1 w-full rounded-md border border-zinc-300 bg-white text-zinc-900 px-3 py-2 text-sm"
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
            className="mt-1 w-full rounded-md border border-zinc-300 bg-white text-zinc-900 px-3 py-2 text-sm"
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
            className="mt-1 w-full rounded-md border border-zinc-300 bg-white text-zinc-900 px-3 py-2 text-sm"
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
            id="numero"
            className="mt-1 w-full rounded-md border border-zinc-300 bg-white text-zinc-900 px-3 py-2 text-sm"
            required
            inputMode="numeric"
            pattern="[0-9]*"
            value={form.endereco.numero}
            onChange={(e) =>
              update("endereco", {
                ...form.endereco,
                numero: e.target.value.replace(/\D/g, ""),
              })
            }
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-800">
            Bairro
          </label>
          <input
            className="mt-1 w-full rounded-md border border-zinc-300 bg-white text-zinc-900 px-3 py-2 text-sm"
            required
            value={form.endereco.bairro}
            onChange={(e) =>
              update("endereco", { ...form.endereco, bairro: e.target.value })
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
            className="mt-1 w-full rounded-md border border-zinc-300 bg-white text-zinc-900 px-3 py-2 text-sm"
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
            className="mt-1 w-full rounded-md border border-zinc-300 bg-white text-zinc-900 px-3 py-2 text-sm"
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
          {loading ? "Cadastrando..." : "Cadastrar"}
        </button>
      </form>
    </div>
  );
}
