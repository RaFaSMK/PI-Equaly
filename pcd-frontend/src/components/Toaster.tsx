"use client";

import { createContext, useContext, useMemo, useState } from "react";

export type Toast = {
 id: number;
 message: string;
 type?: "success" | "error" | "info";
};

type ToastCtx = {
 toasts: Toast[];
 show: (message: string, type?: Toast["type"]) => void;
 remove: (id: number) => void;
};

const Ctx = createContext<ToastCtx | null>(null);

export function ToasterProvider({ children }: { children: React.ReactNode }) {
 const [toasts, setToasts] = useState<Toast[]>([]);

 const api = useMemo<ToastCtx>(
 () => ({
 toasts,
 show: (message, type = "info") => {
 const id = Date.now() + Math.random();
 setToasts((prev) => [...prev, { id, message, type }]);
 // auto dismiss
 setTimeout(() => {
 setToasts((prev) => prev.filter((t) => t.id !== id));
 }, 3000);
 },
 remove: (id) => setToasts((prev) => prev.filter((t) => t.id !== id)),
 }),
 [toasts]
 );

 return (
 <Ctx.Provider value={api}>
 {children}
 {/* container */}
 <div
 className="fixed right-4 top-4 z-50 flex w-[92vw] max-w-sm flex-col gap-2 sm:w-full"
 role="status"
 aria-live="polite"
 >
 {toasts.map((t) => (
 <div
 key={t.id}
 className={`${
 t.type === "success"
 ? "border-emerald-600 bg-emerald-50 text-emerald-900"
 : t.type === "error"
 ? "border-red-600 bg-red-50 text-red-900"
 : "border-zinc-400 bg-zinc-50 text-zinc-900"
 } border rounded-md px-3 py-2 shadow-sm`}
 >
 <div className="flex items-start justify-between gap-3">
 <p className="text-sm">{t.message}</p>
 <button
 aria-label="Fechar"
 onClick={() => api.remove(t.id)}
 className="text-xs text-zinc-700 hover:underline"
 >
 Fechar
 </button>
 </div>
 </div>
 ))}
 </div>
 </Ctx.Provider>
 );
}

export function useToast() {
 const ctx = useContext(Ctx);
 if (!ctx)
 throw new Error("useToast deve ser usado dentro de ToasterProvider");
 return ctx;
}
