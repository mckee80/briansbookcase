import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { stripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json({ error: 'No signature provided' }, { status: 400 });
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
    let event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        let userId = session.metadata?.user_id;
        const tier = session.metadata?.tier || 'supporter';
        const interval = session.metadata?.interval || 'month';
        const customerId = session.customer as string;
        const subscriptionId = session.subscription as string;

        // If no user_id in metadata, look up by email
        if (!userId && session.customer_email) {
          const { data } = await supabaseAdmin
            .from('profiles')
            .select('id')
            .eq('email', session.customer_email)
            .single();

          if (data) {
            userId = data.id;
          } else {
            // Fallback: search auth users with pagination
            let page = 1;
            let found = false;
            while (!found) {
              const { data: users } = await supabaseAdmin.auth.admin.listUsers({ page, perPage: 100 });
              if (!users?.users?.length) break;
              const matchedUser = users.users.find(u => u.email === session.customer_email);
              if (matchedUser) {
                userId = matchedUser.id;
                found = true;
              }
              if (users.users.length < 100) break;
              page++;
            }
          }
        }

        if (userId) {
          // Upsert membership record
          await supabaseAdmin.from('memberships').upsert({
            user_id: userId,
            tier,
            status: 'active',
            billing_interval: interval,
            amount_cents: session.amount_total || 0,
            stripe_customer_id: customerId,
            stripe_subscription_id: subscriptionId,
            updated_at: new Date().toISOString(),
          }, { onConflict: 'user_id' });

          // Update user metadata
          const { error: metaError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
            user_metadata: {
              membership_tier: tier.charAt(0).toUpperCase() + tier.slice(1),
              membership_price: (session.amount_total || 0) / 100,
              stripe_customer_id: customerId,
            },
          });
          if (metaError) {
            console.error('Failed to update user metadata:', metaError);
          }
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as any;
        const subscriptionId = subscription.id;
        const status = subscription.status === 'active' ? 'active'
          : subscription.status === 'past_due' ? 'past_due'
          : subscription.status === 'canceled' ? 'canceled'
          : 'incomplete';

        const item = subscription.items?.data?.[0];
        const periodStart = item?.current_period_start || subscription.current_period_start;
        const periodEnd = item?.current_period_end || subscription.current_period_end || subscription.cancel_at;

        await supabaseAdmin.from('memberships')
          .update({
            status,
            stripe_price_id: item?.price?.id || null,
            current_period_start: periodStart
              ? new Date(periodStart * 1000).toISOString() : null,
            current_period_end: periodEnd
              ? new Date(periodEnd * 1000).toISOString() : null,
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_subscription_id', subscriptionId);

        // If canceled, update user metadata
        if (status === 'canceled') {
          const { data: membership } = await supabaseAdmin.from('memberships')
            .select('user_id')
            .eq('stripe_subscription_id', subscriptionId)
            .single();

          if (membership) {
            await supabaseAdmin.auth.admin.updateUserById(membership.user_id, {
              user_metadata: {
                membership_tier: 'Free',
                membership_price: 0,
                stripe_customer_id: null,
              },
            });
          }
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const subscriptionId = subscription.id;

        const { data: membership } = await supabaseAdmin.from('memberships')
          .select('user_id')
          .eq('stripe_subscription_id', subscriptionId)
          .single();

        await supabaseAdmin.from('memberships')
          .update({
            status: 'canceled',
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_subscription_id', subscriptionId);

        if (membership) {
          await supabaseAdmin.auth.admin.updateUserById(membership.user_id, {
            user_metadata: {
              membership_tier: 'Free',
              membership_price: 0,
              stripe_customer_id: null,
            },
          });
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as any;
        const subscriptionId = invoice.subscription as string;

        if (subscriptionId) {
          await supabaseAdmin.from('memberships')
            .update({
              status: 'past_due',
              updated_at: new Date().toISOString(),
            })
            .eq('stripe_subscription_id', subscriptionId);
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook error' }, { status: 400 });
  }
}
