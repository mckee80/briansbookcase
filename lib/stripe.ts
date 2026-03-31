import Stripe from 'stripe';

// Initialize Stripe with secret key (server-side only)
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-12-15.clover',
});

// Price IDs mapped by tier and billing interval
export const STRIPE_PRICES: Record<string, Record<string, string>> = {
  supporter: {
    month: process.env.STRIPE_PRICE_5_MONTHLY || '',
    year: process.env.STRIPE_PRICE_5_YEARLY || '',
  },
  advocate: {
    month: process.env.STRIPE_PRICE_10_MONTHLY || '',
    year: process.env.STRIPE_PRICE_10_YEARLY || '',
  },
  champion: {
    month: process.env.STRIPE_PRICE_20_MONTHLY || '',
    year: process.env.STRIPE_PRICE_20_YEARLY || '',
  },
};

// Get price ID for a tier and interval
export function getPriceId(tier: string, interval: 'month' | 'year'): string | null {
  const tierPrices = STRIPE_PRICES[tier.toLowerCase()];
  if (!tierPrices) return null;
  return tierPrices[interval] || null;
}

// Helper functions for Stripe operations
export const stripeHelpers = {
  // Create a subscription checkout session
  async createSubscriptionSession({
    priceId,
    successUrl,
    cancelUrl,
    customerEmail,
    metadata = {},
  }: {
    priceId: string;
    successUrl: string;
    cancelUrl: string;
    customerEmail: string;
    metadata?: Record<string, string>;
  }) {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: customerEmail,
      metadata,
      subscription_data: { metadata },
    });
    return session;
  },

  // Create a subscription checkout with a custom amount
  async createCustomSubscriptionSession({
    amountCents,
    interval,
    successUrl,
    cancelUrl,
    customerEmail,
    metadata = {},
  }: {
    amountCents: number;
    interval: 'month' | 'year';
    successUrl: string;
    cancelUrl: string;
    customerEmail: string;
    metadata?: Record<string, string>;
  }) {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: "Brian's Bookcase - Custom Donation",
            description: 'Monthly support for mental health charities',
          },
          unit_amount: amountCents,
          recurring: { interval },
        },
        quantity: 1,
      }],
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: customerEmail,
      metadata,
      subscription_data: { metadata },
    });
    return session;
  },

  // Create a portal session for customer to manage subscription
  async createPortalSession(customerId: string, returnUrl: string) {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });
    return session;
  },
};
