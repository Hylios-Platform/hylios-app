import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = await res.text();
    const message = text ? JSON.parse(text).message : res.statusText;
    throw new Error(message);
  }
}

type RequestOptions = {
  onUploadProgress?: (progressEvent: { loaded: number; total: number; lengthComputable: boolean }) => void;
};

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
  options: RequestOptions = {}
): Promise<Response> {
  console.log(`[API] Fazendo requisição ${method} para ${url}`);
  console.log('[API] Headers:', {
    'Content-Type': data instanceof FormData ? undefined : 'application/json',
    'Credentials': 'include'
  });

  const res = await fetch(url, {
    method,
    headers: data instanceof FormData ? {} : { 
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: data instanceof FormData ? data : data ? JSON.stringify(data) : undefined,
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
      headers: {
        "Accept": "application/json"
      }
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