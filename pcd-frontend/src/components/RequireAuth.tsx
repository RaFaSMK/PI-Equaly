"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAuth } from "../lib/auth";

type Props = {
  role?: "PCD" | "EMPRESA";
  children: ReactNode;
  redirectTo?: string;
};

export default function RequireAuth({
  role,
  children,
  redirectTo = "/login",
}: Props) {
  const router = useRouter();
  const auth = getAuth();

  const ok = Boolean(auth?.token) && (!role || auth?.usuario?.tipo === role);

  useEffect(() => {
    if (!ok) router.push(redirectTo);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ok]);

  if (!ok) {
    return <p className="text-zinc-700">Redirecionando para login...</p>;
  }
  return <>{children}</>;
}
