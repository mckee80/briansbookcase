import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const MEMBERSHIP_TIERS = [
  { name: 'supporter', price: 5 },
  { name: 'advocate', price: 10 },
  { name: 'champion', price: 20 },
];

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const tier = searchParams.get('tier');

    if (!tier) {
      return NextResponse.redirect(new URL('/membership', request.url));
    }

    const selectedTier = MEMBERSHIP_TIERS.find(t => t.name === tier.toLowerCase());

    if (!selectedTier) {
      return NextResponse.redirect(new URL('/membership', request.url));
    }

    // TODO: Implement actual Stripe checkout session creation
    // For now, redirect to a payment placeholder page
    // Once Stripe is configured, create a checkout session and redirect to Stripe

    // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    //
    // const session = await stripe.checkout.sessions.create({
    //   mode: 'subscription',
    //   line_items: [
    //     {
    //       price_data: {
    //         currency: 'usd',
    //         product_data: {
    //           name: `${selectedTier.name.charAt(0).toUpperCase() + selectedTier.name.slice(1)} Membership`,
    //           description: 'Monthly support for mental health charities',
    //         },
    //         unit_amount: selectedTier.price * 100,
    //         recurring: {
    //           interval: 'month',
    //         },
    //       },
    //       quantity: 1,
    //     },
    //   ],
    //   success_url: `${request.nextUrl.origin}/library?session_id={CHECKOUT_SESSION_ID}`,
    //   cancel_url: `${request.nextUrl.origin}/membership`,
    // });
    //
    // return NextResponse.redirect(session.url!);

    // Temporary: redirect to library with a message
    return NextResponse.redirect(new URL('/library?payment=pending', request.url));
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.redirect(new URL('/membership?error=checkout', request.url));
  }
}
