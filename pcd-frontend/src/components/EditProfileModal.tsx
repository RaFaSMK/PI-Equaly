"use client";

import { useState, useEffect } from "react";
import { getAuth } from "@/lib/auth";
import { apiFetch } from "@/lib/api";
import { useToast } from "./Toaster";
import { X } from "lucide-react";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PcdData {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  dataNasc: string;
  escolaridade: string;
  curriculoUrl: string | null;
  endereco: {
    rua: string;
    numero: string;
    complemento: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
  } | null;
}

export default function EditProfileModal({
  isOpen,
  onClose,
}: EditProfileModalProps) {
  const { show } = useToast();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    cpf: "",
    dataNasc: "",
    escolaridade: "",
    rua: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
    cep: "",
  });

  useEffect(() => {
    if (isOpen) {
      loadPcdData();
    }
  }, [isOpen]);

  async function loadPcdData() {
    setLoading(true);
    try {
      const auth = getAuth();
      if (!auth?.token) {
        show("Não autenticado", "error");
        return;
      }

      const response = await apiFetch<{ data: PcdData }>("/pcd/me", {
        authToken: auth.token,
      });

      const pcd = response.data;
      setFormData({
        nome: pcd.nome || "",
        email: pcd.email || "",
        telefone: pcd.telefone || "",
        cpf: pcd.cpf || "",
        dataNasc: pcd.dataNasc
          ? new Date(pcd.dataNasc).toISOString().split("T")[0]
          : "",
        escolaridade: pcd.escolaridade || "",
        rua: pcd.endereco?.rua || "",
        numero: pcd.endereco?.numero || "",
        complemento: pcd.endereco?.complemento || "",
        bairro: pcd.endereco?.bairro || "",
        cidade: pcd.endereco?.cidade || "",
        estado: pcd.endereco?.estado || "",
        cep: pcd.endereco?.cep || "",
      });
    } catch (error: any) {
      show(error.message || "Erro ao carregar dados", "error");
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implementar chamada à API para atualizar dados
    console.log("Dados a serem salvos:", formData);
    show("Funcionalidade de atualização em desenvolvimento", "info");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-zinc-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-zinc-900">Seus Dados</h2>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-600 transition-colors"
            aria-label="Fechar"
          >
            <X className="w-6 h-6" aria-hidden />
          </button>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 border-4 border-[#755fe3] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-zinc-600">Carregando dados...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-[#755fe3] flex items-center justify-center text-white font-semibold text-2xl">
                {formData.nome.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-zinc-900">{formData.nome}</p>
                <p className="text-sm text-zinc-500">{formData.email}</p>
              </div>
            </div>

            <div>
              <label
                htmlFor="nome"
                className="block text-sm font-medium text-zinc-700 mb-1"
              >
                Nome Completo
              </label>
              <input
                type="text"
                id="nome"
                value={formData.nome}
                onChange={(e) =>
                  setFormData({ ...formData, nome: e.target.value })
                }
                className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#755fe3] focus:border-transparent"
                required
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-zinc-700 mb-1"
              >
                E-mail
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                className="w-full px-3 py-2 border border-zinc-300 rounded-md bg-zinc-50 text-zinc-500 cursor-not-allowed"
                disabled
              />
              <p className="text-xs text-zinc-500 mt-1">
                O e-mail não pode ser alterado
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="cpf"
                  className="block text-sm font-medium text-zinc-700 mb-1"
                >
                  CPF
                </label>
                <input
                  type="text"
                  id="cpf"
                  value={formData.cpf}
                  className="w-full px-3 py-2 border border-zinc-300 rounded-md bg-zinc-50 text-zinc-500 cursor-not-allowed"
                  disabled
                />
              </div>

              <div>
                <label
                  htmlFor="telefone"
                  className="block text-sm font-medium text-zinc-700 mb-1"
                >
                  Telefone
                </label>
                <input
                  type="tel"
                  id="telefone"
                  value={formData.telefone}
                  onChange={(e) =>
                    setFormData({ ...formData, telefone: e.target.value })
                  }
                  placeholder="(00) 00000-0000"
                  className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#755fe3] focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="dataNasc"
                  className="block text-sm font-medium text-zinc-700 mb-1"
                >
                  Data de Nascimento
                </label>
                <input
                  type="date"
                  id="dataNasc"
                  value={formData.dataNasc}
                  onChange={(e) =>
                    setFormData({ ...formData, dataNasc: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#755fe3] focus:border-transparent"
                />
              </div>

              <div>
                <label
                  htmlFor="escolaridade"
                  className="block text-sm font-medium text-zinc-700 mb-1"
                >
                  Escolaridade
                </label>
                <select
                  id="escolaridade"
                  value={formData.escolaridade}
                  onChange={(e) =>
                    setFormData({ ...formData, escolaridade: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#755fe3] focus:border-transparent"
                >
                  <option value="">Selecione</option>
                  <option value="Fundamental Incompleto">
                    Fundamental Incompleto
                  </option>
                  <option value="Fundamental Completo">
                    Fundamental Completo
                  </option>
                  <option value="Médio Incompleto">Médio Incompleto</option>
                  <option value="Médio Completo">Médio Completo</option>
                  <option value="Superior Incompleto">
                    Superior Incompleto
                  </option>
                  <option value="Superior Completo">Superior Completo</option>
                  <option value="Pós-graduação">Pós-graduação</option>
                </select>
              </div>
            </div>

            <div className="border-t border-zinc-200 pt-4 mt-4">
              <h3 className="font-semibold text-zinc-900 mb-3">Endereço</h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                <div className="sm:col-span-2">
                  <label
                    htmlFor="cep"
                    className="block text-sm font-medium text-zinc-700 mb-1"
                  >
                    CEP
                  </label>
                  <input
                    type="text"
                    id="cep"
                    value={formData.cep}
                    onChange={(e) =>
                      setFormData({ ...formData, cep: e.target.value })
                    }
                    placeholder="00000-000"
                    className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#755fe3] focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-4">
                <div className="sm:col-span-3">
                  <label
                    htmlFor="rua"
                    className="block text-sm font-medium text-zinc-700 mb-1"
                  >
                    Rua
                  </label>
                  <input
                    type="text"
                    id="rua"
                    value={formData.rua}
                    onChange={(e) =>
                      setFormData({ ...formData, rua: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#755fe3] focus:border-transparent"
                  />
                </div>

                <div>
                  <label
                    htmlFor="numero"
                    className="block text-sm font-medium text-zinc-700 mb-1"
                  >
                    Número
                  </label>
                  <input
                    type="text"
                    id="numero"
                    value={formData.numero}
                    onChange={(e) =>
                      setFormData({ ...formData, numero: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#755fe3] focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label
                    htmlFor="complemento"
                    className="block text-sm font-medium text-zinc-700 mb-1"
                  >
                    Complemento
                  </label>
                  <input
                    type="text"
                    id="complemento"
                    value={formData.complemento}
                    onChange={(e) =>
                      setFormData({ ...formData, complemento: e.target.value })
                    }
                    placeholder="Opcional"
                    className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#755fe3] focus:border-transparent"
                  />
                </div>

                <div>
                  <label
                    htmlFor="bairro"
                    className="block text-sm font-medium text-zinc-700 mb-1"
                  >
                    Bairro
                  </label>
                  <input
                    type="text"
                    id="bairro"
                    value={formData.bairro}
                    onChange={(e) =>
                      setFormData({ ...formData, bairro: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#755fe3] focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="cidade"
                    className="block text-sm font-medium text-zinc-700 mb-1"
                  >
                    Cidade
                  </label>
                  <input
                    type="text"
                    id="cidade"
                    value={formData.cidade}
                    onChange={(e) =>
                      setFormData({ ...formData, cidade: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#755fe3] focus:border-transparent"
                  />
                </div>

                <div>
                  <label
                    htmlFor="estado"
                    className="block text-sm font-medium text-zinc-700 mb-1"
                  >
                    Estado
                  </label>
                  <select
                    id="estado"
                    value={formData.estado}
                    onChange={(e) =>
                      setFormData({ ...formData, estado: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#755fe3] focus:border-transparent"
                  >
                    <option value="">Selecione</option>
                    <option value="AC">AC</option>
                    <option value="AL">AL</option>
                    <option value="AP">AP</option>
                    <option value="AM">AM</option>
                    <option value="BA">BA</option>
                    <option value="CE">CE</option>
                    <option value="DF">DF</option>
                    <option value="ES">ES</option>
                    <option value="GO">GO</option>
                    <option value="MA">MA</option>
                    <option value="MT">MT</option>
                    <option value="MS">MS</option>
                    <option value="MG">MG</option>
                    <option value="PA">PA</option>
                    <option value="PB">PB</option>
                    <option value="PR">PR</option>
                    <option value="PE">PE</option>
                    <option value="PI">PI</option>
                    <option value="RJ">RJ</option>
                    <option value="RN">RN</option>
                    <option value="RS">RS</option>
                    <option value="RO">RO</option>
                    <option value="RR">RR</option>
                    <option value="SC">SC</option>
                    <option value="SP">SP</option>
                    <option value="SE">SE</option>
                    <option value="TO">TO</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-zinc-200">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2.5 border border-zinc-300 text-zinc-700 rounded-md hover:bg-zinc-50 transition-colors font-medium"
              >
                Fechar
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2.5 bg-[#755fe3] text-white rounded-md hover:opacity-90 transition-colors font-medium"
              >
                Salvar Alterações
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
