import { createContext, ReactNode, useContext } from "react";
import {
  useQuery,
  useMutation,
  UseMutationResult,
} from "@tanstack/react-query";
import { insertUserSchema, User as SelectUser, InsertUser } from "@shared/schema";
import { getQueryFn, apiRequest, queryClient } from "../lib/queryClient";
import { useToast } from "@/hooks/use-toast";

type AuthContextType = {
  user: SelectUser | null;
  isLoading: boolean;
  error: Error | null;
  loginMutation: UseMutationResult<Omit<SelectUser, "password">, Error, LoginData>;
  logoutMutation: UseMutationResult<void, Error, void>;
  registerMutation: UseMutationResult<Omit<SelectUser, "password">, Error, InsertUser>;
};

type LoginData = Pick<InsertUser, "username" | "password">;

export const AuthContext = createContext<AuthContextType | null>(null);
export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const {
    data: user,
    error,
    isLoading,
  } = useQuery<SelectUser | null, Error>({
    queryKey: ["/api/user"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    staleTime: 0, // Don't cache auth state
    refetchOnWindowFocus: true, // Refresh when window is focused
    refetchOnMount: true, // Always refetch on mount
    retry: 1, // Only retry once
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginData) => {
      console.log("[Auth] Attempting login for:", credentials.username);
      const res = await apiRequest("POST", "/api/login", credentials);
      const userData = await res.json();
      console.log("[Auth] Login successful, received user data:", { ...userData, password: "REDACTED" });
      return userData;
    },
    onSuccess: (user: Omit<SelectUser, "password">) => {
      console.log("[Auth] Setting user data in query cache");
      queryClient.setQueryData(["/api/user"], user);
      console.log("[Auth] Invalidating user query to trigger refetch");
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${user.fullName}!`,
      });
    },
    onError: (error: Error) => {
      console.error("[Auth] Login failed:", error);
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (userData: InsertUser) => {
      console.log("[Auth] Attempting registration for:", userData.username);
      const res = await apiRequest("POST", "/api/register", userData);
      const newUser = await res.json();
      console.log("[Auth] Registration successful, received user data:", { ...newUser, password: "REDACTED" });
      return newUser;
    },
    onSuccess: (user: Omit<SelectUser, "password">) => {
      console.log("[Auth] Setting newly registered user data in query cache");
      queryClient.setQueryData(["/api/user"], user);
      console.log("[Auth] Invalidating user query to trigger refetch");
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      
      toast({
        title: "Registration successful",
        description: `Welcome to Argento Homes, ${user.fullName}!`,
      });
    },
    onError: (error: Error) => {
      console.error("[Auth] Registration failed:", error);
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      console.log("[Auth] Attempting logout");
      await apiRequest("POST", "/api/logout");
      console.log("[Auth] Logout API call successful");
    },
    onSuccess: () => {
      console.log("[Auth] Setting user data to null in query cache");
      queryClient.setQueryData(["/api/user"], null);
      console.log("[Auth] Invalidating all queries to refresh UI state");
      queryClient.invalidateQueries();
      
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    },
    onError: (error: Error) => {
      console.error("[Auth] Logout failed:", error);
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        isLoading,
        error,
        loginMutation,
        logoutMutation,
        registerMutation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
