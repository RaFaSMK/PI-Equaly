"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "../../lib/api";
import { getAuth, setPcdId } from "../../lib/auth";
import RequireAuth from "../../components/RequireAuth";

type Candidatura = {
 id: number;
 vagaId: number;
 pcdId: number;
 status: string;
 vaga?: { titulo?: string };
};

export default function DashboardPage() {
 const auth = getAuth();
 const token = auth?.token;
 const [candidaturas, setCandidaturas] = useState<Candidatura[]>([]);
 const [error, setError] = useState<string | null>(null);
 const [pcdId, setPcdIdState] = useState<number | null>(auth?.pcdId ?? null);
 const [file, setFile] = useState<File | null>(null);
 const [uploading, setUploading] = useState(false);

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
 })();
 }, [token, pcdId]);

 const statusBadge = (s: string) => (
 <span className="rounded bg-zinc-100 px-2 py-0.5 text-xs text-zinc-800">
 {s}
 </span>
 );

 async function uploadCurriculo() {
 if (!token || !pcdId || !file) return;
 try {
 setUploading(true);
 const fd = new FormData();
 fd.append("curriculo", file);
 await apiFetch(`/pcd/${pcdId}/curriculo`, {
 method: "POST",
 body: fd,
 authToken: token,
 });
 alert("Currículo enviado!");
 } catch (err) {
 alert(err instanceof Error ? err.message : "Erro no upload");
 } finally {
 setUploading(false);
 }
 }

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
 <p className="text-sm text-zinc-600">
 Vaga
 </p>
 <p className="text-zinc-900">
 {c.vaga?.titulo}
 </p>
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
 <h2 className="mb-2 text-lg font-semibold text-zinc-900">
 Upload de Currículo (PDF)
 </h2>
 {!pcdId && (
 <p className="mb-2 text-sm text-zinc-600">
 Seu ID PCD será identificado automaticamente após a primeira
 candidatura ou cadastro.
 </p>
 )}
 <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
 <input
 type="file"
 accept="application/pdf"
 onChange={(e) => setFile(e.target.files?.[0] ?? null)}
 className="w-full rounded-md border border-zinc-300 p-2 text-sm"
 />
 <button
 disabled={!file || !pcdId || uploading}
 onClick={uploadCurriculo}
 className="rounded-md bg-[#755fe3] px-4 py-2 text-white hover:opacity-95 disabled:opacity-60"
 >
 {uploading ? "Enviando..." : "Enviar"}
 </button>
 </div>
 </section>
 </div>
 </RequireAuth>
 );
}
