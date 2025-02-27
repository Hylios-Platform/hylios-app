import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = await res.text();
    const message = text ? JSON.parse(text).message : res.statusText;
    throw new Error(message);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  console.log(`[API] Fazendo requisição ${method} para ${url}`);
  console.log('[API] Headers:', {
    'Content-Type': data ? 'application/json' : undefined,
    'Credentials': 'include'
  });

  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include", // Importante: envia cookies de autenticação
  });

  console.log('[API] Resposta status:', res.status);
  console.log('[API] Resposta headers:', Object.fromEntries(res.headers.entries()));

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    console.log(`[API] Fazendo consulta para ${queryKey[0]}`);
    const res = await fetch(queryKey[0] as string, {
      credentials: "include", // Importante: envia cookies de autenticação
    });

    console.log(`[API] Status da resposta: ${res.status}`);
    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      console.log("[API] Usuário não autenticado, retornando null");
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});