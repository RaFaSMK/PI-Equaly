"use client";

import { useEffect, useState } from "react";
import { apiFetch, API_BASE_URL } from "../../lib/api";
import { FileText, Trash2, Upload } from "lucide-react";
import { getAuth, setPcdId } from "../../lib/auth";
import RequireAuth from "../../components/RequireAuth";
import { useToast } from "../../components/Toaster";

type Candidatura = {
  id: number;
  vagaId: number;
  pcdId: number;
  status: string;
  vaga?: { titulo?: string };
};

interface Barreira {
  id: number;
  descricao: string;
}

export default function DashboardPage() {
  const { show } = useToast();
  const [mounted, setMounted] = useState(false);
  const [auth, setAuth] = useState<ReturnType<typeof getAuth> | null>(null);
  const token = auth?.token;
  const [candidaturas, setCandidaturas] = useState<Candidatura[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [pcdId, setPcdIdState] = useState<number | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [curriculoUrl, setCurriculoUrl] = useState<string | null>(null);
  const [barreiras, setBarreiras] = useState<Barreira[]>([]);
  const [minhasBarreiras, setMinhasBarreiras] = useState<number[]>([]);
  const [loadingBarreiras, setLoadingBarreiras] = useState(false);
  const [tipos, setTipos] = useState<
    Array<{
      id: number;
      nome: string;
      subtipos: Array<{ id: number; nome: string }>;
    }>
  >([]);
  const [meusSubtipos, setMeusSubtipos] = useState<
    Array<{ id: number; cid?: string }>
  >([]);
  const [cidInputs, setCidInputs] = useState<Record<number, string>>({});
  const [loadingSubtipos, setLoadingSubtipos] = useState(false);

  useEffect(() => {
    // Executa apenas no cliente para evitar leitura de storage no SSR
    setMounted(true);
    setAuth(getAuth());
  }, []);

  useEffect(() => {
    if (auth?.pcdId) setPcdIdState(auth.pcdId);
  }, [auth]);

  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        const data = await apiFetch<Candidatura[]>("/candidaturas/pcd", {
          authToken: token,
        });
        setCandidaturas(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Erro ao carregar candidaturas"
        );
      }

      // Se ainda não sabemos o pcdId, tenta buscar via /pcd/me
      if (!pcdId) {
        try {
          const me = await apiFetch<{ data: { id: number } }>("/pcd/me", {
            authToken: token,
          });
          if (me?.data?.id) {
            setPcdIdState(me.data.id);
            setPcdId(me.data.id);
          }
        } catch {
          // silencioso: usuário pode ainda não ter perfil PCD
        }
      }

      // Carregar barreiras e tipos disponíveis
      try {
        const [barr, tiposRes] = await Promise.all([
          apiFetch<{ data: Barreira[] }>("/barreiras"),
          apiFetch<{
            data: Array<{
              id: number;
              nome: string;
              subtipos: Array<{ id: number; nome: string }>;
            }>;
          }>("/tipos"),
        ]);
        setBarreiras(barr.data);
        // Normaliza garantindo subtipos como array
        setTipos(
          tiposRes.data.map((t) => ({
            ...t,
            subtipos: Array.isArray(t.subtipos) ? t.subtipos : [],
          }))
        );
      } catch {
        // silencioso
      }

      // Carregar currículo atual
      try {
        const cur = await apiFetch<{ curriculoUrl: string }>("/pcd/curriculo", {
          authToken: token,
        });
        setCurriculoUrl(cur.curriculoUrl);
      } catch {
        setCurriculoUrl(null);
      }
    })();
  }, [token, pcdId]);

  // Carregar minhas barreiras e subtipos quando pcdId estiver disponível
  useEffect(() => {
    if (!pcdId || !token) return;
    (async () => {
      try {
        const me = await apiFetch<{
          data: {
            id: number;
            barreiras?: Array<{ id: number }>;
            subtipoPcd?: Array<{ subtipoId: number; cid?: string }>;
          };
        }>(`/pcd/me`, {
          authToken: token,
        });
        if (me?.data?.barreiras) {
          setMinhasBarreiras(me.data.barreiras.map((b) => b.id));
        }
        if (me?.data?.subtipoPcd) {
          const subtipos = me.data.subtipoPcd.map((s) => ({
            id: s.subtipoId,
            cid: s.cid || undefined,
          }));
          setMeusSubtipos(subtipos);
          // Preencher CIDs existentes
          const cids: Record<number, string> = {};
          subtipos.forEach((s) => {
            if (s.cid) cids[s.id] = s.cid;
          });
          setCidInputs(cids);
        }
      } catch {
        // silencioso
      }
    })();
  }, [pcdId, token]);

  const statusBadge = (s: string) => (
    <span className="rounded bg-zinc-100 px-2 py-0.5 text-xs text-zinc-800">
      {s}
    </span>
  );

  async function uploadCurriculo() {
    if (!token || !file) return;
    try {
      setUploading(true);
      const fd = new FormData();
      fd.append("curriculo", file);
      await apiFetch("/pcd/curriculo", {
        method: "POST",
        body: fd,
        authToken: token,
      });
      // Atualiza a URL atual
      try {
        const cur = await apiFetch<{ curriculoUrl: string }>("/pcd/curriculo", {
          authToken: token,
        });
        setCurriculoUrl(cur.curriculoUrl);
      } catch {}
      setFile(null); // Limpa o input de arquivo
      show("Currículo enviado com sucesso!", "success");
    } catch (err) {
      show(err instanceof Error ? err.message : "Erro no upload", "error");
    } finally {
      setUploading(false);
    }
  }

  async function deletarCurriculo() {
    if (!token) return;
    try {
      await apiFetch(`/pcd/curriculo`, {
        method: "DELETE",
        authToken: token,
      });
      setCurriculoUrl(null);
      setFile(null); // Limpa o input de arquivo
      show("Currículo removido", "success");
    } catch (err) {
      show(
        err instanceof Error ? err.message : "Erro ao remover currículo",
        "error"
      );
    }
  }

  async function toggleBarreira(barreiraId: number) {
    if (!pcdId || !token) {
      show("Aguarde identificação do perfil PCD", "error");
      return;
    }

    setLoadingBarreiras(true);
    try {
      const novasBarreiras = minhasBarreiras.includes(barreiraId)
        ? minhasBarreiras.filter((id) => id !== barreiraId)
        : [...minhasBarreiras, barreiraId];

      await apiFetch(`/pcd/${pcdId}/barreiras`, {
        method: "PUT",
        body: JSON.stringify({ barreiraIds: novasBarreiras }),
        authToken: token,
      });

      setMinhasBarreiras(novasBarreiras);
      show(
        minhasBarreiras.includes(barreiraId)
          ? "Barreira removida com sucesso!"
          : "Barreira adicionada com sucesso!",
        "success"
      );
    } catch (err: any) {
      show(err.message || "Erro ao atualizar barreiras", "error");
    } finally {
      setLoadingBarreiras(false);
    }
  }

  async function salvarSubtipos() {
    if (!pcdId || !token) {
      show("Aguarde identificação do perfil PCD", "error");
      return;
    }

    setLoadingSubtipos(true);
    try {
      await apiFetch(`/pcd/${pcdId}/subtipos`, {
        method: "PUT",
        body: JSON.stringify({ subtipoIds: meusSubtipos }),
        authToken: token,
      });

      show("Subtipos atualizados com sucesso!", "success");
    } catch (err: any) {
      show(err.message || "Erro ao atualizar subtipos", "error");
    } finally {
      setLoadingSubtipos(false);
    }
  }

  // Evita mismatch: nada é renderizado até montar e obter auth
  if (!mounted) return null;
  if (!token) return <p>Faça login para acessar seu painel.</p>;

  return (
    <RequireAuth role="PCD">
      <div className="space-y-8">
        <section>
          <h1 className="mb-4 text-2xl font-semibold text-zinc-900">
            Minhas Candidaturas
          </h1>
          {error && <p className="text-red-600">{error}</p>}
          <div className="space-y-3">
            {candidaturas.map((c) => (
              <div
                key={c.id}
                className="rounded-lg border border-zinc-200 bg-white p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-sm text-zinc-600">Vaga</p>
                    <p className="text-zinc-900">{c.vaga?.titulo}</p>
                  </div>
                  <div>{statusBadge(c.status)}</div>
                </div>
              </div>
            ))}
            {candidaturas.length === 0 && (
              <p className="text-zinc-600">
                Você ainda não se candidatou a nenhuma vaga.
              </p>
            )}
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-lg font-semibold text-zinc-900">
            Meus Tipos de Deficiência
          </h2>
          {!pcdId ? (
            <p className="text-sm text-zinc-600 mb-4">
              Seu perfil PCD será identificado automaticamente após o cadastro.
            </p>
          ) : (
            <>
              <p className="text-sm text-zinc-600 mb-4">
                Selecione os subtipos de deficiência que você possui e informe o
                CID, se desejar.
              </p>
              <div className="bg-white rounded-lg border border-zinc-200 p-4">
                {tipos.length === 0 ? (
                  <p className="text-zinc-500 text-sm">
                    Nenhum tipo cadastrado ainda.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {tipos.map((tipo) => (
                      <div key={tipo.id} className="space-y-2">
                        <p className="font-medium text-zinc-900 text-sm">
                          {tipo.nome}
                        </p>
                        <div className="pl-4 space-y-2">
                          {(tipo.subtipos || []).map((subtipo) => {
                            const isSelected = meusSubtipos.some(
                              (s) => s.id === subtipo.id
                            );
                            return (
                              <div key={subtipo.id} className="space-y-1">
                                <label className="flex items-center gap-3 p-2 border border-zinc-200 rounded-md hover:bg-zinc-50 cursor-pointer transition-colors">
                                  <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setMeusSubtipos([
                                          ...meusSubtipos,
                                          { id: subtipo.id },
                                        ]);
                                      } else {
                                        setMeusSubtipos(
                                          meusSubtipos.filter(
                                            (s) => s.id !== subtipo.id
                                          )
                                        );
                                        // Remove CID input
                                        const newCids = { ...cidInputs };
                                        delete newCids[subtipo.id];
                                        setCidInputs(newCids);
                                      }
                                    }}
                                    disabled={loadingSubtipos}
                                    className="w-4 h-4 text-[#755fe3] border-zinc-300 rounded focus:ring-[#755fe3] disabled:opacity-50"
                                  />
                                  <span className="text-sm text-zinc-900 flex-1">
                                    {subtipo.nome}
                                  </span>
                                </label>
                                {isSelected && (
                                  <div className="pl-8">
                                    <input
                                      type="text"
                                      placeholder="CID (opcional, ex: G80.0)"
                                      value={cidInputs[subtipo.id] || ""}
                                      onChange={(e) => {
                                        const newCids = {
                                          ...cidInputs,
                                          [subtipo.id]: e.target.value,
                                        };
                                        setCidInputs(newCids);
                                        // Atualizar no array
                                        setMeusSubtipos(
                                          meusSubtipos.map((s) =>
                                            s.id === subtipo.id
                                              ? {
                                                  id: s.id,
                                                  cid:
                                                    e.target.value || undefined,
                                                }
                                              : s
                                          )
                                        );
                                      }}
                                      disabled={loadingSubtipos}
                                      className="w-full text-sm rounded border border-zinc-300 px-3 py-1.5 focus:ring-1 focus:ring-[#755fe3] disabled:opacity-50"
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
                {meusSubtipos.length > 0 && (
                  <button
                    onClick={salvarSubtipos}
                    disabled={loadingSubtipos}
                    className="mt-4 w-full sm:w-auto px-4 py-2 bg-[#755fe3] text-white rounded-md hover:opacity-90 disabled:opacity-50 text-sm font-medium transition-opacity"
                  >
                    {loadingSubtipos ? "Salvando..." : "Salvar Subtipos"}
                  </button>
                )}
              </div>
            </>
          )}
        </section>

        <section>
          <h2 className="mb-4 text-lg font-semibold text-zinc-900">
            Minhas Barreiras de Acessibilidade
          </h2>
          {!pcdId ? (
            <p className="text-sm text-zinc-600 mb-4">
              Seu perfil PCD será identificado automaticamente após o cadastro.
            </p>
          ) : (
            <>
              <p className="text-sm text-zinc-600 mb-4">
                Selecione as barreiras que você enfrenta para melhorar a
                compatibilidade com vagas.
              </p>
              <div className="bg-white rounded-lg border border-zinc-200 p-4">
                {barreiras.length === 0 ? (
                  <p className="text-zinc-500 text-sm">
                    Nenhuma barreira cadastrada ainda.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {barreiras.map((barreira) => (
                      <label
                        key={barreira.id}
                        className="flex items-center gap-3 p-3 border border-zinc-200 rounded-md hover:bg-zinc-50 cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={minhasBarreiras.includes(barreira.id)}
                          onChange={() => toggleBarreira(barreira.id)}
                          disabled={loadingBarreiras}
                          className="w-4 h-4 text-[#755fe3] border-zinc-300 rounded focus:ring-[#755fe3] disabled:opacity-50"
                        />
                        <span className="text-sm text-zinc-900 flex-1">
                          {barreira.descricao}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
                {loadingBarreiras && (
                  <div className="mt-4 text-center">
                    <div className="inline-block w-5 h-5 border-2 border-[#755fe3] border-t-transparent rounded-full animate-spin"></div>
                    <span className="ml-2 text-sm text-zinc-600">
                      Atualizando...
                    </span>
                  </div>
                )}
              </div>
            </>
          )}
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-zinc-900">
            Currículo (PDF)
          </h2>
          <div className="rounded-lg border border-zinc-200 bg-white p-4 space-y-3">
            {curriculoUrl ? (
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-sm text-zinc-800">
                  <FileText className="w-4 h-4 text-zinc-700" aria-hidden />
                  <span>Um currículo está salvo na sua conta.</span>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={`${API_BASE_URL}${curriculoUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm text-zinc-800 hover:bg-zinc-50"
                  >
                    Abrir PDF
                  </a>
                  <button
                    onClick={deletarCurriculo}
                    className="inline-flex items-center gap-1.5 rounded-md bg-red-600 px-3 py-1.5 text-sm text-white hover:opacity-95"
                  >
                    <Trash2 className="w-4 h-4" aria-hidden />
                    Remover
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-zinc-600">
                Nenhum currículo enviado ainda.
              </p>
            )}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <input
                key={file ? "with-file" : "no-file"}
                type="file"
                accept="application/pdf"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="w-full rounded-md border border-zinc-300 p-2 text-sm"
              />
              <button
                disabled={!file || uploading}
                onClick={uploadCurriculo}
                className="inline-flex items-center gap-1.5 rounded-md bg-[#755fe3] px-4 py-2 text-white hover:opacity-95 disabled:opacity-60"
              >
                <Upload className="w-4 h-4" aria-hidden />
                {uploading
                  ? "Enviando..."
                  : curriculoUrl
                  ? "Substituir"
                  : "Enviar"}
              </button>
            </div>
            <p className="text-xs text-zinc-500">
              Tamanho máximo: 5MB. Formato: PDF.
            </p>
          </div>
        </section>
      </div>
    </RequireAuth>
  );
}
