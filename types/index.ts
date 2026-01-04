// Re-export Supabase types
export type {
  Profile,
  Ebook,
  Product,
  Membership,
} from '@/lib/supabase';

// Additional app-specific types

export interface User {
  id: string;
  email: string;
  fullName?: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export interface CheckoutSessionParams {
  priceId: string;
  successUrl: string;
  cancelUrl: string;
  userId?: string;
}

export interface StripeCheckoutResponse {
  url: string;
  sessionId: string;
}

export interface MembershipTier {
  name: string;
  price: number;
  stripePriceId: string;
  features: string[];
  tier: 'silver' | 'gold' | 'platinum';
}

export const MEMBERSHIP_TIERS: MembershipTier[] = [
  {
    name: 'Silver',
    tier: 'silver',
    price: 25,
    stripePriceId: process.env.STRIPE_PRICE_SILVER || '',
    features: [
      'Unlimited ebook downloads',
      'Access to exclusive member content',
      'Monthly newsletter',
      'Basic support',
    ],
  },
  {
    name: 'Gold',
    tier: 'gold',
    price: 50,
    stripePriceId: process.env.STRIPE_PRICE_GOLD || '',
    features: [
      'All Silver features',
      'Early access to new releases',
      'Author Q&A sessions',
      'Priority support',
      'Exclusive merchandise discount',
    ],
  },
  {
    name: 'Platinum',
    tier: 'platinum',
    price: 100,
    stripePriceId: process.env.STRIPE_PRICE_PLATINUM || '',
    features: [
      'All Gold features',
      'Personalized reading recommendations',
      'Virtual book club access',
      'Annual charity impact report',
      'VIP support',
      'Exclusive merchandise bundle',
    ],
  },
];
