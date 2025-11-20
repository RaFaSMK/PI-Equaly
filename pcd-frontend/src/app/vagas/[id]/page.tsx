"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { apiFetch } from "../../../lib/api";
import { getAuth } from "../../../lib/auth";

type Vaga = {
 id: number;
 titulo: string;
 descricao: string;
 escolaridade?: string | null;
 empresa?: { id: number; nomeFantasia: string } | null;
};

export default function VagaDetalhePage() {
 const params = useParams<{ id: string }>();
 const router = useRouter();
 const id = Number(params.id);
 const [vaga, setVaga] = useState<Vaga | null>(null);
 const [mensagem, setMensagem] = useState("");
 const [error, setError] = useState<string | null>(null);
 const [loading, setLoading] = useState(true);
 const auth = getAuth();

 useEffect(() => {
 (async () => {
 try {
 const data = await apiFetch<{ data: Vaga }>(`/vagas/${id}`);
 setVaga(data.data);
 } catch (err) {
 setError(err instanceof Error ? err.message : "Erro ao carregar vaga");
 } finally {
 setLoading(false);
 }
 })();
 }, [id]);

 async function candidatar() {
 if (!auth?.token || auth.usuario.tipo !== "PCD") {
 router.push("/login");
 return;
 }
 try {
 await apiFetch("/candidaturas", {
 method: "POST",
 authToken: auth.token,
 body: JSON.stringify({ vagaId: id, mensagem }),
 });
 alert("Candidatura enviada!");
 router.push("/dashboard");
 } catch (err) {
 alert(err instanceof Error ? err.message : "Erro ao candidatar");
 }
 }

 if (loading) return <p className="">Carregando...</p>;
 if (error) return <p className="text-red-600">{error}</p>;
 if (!vaga) return <p className="">Vaga não encontrada</p>;

 return (
 <div className="space-y-4">
 <h1 className="text-2xl font-semibold text-zinc-900">
 {vaga.titulo}
 </h1>
 <p className="text-sm text-zinc-600">
 {vaga.empresa?.nomeFantasia}
 </p>
 <p className="whitespace-pre-wrap text-zinc-800">
 {vaga.descricao}
 </p>
 {vaga.escolaridade && (
 <div>
 <h3 className="text-sm font-medium">
 Escolaridade
 </h3>
 <p className="text-sm text-zinc-700">
 {vaga.escolaridade}
 </p>
 </div>
 )}

 {auth?.usuario?.tipo === "PCD" && (
 <div className="mt-6 space-y-2">
 <label className="block text-sm font-medium text-zinc-800">
 Mensagem opcional
 </label>
 <textarea
 value={mensagem}
 onChange={(e) => setMensagem(e.target.value)}
 rows={3}
 className="w-full rounded-md border border-zinc-300 bg-white text-zinc-900 p-2 text-sm focus:ring-2 focus:ring-[#755fe3]"
 />
 <button
 onClick={candidatar}
 className="rounded-md bg-[#755fe3] px-4 py-2 text-white hover:opacity-95"
 >
 Candidatar-se
 </button>
 </div>
 )}
 </div>
 );
}
