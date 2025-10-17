/**
 * Role utilities and types for simple RBAC across the app.
 */

export type UserRole = 'admin' | 'user'

export const DEFAULT_ROLE: UserRole = 'user'

export function isAdminRole(role: UserRole | undefined | null): boolean {
  return role === 'admin'
}

export function hasRole(role: UserRole | undefined | null, required: UserRole): boolean {
  if (!role) return false
  if (required === 'user') return true
  return role === required
}


