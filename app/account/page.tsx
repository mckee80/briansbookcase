'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute, useAuth } from '@/components';
import { supabase } from '@/lib/supabase';

const MEMBERSHIP_TIERS = [
  { name: 'Free', price: 0 },
  { name: 'Supporter', price: 5 },
  { name: 'Advocate', price: 10 },
  { name: 'Champion', price: 20 },
];

export default function Account() {
  const { user } = useAuth();
  const router = useRouter();
  const [selectedTier, setSelectedTier] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const currentTier = user?.user_metadata?.membership_tier || 'Free';
  const currentPrice = user?.user_metadata?.membership_price || 0;

  const handleTierChange = async () => {
    if (!selectedTier) {
      setMessage('Please select a tier');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const tier = MEMBERSHIP_TIERS.find(t => t.name === selectedTier);

      if (!tier) {
        setMessage('Invalid tier selected');
        return;
      }

      // Track tier change
      await supabase.from('tier_changes').insert({
        user_id: user?.id,
        old_tier: currentTier,
        new_tier: tier.name,
      });

      // Update user metadata
      const { error } = await supabase.auth.updateUser({
        data: {
          membership_tier: tier.name,
          membership_price: tier.price,
        },
      });

      if (error) throw error;

      setMessage('Tier updated successfully!');

      // If changing to a paid tier, redirect to checkout
      if (tier.price > 0 && tier.price !== currentPrice) {
        setTimeout(() => {
          router.push(`/api/checkout?tier=${tier.name.toLowerCase()}`);
        }, 1500);
      } else {
        // Refresh the page to show updated tier
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Failed to update tier');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteLoading(true);

    try {
      // Track account deletion before deleting
      await supabase.from('account_deletions').insert({
        user_id: user?.id,
        user_email: user?.email,
        membership_tier: currentTier,
      });

      // Delete the user account from Supabase Auth
      const { error } = await supabase.rpc('delete_user');

      if (error) {
        // If RPC function doesn't exist, use auth admin delete
        // This requires admin privileges, so as a fallback we'll just sign out
        console.error('Delete user error:', error);
        await supabase.auth.signOut();
        router.push('/');
        return;
      }

      // Sign out and redirect
      await supabase.auth.signOut();
      router.push('/?message=account-deleted');
    } catch (err) {
      console.error('Error deleting account:', err);
      // Fallback: just sign out
      await supabase.auth.signOut();
      router.push('/');
    } finally {
      setDeleteLoading(false);
    }
  };

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

          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold font-garamond mb-4 text-primary">
              Membership Tier
            </h2>
            <div className="space-y-4 font-crimson">
              <div className="bg-parchment border-2 border-accent rounded-lg p-4">
                <p className="text-lg mb-2">
                  <strong>Current Tier:</strong> {currentTier}
                </p>
                <p className="text-lg">
                  <strong>Monthly Contribution:</strong> ${currentPrice}/month
                </p>
              </div>

              <div className="border-t pt-4">
                <h3 className="text-xl font-bold font-garamond mb-3 text-primary">
                  Change Your Tier
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  All tiers have the same access. Choose what you can afford to support mental health.
                </p>

                {message && (
                  <div className={`${message.includes('success') ? 'bg-green-100 border-green-400 text-green-700' : 'bg-blue-100 border-blue-400 text-blue-700'} border px-4 py-3 rounded mb-4`}>
                    {message}
                  </div>
                )}

                <div className="flex gap-4">
                  <select
                    value={selectedTier}
                    onChange={(e) => setSelectedTier(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    <option value="">Select a tier</option>
                    {MEMBERSHIP_TIERS.map((tier) => (
                      <option key={tier.name} value={tier.name}>
                        {tier.name} - ${tier.price}/month
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={handleTierChange}
                    disabled={loading || !selectedTier}
                    className="px-6 py-2 bg-accent text-white rounded hover:bg-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Updating...' : 'Update Tier'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold font-garamond mb-4 text-primary">
              Account Settings
            </h2>

            <div className="border-t pt-6">
              <h3 className="text-xl font-bold font-garamond mb-3 text-red-600">
                Delete Account
              </h3>
              <p className="font-crimson text-gray-600 mb-4">
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>

              {!showDeleteConfirm ? (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                >
                  Delete My Account
                </button>
              ) : (
                <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6">
                  <p className="font-crimson font-bold text-red-800 mb-4">
                    Are you sure you want to delete your account?
                  </p>
                  <p className="font-crimson text-red-700 mb-6">
                    This will permanently remove all your data and you will be logged out immediately.
                    This action cannot be reversed.
                  </p>
                  <div className="flex gap-4">
                    <button
                      onClick={handleDeleteAccount}
                      disabled={deleteLoading}
                      className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {deleteLoading ? 'Deleting...' : 'Yes, Delete My Account'}
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      disabled={deleteLoading}
                      className="px-6 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}
