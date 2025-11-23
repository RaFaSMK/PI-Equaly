"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth } from "../lib/auth";

type Props = {
  role?: "PCD" | "EMPRESA" | "DESENVOLVEDOR" | "ADMIN";
  children: ReactNode;
  redirectTo?: string;
};

export default function RequireAuth({
  role,
  children,
  redirectTo = "/login",
}: Props) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const auth = getAuth();

  const ok = Boolean(auth?.token) && (!role || auth?.usuario?.tipo === role);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !ok) {
      router.push(redirectTo);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, ok]);

  if (!mounted) {
    // Renderiza um placeholder estável no SSR e na primeira pintura do cliente
    return <div aria-hidden />;
  }

  if (!ok) {
    // Após montar, exibe um feedback mínimo enquanto redireciona
    return <p className="text-zinc-700">Redirecionando...</p>;
  }
  return <>{children}</>;
}
