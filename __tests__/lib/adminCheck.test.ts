import { isAdmin, isAdminByRole } from '@/lib/adminCheck';

describe('adminCheck', () => {
  describe('isAdmin', () => {
    it('should return true for admin email', () => {
      const adminUser = {
        id: 'admin-id',
        email: 'mckee80@hotmail.com',
      } as any;

      expect(isAdmin(adminUser)).toBe(true);
    });

    it('should be case insensitive', () => {
      const adminUser = {
        id: 'admin-id',
        email: 'MCKEE80@HOTMAIL.COM',
      } as any;

      expect(isAdmin(adminUser)).toBe(true);
    });

    it('should return false for non-admin user', () => {
      const regularUser = {
        id: 'user-id',
        email: 'test@example.com',
      } as any;

      expect(isAdmin(regularUser)).toBe(false);
    });

    it('should return false when user is null', () => {
      expect(isAdmin(null)).toBe(false);
    });

    it('should return false when user has no email', () => {
      const userWithoutEmail = {
        id: 'user-id',
      } as any;

      expect(isAdmin(userWithoutEmail)).toBe(false);
    });
  });

  describe('isAdminByRole', () => {
    it('should return true when user has admin role', () => {
      const adminUser = {
        id: 'admin-id',
        email: 'test@example.com',
        user_metadata: {
          role: 'admin',
        },
      } as any;

      expect(isAdminByRole(adminUser)).toBe(true);
    });

    it('should return false when user does not have admin role', () => {
      const regularUser = {
        id: 'user-id',
        email: 'test@example.com',
        user_metadata: {
          role: 'user',
        },
      } as any;

      expect(isAdminByRole(regularUser)).toBe(false);
    });

    it('should return false when user is null', () => {
      expect(isAdminByRole(null)).toBe(false);
    });

    it('should return false when user_metadata is missing', () => {
      const userWithoutMetadata = {
        id: 'user-id',
        email: 'test@example.com',
      } as any;

      expect(isAdminByRole(userWithoutMetadata)).toBe(false);
    });
  });
});
