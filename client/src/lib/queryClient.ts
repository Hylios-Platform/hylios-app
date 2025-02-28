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

function getAuthToken() {
  return localStorage.getItem('auth_token');
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
  options: RequestOptions = {}
): Promise<Response> {
  const headers: Record<string, string> = {
    "Accept": "application/json"
  };

  if (!(data instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const token = getAuthToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  console.log(`[API] Fazendo requisição ${method} para ${url}`);
  console.log('[API] Headers:', headers);

  const res = await fetch(url, {
    method,
    headers,
    body: data instanceof FormData ? data : data ? JSON.stringify(data) : undefined
  });

  console.log('[API] Resposta status:', res.status);
  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const headers: Record<string, string> = {
      "Accept": "application/json"
    };

    const token = getAuthToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    console.log(`[API] Fazendo consulta para ${queryKey[0]}`);
    const res = await fetch(queryKey[0] as string, { headers });

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