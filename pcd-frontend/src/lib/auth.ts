export type AuthPayload = {
 token: string;
 usuario: {
 id: number;
 nome: string;
 email: string;
 tipo: string; // "PCD" | "EMPRESA" | etc.
 empresaId?: number | null;
 pcdId?: number | null;
 };
 // opcionalmente manter pcdId quando conhecido (ex.: após cadastro)
 pcdId?: number | null;
};

const KEY = "eq-auth";

export function getAuth(): AuthPayload | null {
 if (typeof window === "undefined") return null;
 const raw = localStorage.getItem(KEY);
 if (!raw) return null;
 try {
 return JSON.parse(raw) as AuthPayload;
 } catch {
 return null;
 }
}

export function setAuth(value: AuthPayload) {
 if (typeof window === "undefined") return;
 localStorage.setItem(KEY, JSON.stringify(value));
}

export function clearAuth() {
 if (typeof window === "undefined") return;
 localStorage.removeItem(KEY);
}

export function setPcdId(pcdId: number) {
 const current = getAuth();
 if (!current) return;
 setAuth({ ...current, pcdId });
}
