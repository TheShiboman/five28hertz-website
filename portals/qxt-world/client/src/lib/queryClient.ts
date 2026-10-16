import { QueryClient } from "@tanstack/react-query";
import { auth } from "./firebase";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${res.status}: ${text}`);
  }
}

async function getAuthHeaders() {
  const user = auth.currentUser;
  if (!user) {
    console.log('No current user found for auth headers');
    return {
      "Content-Type": "application/json"
    };
  }

  try {
    // Force token refresh to ensure we have a valid token
    const token = await user.getIdToken(true);
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  } catch (error) {
    console.error("Error getting Firebase token:", error);
    // Re-throw the error to be handled by the calling function
    throw new Error("Failed to get authentication token");
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  try {
    const headers = await getAuthHeaders();

    const res = await fetch(url, {
      method,
      headers,
      body: data ? JSON.stringify(data) : undefined,
      credentials: "include",
    });

    await throwIfResNotOk(res);
    return res;
  } catch (error) {
    console.error(`API request failed (${method} ${url}):`, error);
    throw error;
  }
}

type UnauthorizedBehavior = "returnNull" | "throw";

export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
    async ({ queryKey }) => {
      try {
        const headers = await getAuthHeaders();

        const res = await fetch(queryKey[0] as string, {
          headers,
          credentials: "include",
        });

        if (unauthorizedBehavior === "returnNull" && res.status === 401) {
          return null;
        }

        await throwIfResNotOk(res);
        return await res.json();
      } catch (error) {
        if (error instanceof Error && error.message.includes("Failed to get authentication token")) {
          if (unauthorizedBehavior === "returnNull") {
            return null;
          }
        }
        throw error;
      }
    };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});