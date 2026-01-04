import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { priceId, userId } = await request.json();

    // TODO: Implement Stripe checkout session creation
    // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    //
    // const session = await stripe.checkout.sessions.create({
    //   mode: 'payment',
    //   line_items: [
    //     {
    //       price: priceId,
    //       quantity: 1,
    //     },
    //   ],
    //   success_url: `${request.headers.get('origin')}/success?session_id={CHECKOUT_SESSION_ID}`,
    //   cancel_url: `${request.headers.get('origin')}/shop`,
    //   metadata: {
    //     userId,
    //   },
    // });

    return NextResponse.json({
      url: '#', // session.url
      message: 'Stripe not yet configured'
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
