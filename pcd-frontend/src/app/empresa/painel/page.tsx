"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "../../../lib/api";
import { getAuth } from "../../../lib/auth";
import Link from "next/link";
import RequireAuth from "../../../components/RequireAuth";

type Empresa = {
 id: number;
 nomeFantasia: string;
 responsavelId: number | null;
 vagas?: {
 id: number;
 titulo: string;
 descricao?: string;
 escolaridade?: string | null;
 }[];
};

export default function PainelEmpresaPage() {
 const auth = getAuth();
 const token = auth?.token;
 const userId = auth?.usuario?.id ?? null;

 const [empresa, setEmpresa] = useState<Empresa | null>(null);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState<string | null>(null);

 const [titulo, setTitulo] = useState("");
 const [descricao, setDescricao] = useState("");
 const [escolaridade, setEscolaridade] = useState("");
 const [creating, setCreating] = useState(false);
 const [editingId, setEditingId] = useState<number | null>(null);
 const [editTitulo, setEditTitulo] = useState("");
 const [editDescricao, setEditDescricao] = useState("");
 const [editEscolaridade, setEditEscolaridade] = useState("");

 useEffect(() => {
 if (!userId || !token) {
 setLoading(false);
 return;
 }
 (async () => {
 try {
 const detalhe = await apiFetch<Empresa>(`/empresas/minha`, {
 authToken: token,
 });
 setEmpresa(detalhe);
 } catch (err) {
 setError(
 err instanceof Error ? err.message : "Erro ao carregar empresa"
 );
 } finally {
 setLoading(false);
 }
 })();
 }, [userId, token]);

 async function criarVaga(e: React.FormEvent) {
 e.preventDefault();
 if (!empresa) return;
 try {
 setCreating(true);
 await apiFetch("/vagas", {
 method: "POST",
 body: JSON.stringify({
 empresaId: empresa.id,
 titulo,
 descricao,
 escolaridade,
 }),
 authToken: token,
 });
 // refresh simples
 const detalhe = await apiFetch<Empresa>(`/empresas/${empresa.id}`);
 setEmpresa(detalhe);
 setTitulo("");
 setDescricao("");
 setEscolaridade("");
 } catch (err) {
 alert(err instanceof Error ? err.message : "Erro ao criar vaga");
 } finally {
 setCreating(false);
 }
 }

 async function iniciarEdicao(v: {
 id: number;
 titulo: string;
 descricao?: string;
 escolaridade?: string | null;
 }) {
 setEditingId(v.id);
 setEditTitulo(v.titulo || "");
 setEditDescricao(v.descricao || "");
 setEditEscolaridade(v.escolaridade || "");
 }

 async function salvarEdicao(e: React.FormEvent) {
 e.preventDefault();
 if (!editingId || !empresa) return;
 try {
 await apiFetch(`/vagas/${editingId}`, {
 method: "PUT",
 body: JSON.stringify({
 titulo: editTitulo,
 descricao: editDescricao,
 escolaridade: editEscolaridade,
 }),
 authToken: token,
 });
 const detalhe = await apiFetch<Empresa>(`/empresas/${empresa.id}`);
 setEmpresa(detalhe);
 setEditingId(null);
 } catch (err) {
 alert(err instanceof Error ? err.message : "Erro ao atualizar vaga");
 }
 }

 async function excluirVaga(id: number) {
 if (!empresa) return;
 const ok = confirm("Excluir esta vaga?");
 if (!ok) return;
 try {
 await apiFetch(`/vagas/${id}`, { method: "DELETE", authToken: token });
 const detalhe = await apiFetch<Empresa>(`/empresas/${empresa.id}`);
 setEmpresa(detalhe);
 } catch (err) {
 alert(err instanceof Error ? err.message : "Erro ao excluir vaga");
 }
 }

 if (!auth || auth.usuario.tipo !== "EMPRESA") {
 return <p>Faça login como Empresa para acessar o painel.</p>;
 }
 if (loading) return <p>Carregando...</p>;
 if (error) return <p className="text-red-600">{error}</p>;
 if (!empresa) return <p>Nenhuma empresa vinculada ao seu usuário.</p>;

 return (
 <RequireAuth role="EMPRESA">
 <div className="space-y-8">
 <section>
 <h1 className="text-2xl font-semibold text-zinc-900">
 Painel da Empresa
 </h1>
 <p className="text-sm text-zinc-600">{empresa.nomeFantasia}</p>
 </section>

 <section className="space-y-3">
 <h2 className="text-lg font-semibold text-zinc-900">Minhas Vagas</h2>
 <div className="space-y-2">
 {empresa.vagas?.map((v) => (
 <div
 key={v.id}
 className="rounded-lg border border-zinc-200 bg-white p-4"
 >
 <div className="flex items-center justify-between gap-2">
 <Link
 href={`/empresa/vagas/${v.id}`}
 className="font-medium text-zinc-900 hover:underline"
 >
 {v.titulo}
 </Link>
 <div className="flex items-center gap-2">
 <button
 onClick={() => iniciarEdicao(v)}
 className="rounded-md border border-zinc-300 px-3 py-1 text-sm hover:bg-zinc-50"
 >
 Editar
 </button>
 <button
 onClick={() => excluirVaga(v.id)}
 className="rounded-md bg-red-600 px-3 py-1 text-sm text-white hover:opacity-95"
 >
 Excluir
 </button>
 </div>
 </div>

 {editingId === v.id && (
 <form onSubmit={salvarEdicao} className="mt-3 space-y-2">
 <input
 className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
 value={editTitulo}
 onChange={(e) => setEditTitulo(e.target.value)}
 />
 <textarea
 className="w-full rounded-md border border-zinc-300 p-2 text-sm"
 rows={4}
 value={editDescricao}
 onChange={(e) => setEditDescricao(e.target.value)}
 />
 <input
 className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
 placeholder="Escolaridade (opcional)"
 value={editEscolaridade}
 onChange={(e) => setEditEscolaridade(e.target.value)}
 />
 <div className="flex items-center gap-2">
 <button className="rounded-md bg-emerald-600 px-3 py-1 text-sm text-white hover:opacity-95">
 Salvar
 </button>
 <button
 type="button"
 onClick={() => setEditingId(null)}
 className="rounded-md border border-zinc-300 px-3 py-1 text-sm hover:bg-zinc-50"
 >
 Cancelar
 </button>
 </div>
 </form>
 )}
 </div>
 ))}
 {(!empresa.vagas || empresa.vagas.length === 0) && (
 <p className="text-zinc-600">Nenhuma vaga cadastrada.</p>
 )}
 </div>
 </section>

 <section>
 <h2 className="mb-2 text-lg font-semibold text-zinc-900">
 Criar nova vaga
 </h2>
 <form onSubmit={criarVaga} className="space-y-3">
 <div>
 <label className="block text-sm font-medium text-zinc-800">
 Título
 </label>
 <input
 className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
 required
 value={titulo}
 onChange={(e) => setTitulo(e.target.value)}
 />
 </div>
 <div>
 <label className="block text-sm font-medium text-zinc-800">
 Descrição
 </label>
 <textarea
 className="mt-1 w-full rounded-md border border-zinc-300 p-2 text-sm"
 rows={5}
 required
 value={descricao}
 onChange={(e) => setDescricao(e.target.value)}
 />
 </div>
 <div>
 <label className="block text-sm font-medium text-zinc-800">
 Escolaridade (opcional)
 </label>
 <input
 className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
 value={escolaridade}
 onChange={(e) => setEscolaridade(e.target.value)}
 />
 </div>
 <button
 disabled={creating}
 className="rounded-md bg-[#755fe3] px-4 py-2 text-white hover:opacity-95 disabled:opacity-60"
 >
 {creating ? "Criando..." : "Criar vaga"}
 </button>
 </form>
 </section>
 </div>
 </RequireAuth>
 );
}
