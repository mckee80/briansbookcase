import Link from 'next/link';
import { Heart, Check } from 'lucide-react';

const MEMBERSHIP_TIERS = [
  {
    name: 'Guest',
    price: 0,
    features: [
      'Browse ebook catalog',
      'Shop all merchandise',
      'Free shipping over $50',
    ],
    buttonText: 'No Commitment Required',
    buttonDisabled: true,
    featured: false,
  },
  {
    name: 'Member',
    price: 9.99,
    features: [
      'All guest features',
      'Download all ebooks',
      'Access entire library',
      'New releases monthly',
      'Member community forum',
      'Supporting suicide prevention',
    ],
    buttonText: 'Become a Member',
    buttonDisabled: false,
    featured: true,
  },
  {
    name: 'Champion',
    price: 25,
    features: [
      'All member features',
      'Champion badge & recognition',
      'Exclusive bonus content',
      '20% merchandise discount',
      'Direct impact updates',
      'Making a bigger difference',
    ],
    buttonText: 'Become a Champion',
    buttonDisabled: false,
    featured: false,
  },
];

export default function Membership() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
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
              100% of membership fees support organizations like AFSP, Crisis Text Line, and The Trevor Project
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 max-w-6xl mx-auto">
          {MEMBERSHIP_TIERS.map((tier) => (
            <div
              key={tier.name}
              className={`bg-white rounded-lg border-2 border-border shadow-lg overflow-hidden relative transition-transform hover:-translate-y-1 page-corner ${
                tier.featured ? 'ring-2 ring-accent md:scale-105' : ''
              }`}
            >
              {tier.featured && (
                <div className="bg-accent text-white text-center py-2 font-semibold font-crimson text-xs uppercase tracking-wide">
                  Support Mental Health
                </div>
              )}
              <div className="p-10">
                <h2 className="text-3xl font-bold font-garamond mb-4 text-primary">
                  {tier.name}
                </h2>
                <div className="mb-8">
                  <span className="text-5xl font-bold text-primary font-garamond">${tier.price}</span>
                  <span className="text-textLight font-crimson text-xl">/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center font-crimson text-textLight">
                      <Check className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" size={16} />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link href="/shop">
                  <button
                    disabled={tier.buttonDisabled}
                    className={`w-full py-3 rounded-lg font-semibold transition-colors font-crimson ${
                      tier.featured
                        ? 'bg-accent text-white hover:bg-primary'
                        : tier.buttonDisabled
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed opacity-50'
                        : 'bg-primary text-white hover:bg-gray-700'
                    }`}
                  >
                    {tier.buttonText}
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Impact Section */}
        <div className="bg-white rounded-lg border-2 border-border shadow-lg p-12 max-w-5xl mx-auto relative page-corner">
          <h2 className="text-4xl font-bold font-garamond mb-8 text-primary text-center border-b-2 border-border pb-4">
            Your Impact
          </h2>
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div className="text-center bg-parchment rounded-lg p-6 border border-border">
              <div className="text-5xl font-bold font-garamond text-accent mb-2">$124K+</div>
              <div className="text-textLight font-crimson text-sm uppercase tracking-wide">Donated to Date</div>
            </div>
            <div className="text-center bg-parchment rounded-lg p-6 border border-border">
              <div className="text-5xl font-bold font-garamond text-accent mb-2">2,100+</div>
              <div className="text-textLight font-crimson text-sm uppercase tracking-wide">Active Members</div>
            </div>
            <div className="text-center bg-parchment rounded-lg p-6 border border-border">
              <div className="text-5xl font-bold font-garamond text-accent mb-2">5</div>
              <div className="text-textLight font-crimson text-sm uppercase tracking-wide">Partner Charities</div>
            </div>
          </div>
          <p className="text-center font-crimson text-primary text-lg leading-relaxed max-w-3xl mx-auto">
            Every membership directly funds crisis intervention services, mental health resources,
            and suicide prevention programs. Together, we're making a real difference in saving lives.
          </p>
        </div>
      </div>
    </main>
  );
}
