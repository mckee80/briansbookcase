import Stripe from 'stripe';

// Initialize Stripe with secret key (server-side only)
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-12-18.acacia',
});

// Stripe product price IDs (set these after creating products in Stripe Dashboard)
export const STRIPE_PRICES = {
  MEMBERSHIP_SILVER: process.env.STRIPE_PRICE_SILVER || '',
  MEMBERSHIP_GOLD: process.env.STRIPE_PRICE_GOLD || '',
  MEMBERSHIP_PLATINUM: process.env.STRIPE_PRICE_PLATINUM || '',
};

// Helper functions for Stripe operations
export const stripeHelpers = {
  // Create a checkout session for one-time payment
  async createCheckoutSession({
    priceId,
    successUrl,
    cancelUrl,
    customerId,
    metadata = {},
  }: {
    priceId: string;
    successUrl: string;
    cancelUrl: string;
    customerId?: string;
    metadata?: Record<string, string>;
  }) {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer: customerId,
      metadata,
    });

    return session;
  },

  // Create a subscription checkout session
  async createSubscriptionSession({
    priceId,
    successUrl,
    cancelUrl,
    customerId,
    metadata = {},
  }: {
    priceId: string;
    successUrl: string;
    cancelUrl: string;
    customerId?: string;
    metadata?: Record<string, string>;
  }) {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer: customerId,
      metadata,
    });

    return session;
  },

  // Create a Stripe customer
  async createCustomer({
    email,
    name,
    metadata = {},
  }: {
    email: string;
    name?: string;
    metadata?: Record<string, string>;
  }) {
    const customer = await stripe.customers.create({
      email,
      name,
      metadata,
    });

    return customer;
  },

  // Cancel a subscription
  async cancelSubscription(subscriptionId: string) {
    const subscription = await stripe.subscriptions.cancel(subscriptionId);
    return subscription;
  },

  // Get subscription details
  async getSubscription(subscriptionId: string) {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    return subscription;
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
