import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";

export type UserPermissions = {
  isAuthenticated: boolean;
  isAdmin: boolean;
  isVendor: boolean;
  isPropertyOwner: boolean;
  isGuest: boolean;
  role: string | null;
  canApproveReject: boolean;
  canManageProperties: boolean;
  canManageVendors: boolean;
  canAccessAdminPanel: boolean;
  canBookProperties: boolean;
  canViewPropertyDetails: boolean;
  canManageOwnBookings: boolean;
};

const defaultPermissions: UserPermissions = {
  isAuthenticated: false,
  isAdmin: false,
  isVendor: false,
  isPropertyOwner: false,
  isGuest: false,
  role: null,
  canApproveReject: false,
  canManageProperties: false,
  canManageVendors: false,
  canAccessAdminPanel: false,
  canBookProperties: false,
  canViewPropertyDetails: false,
  canManageOwnBookings: false,
};

export function usePermissions() {
  const { data: permissions, isLoading, error } = useQuery<UserPermissions>({
    queryKey: ["/api/user/permissions"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    initialData: defaultPermissions,
    refetchOnWindowFocus: true
  });

  return {
    permissions: permissions || defaultPermissions,
    isLoading,
    error,
  };
}