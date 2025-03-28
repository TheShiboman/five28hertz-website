import { Request, Response, NextFunction } from 'express';
import { UserRole } from '@shared/schema';

/**
 * Check if a role is admin (either ADMIN or DEVELOPER) in a case-insensitive way
 */
export const hasAdminRole = (role?: string): boolean => {
  if (!role) {
    console.log(`[hasAdminRole] No role provided, returning false`);
    return false;
  }
  console.log(`[hasAdminRole] Checking role: "${role}"`);
  const userRole = role.toLowerCase();
  const isAdmin = userRole === UserRole.ADMIN.toLowerCase() || userRole === UserRole.DEVELOPER.toLowerCase();
  console.log(`[hasAdminRole] Role "${role}" (lowercase: "${userRole}") compared to Admin: "${UserRole.ADMIN}" and Developer: "${UserRole.DEVELOPER}"`);
  console.log(`[hasAdminRole] Result: ${isAdmin}`);
  return isAdmin;
};

/**
 * Check if a role is vendor in a case-insensitive way
 */
export const hasVendorRole = (role?: string): boolean => {
  if (!role) return false;
  return role.toLowerCase() === UserRole.VENDOR.toLowerCase();
};

/**
 * Check if a role is property owner in a case-insensitive way
 */
export const hasPropertyOwnerRole = (role?: string): boolean => {
  if (!role) return false;
  return role.toLowerCase() === UserRole.PROPERTY_OWNER.toLowerCase();
};

/**
 * Check if a role is guest in a case-insensitive way
 */
export const hasGuestRole = (role?: string): boolean => {
  if (!role) return false;
  return role.toLowerCase() === UserRole.GUEST.toLowerCase();
};

/**
 * Middleware to check if user is authenticated
 */
export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Not authenticated" });
};

/**
 * Middleware to check if user has admin role
 */
export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  
  if (!hasAdminRole(req.user?.role)) {
    return res.status(403).json({ message: "Access denied. Admin role required." });
  }
  
  next();
};

/**
 * Middleware to check if user has vendor role
 */
export const isVendor = (req: Request, res: Response, next: NextFunction) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  
  if (!hasVendorRole(req.user?.role)) {
    return res.status(403).json({ message: "Access denied. Vendor role required." });
  }
  
  next();
};

/**
 * Middleware to check if user has property owner role
 */
export const isPropertyOwner = (req: Request, res: Response, next: NextFunction) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  
  if (!hasPropertyOwnerRole(req.user?.role)) {
    return res.status(403).json({ message: "Access denied. Property Owner role required." });
  }
  
  next();
};

/**
 * Middleware to check if user has guest role
 */
export const isGuest = (req: Request, res: Response, next: NextFunction) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  
  if (!hasGuestRole(req.user?.role)) {
    return res.status(403).json({ message: "Access denied. Guest role required." });
  }
  
  next();
};

/**
 * Middleware to check if user has guest or property owner role (for booking-related operations)
 * Also allows admin users to perform these operations
 */
export const isGuestOrPropertyOwner = (req: Request, res: Response, next: NextFunction) => {
  if (!req.isAuthenticated()) {
    console.log(`[isGuestOrPropertyOwner] User not authenticated`);
    return res.status(401).json({ message: "Not authenticated" });
  }
  
  console.log(`[isGuestOrPropertyOwner] Checking role: "${req.user?.role}"`);
  
  // Check if user has any of the allowed roles: guest, property owner, or admin
  const isGuest = hasGuestRole(req.user?.role);
  const isPropertyOwner = hasPropertyOwnerRole(req.user?.role);
  const isAdmin = hasAdminRole(req.user?.role);
  
  console.log(`[isGuestOrPropertyOwner] User role checks - Guest: ${isGuest}, PropertyOwner: ${isPropertyOwner}, Admin: ${isAdmin}`);
  
  if (!isGuest && !isPropertyOwner && !isAdmin) {
    console.log(`[isGuestOrPropertyOwner] Access denied for user with role: ${req.user?.role}`);
    return res.status(403).json({ message: "Access denied. Guest, Property Owner, or Admin role required." });
  }
  
  console.log(`[isGuestOrPropertyOwner] Access granted for user with role: ${req.user?.role}`);
  next();
};