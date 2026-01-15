'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Heart, Check } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import EmailVerificationModal from '@/components/EmailVerificationModal';

const MEMBERSHIP_TIERS = [
  {
    name: 'Free',
    price: 0,
    features: [
      'Access entire library',
      'Download all ebooks',
      'New releases monthly',
      'Browse all merchandise',
    ],
    buttonText: 'Choose Free',
    featured: false,
  },
  {
    name: 'Supporter',
    price: 5,
    features: [
      'Access entire library',
      'Download all ebooks',
      'New releases monthly',
      'Browse all merchandise',
    ],
    buttonText: 'Choose $5/month',
    featured: false,
  },
  {
    name: 'Advocate',
    price: 10,
    features: [
      'Access entire library',
      'Download all ebooks',
      'New releases monthly',
      'Browse all merchandise',
    ],
    buttonText: 'Choose $10/month',
    featured: true,
  },
  {
    name: 'Custom',
    price: 0,
    features: [
      'Access entire library',
      'Download all ebooks',
      'New releases monthly',
      'Browse all merchandise',
    ],
    buttonText: 'Choose Custom Amount',
    featured: false,
  },
];

export default function Membership() {
  const router = useRouter();
  const [selectedTier, setSelectedTier] = useState('advocate');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [signupEmail, setSignupEmail] = useState('');
  const [customAmount, setCustomAmount] = useState('');

  const handleTierSelect = (tierName: string) => {
    setSelectedTier(tierName.toLowerCase());
    // Smooth scroll to signup form
    document.getElementById('signup-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    // Validate custom amount if custom tier is selected
    if (selectedTier === 'custom') {
      const amount = parseFloat(customAmount);
      if (!customAmount || isNaN(amount) || amount < 0) {
        setError('Please enter a valid custom amount');
        return;
      }
    }

    setLoading(true);

    try {
      const tier = MEMBERSHIP_TIERS.find(t => t.name.toLowerCase() === selectedTier);

      // Determine the price based on tier selection
      let price = tier?.price || 0;
      let tierName = tier?.name || 'Free';

      if (selectedTier === 'custom') {
        price = parseFloat(customAmount);
        tierName = 'Custom';
      }

      const { data, error: signupError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            membership_tier: tierName,
            membership_price: price,
          },
        },
      });

      if (signupError) throw signupError;

      if (data.user) {
        // Store email for modal and show verification modal
        setSignupEmail(email);
        setShowEmailModal(true);
        setSuccess(true);

        // Note: User will need to verify email before they can access the library
        // The redirect logic is removed - they'll need to verify and then log in
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during signup');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold font-garamond mb-4 text-primary">
            Support Mental Health
          </h1>
          <p className="font-crimson text-xl text-textLight max-w-3xl mx-auto mb-6">
            Your monthly contribution goes directly to suicide prevention charities
          </p>
          <div className="inline-flex items-center gap-3 bg-accent/10 px-6 py-4 rounded-xl max-w-4xl">
            <Heart className="text-accent flex-shrink-0" size={24} />
            <p className="font-crimson text-primary font-medium">
              100% of donations support organizations like AFSP, Crisis Text Line, and The Trevor Project
            </p>
          </div>
        </div>

        {/* Tier Selection */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-7xl mx-auto mb-16">
          {MEMBERSHIP_TIERS.map((tier) => (
            <div
              key={tier.name}
              className={`bg-white rounded-lg border-2 shadow-lg overflow-hidden relative transition-transform hover:-translate-y-1 page-corner ${
                tier.featured ? 'ring-2 ring-accent md:scale-105' : ''
              } ${
                selectedTier === tier.name.toLowerCase() ? 'border-accent' : 'border-border'
              }`}
            >
              {tier.featured && (
                <div className="bg-accent text-white text-center py-2 font-semibold font-crimson text-xs uppercase tracking-wide">
                  Most Popular
                </div>
              )}
              <div className="p-10">
                <h2 className="text-3xl font-bold font-garamond mb-4 text-primary">
                  {tier.name}
                </h2>
                <div className="mb-8">
                  {tier.name === 'Custom' ? (
                    <div className="text-center py-4">
                      <p className="text-lg font-crimson text-primary">
                        Choose your own amount
                      </p>
                    </div>
                  ) : (
                    <>
                      <span className="text-5xl font-bold text-primary font-garamond">${tier.price}</span>
                      <span className="text-textLight font-crimson text-xl">/month</span>
                    </>
                  )}
                </div>
                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center font-crimson text-textLight">
                      <Check className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" size={16} />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleTierSelect(tier.name)}
                  className={`w-full py-3 rounded-lg font-semibold transition-colors font-crimson ${
                    tier.featured
                      ? 'bg-accent text-white hover:bg-primary'
                      : 'bg-primary text-white hover:bg-gray-700'
                  }`}
                >
                  {tier.buttonText}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Why Monthly Donations */}
        <div className="max-w-3xl mx-auto mb-12 bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
          <p className="font-crimson text-primary text-center leading-relaxed">
            We ask for monthly donations because consistent support from many people, even in small amounts,
            is more sustainable than occasional larger gifts. Your monthly contribution joins with others to
            create reliable funding for mental health and suicide prevention charities.
          </p>
        </div>

        {/* Signup Form */}
        <div id="signup-form" className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg border-2 border-border shadow-lg p-8 relative page-corner">
            <h2 className="text-3xl font-bold font-garamond mb-6 text-primary text-center">
              Create Your Account
            </h2>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                Account created successfully! Redirecting...
              </div>
            )}

            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <label htmlFor="tier" className="block font-crimson mb-2 font-semibold text-primary">
                  Selected Tier
                </label>
                <select
                  id="tier"
                  value={selectedTier}
                  onChange={(e) => setSelectedTier(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-accent font-crimson"
                >
                  {MEMBERSHIP_TIERS.map((tier) => (
                    <option key={tier.name} value={tier.name.toLowerCase()}>
                      {tier.name === 'Custom'
                        ? 'Custom - Choose your amount'
                        : `${tier.name} - $${tier.price}/month`
                      }
                    </option>
                  ))}
                </select>
                {selectedTier === 'custom' && (
                  <div className="mt-3">
                    <label htmlFor="customAmount" className="block font-crimson mb-2 text-sm text-primary">
                      Enter your monthly amount ($)
                    </label>
                    <input
                      type="number"
                      id="customAmount"
                      min="0"
                      step="1"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      placeholder="0"
                      className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-accent"
                      required
                    />
                  </div>
                )}
                <p className="text-sm text-gray-600 mt-2 font-crimson">
                  All tiers have the same access. Choose what you can afford to support mental health.
                </p>
                <p className="text-sm text-blue-600 mt-1 font-crimson">
                  You can change your tier at any time on your account page.
                </p>
              </div>

              <div>
                <label htmlFor="email" className="block font-crimson mb-2 font-semibold text-primary">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>

              <div>
                <label htmlFor="password" className="block font-crimson mb-2 font-semibold text-primary">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block font-crimson mb-2 font-semibold text-primary">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-accent text-white py-3 rounded-lg hover:bg-primary transition-colors disabled:opacity-50 font-semibold font-crimson text-lg"
              >
                {loading ? 'Creating account...' : 'Create Account & Join'}
              </button>
            </form>

            <p className="mt-6 text-center font-crimson text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="text-accent hover:underline font-semibold">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Email Verification Modal */}
      <EmailVerificationModal
        isOpen={showEmailModal}
        onClose={() => {
          setShowEmailModal(false);
          router.push('/login');
        }}
        email={signupEmail}
      />
    </main>
  );
}
