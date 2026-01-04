'use client';

import { ProtectedRoute, useAuth } from '@/components';

export default function Account() {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <main className="min-h-screen p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold font-garamond mb-6 text-primary">
            My Account
          </h1>

          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold font-garamond mb-4 text-primary">
              Account Information
            </h2>
            <div className="space-y-3 font-crimson">
              <p>
                <strong>Email:</strong> {user?.email || 'Not available'}
              </p>
              <p>
                <strong>User ID:</strong> {user?.id || 'Not available'}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold font-garamond mb-4 text-primary">
              Settings
            </h2>
            <p className="font-crimson text-lg">
              Manage your account settings and preferences.
            </p>
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}
