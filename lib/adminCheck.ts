import { User } from '@supabase/supabase-js';

// List of admin email addresses
// In production, this should be stored in environment variables or database
const ADMIN_EMAILS = [
  'mckee80@hotmail.com', // Your admin email
];

/**
 * Checks if a user has admin privileges
 * @param user - The authenticated user object from Supabase
 * @returns true if user is an admin, false otherwise
 */
export function isAdmin(user: User | null): boolean {
  if (!user || !user.email) {
    return false;
  }

  return ADMIN_EMAILS.includes(user.email.toLowerCase());
}

/**
 * Checks if a user has admin role in their metadata
 * Alternative method using user metadata (for future use)
 */
export function isAdminByRole(user: User | null): boolean {
  if (!user) {
    return false;
  }

  return user.user_metadata?.role === 'admin';
}
