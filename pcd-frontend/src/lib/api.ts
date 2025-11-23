import axios, { AxiosError } from "axios";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333/api";

// Base sem o sufixo /api para arquivos estáticos (ex: /uploads/..)
export const API_BASE_URL = API_URL.replace(/\/+api$/i, "");

export const api = axios.create({ baseURL: API_URL });

export type ApiOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  headers?: Record<string, string>;
  authToken?: string;
};

export async function apiFetch<T = unknown>(
  path: string,
  options: ApiOptions = {}
): Promise<T> {
  const url = path.startsWith("/") ? path : `/${path}`;
  const isFormData =
    typeof FormData !== "undefined" && options.body instanceof FormData;

  try {
    const res = await api.request<T>({
      url,
      method: options.method || (options.body ? "POST" : "GET"),
      data: options.body,
      headers: {
        ...(options.headers || {}),
        ...(options.authToken
          ? { Authorization: `Bearer ${options.authToken}` }
          : {}),
        ...(!isFormData ? { "Content-Type": "application/json" } : {}),
      },
    });
    return res.data as T;
  } catch (err) {
    const ax = err as AxiosError<unknown>;
    const data = ax.response?.data as unknown;
    const msg =
      typeof data === "object" && data !== null && "error" in data
        ? (data as { error: string }).error
        : ax.message || "Erro na requisição";
    throw new Error(msg);
  }
}
