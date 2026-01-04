# BriansBookcase - Quick Reference

## Environment Setup Checklist

- [ ] Node.js installed (v18+)
- [ ] Dependencies installed (`npm install`)
- [ ] Supabase project created
- [ ] Supabase database tables created (see [SETUP.md](SETUP.md))
- [ ] Stripe account created
- [ ] Stripe products created
- [ ] `.env.local` configured with all keys
- [ ] Dev server running (`npm run dev`)

## File Structure Reference

### Key Configuration Files
- `/.env.local` - Environment variables (DO NOT COMMIT)
- `/tailwind.config.ts` - Tailwind CSS config with custom colors
- `/tsconfig.json` - TypeScript configuration
- `/next.config.js` - Next.js configuration

### Authentication
- `/app/(auth)/login/page.tsx` - Login page
- `/app/(auth)/signup/page.tsx` - Signup page
- `/components/AuthProvider.tsx` - Auth context provider
- `/components/ProtectedRoute.tsx` - Route protection wrapper

### API Routes
- `/app/api/auth/callback/route.ts` - OAuth callback
- `/app/api/auth/logout/route.ts` - Logout endpoint
- `/app/api/stripe/create-checkout/route.ts` - Create Stripe session
- `/app/api/webhooks/stripe/route.ts` - Stripe webhook handler

### Library Files
- `/lib/supabase.ts` - Supabase client & helpers
- `/lib/stripe.ts` - Stripe client & helpers
- `/types/index.ts` - TypeScript type definitions

### Data
- `/data/mockData.ts` - Mock data (temporary)
- `/scripts/migrate-mock-data.ts` - Migration script

## Common Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm start                # Start production server
npm run lint             # Run linter

# Data Migration (after setup)
npx tsx scripts/migrate-mock-data.ts
```

## Important URLs

### Development
- Local: http://localhost:3000
- Login: http://localhost:3000/login
- Signup: http://localhost:3000/signup
- Account: http://localhost:3000/account

### External Services
- Supabase Dashboard: https://app.supabase.com
- Stripe Dashboard: https://dashboard.stripe.com
- Vercel (deployment): https://vercel.com

## Environment Variables Quick Reference

```bash
# Supabase (from project settings > API)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe (from developers > API keys)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Stripe Price IDs (from products)
STRIPE_PRICE_SILVER=
STRIPE_PRICE_GOLD=
STRIPE_PRICE_PLATINUM=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Custom Theme Colors

```tsx
// Tailwind classes
bg-primary    // #2c1810 (dark brown)
bg-accent     // #8b4513 (saddle brown)
bg-parchment  // #faf8f3 (light beige)

// CSS variables
var(--color-primary)
var(--color-accent)
var(--color-parchment)
```

## Custom Fonts

```tsx
font-garamond      // EB Garamond
font-baskerville   // Libre Baskerville
font-crimson       // Crimson Pro
```

## Using Authentication in Components

```tsx
'use client';
import { useAuth } from '@/components';

export default function MyComponent() {
  const { user, loading, signOut } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Please login</div>;

  return (
    <div>
      <p>Welcome {user.email}</p>
      <button onClick={signOut}>Logout</button>
    </div>
  );
}
```

## Protected Routes

```tsx
import { ProtectedRoute } from '@/components';

export default function ProtectedPage() {
  return (
    <ProtectedRoute>
      <div>This content requires authentication</div>
    </ProtectedRoute>
  );
}
```

## Database Queries

```tsx
import { dbHelpers } from '@/lib/supabase';

// Get all ebooks
const ebooks = await dbHelpers.getEbooks();

// Get user profile
const profile = await dbHelpers.getProfile(userId);

// Get active membership
const membership = await dbHelpers.getActiveMembership(userId);
```

## Stripe Integration

```tsx
import { stripeHelpers } from '@/lib/stripe';

// Create checkout session
const session = await stripeHelpers.createCheckoutSession({
  priceId: 'price_xxx',
  successUrl: 'https://yoursite.com/success',
  cancelUrl: 'https://yoursite.com/cancel',
});

// Create subscription
const subscription = await stripeHelpers.createSubscriptionSession({
  priceId: 'price_xxx',
  successUrl: 'https://yoursite.com/success',
  cancelUrl: 'https://yoursite.com/cancel',
});
```

## Troubleshooting

### Server won't start
- Check that port 3000 is not in use
- Verify all dependencies are installed
- Check for syntax errors in recent changes

### Authentication not working
- Verify Supabase URL and keys in `.env.local`
- Check Supabase dashboard for auth settings
- Ensure redirect URLs are configured

### Payments not working
- Verify Stripe keys in `.env.local`
- Check Stripe test mode vs production mode
- Verify webhook endpoint is configured

### Database queries failing
- Verify database tables are created
- Check Row Level Security policies
- Verify user has proper permissions

## Next Steps After Setup

1. ✅ Set up environment variables
2. ✅ Test authentication flow
3. ✅ Migrate mock data to Supabase
4. ✅ Test database queries
5. ✅ Configure Stripe products
6. ✅ Test checkout flow
7. ✅ Set up webhook handling
8. ✅ Deploy to Vercel/production

## Support Resources

- [SETUP.md](SETUP.md) - Full setup guide
- [README.md](README.md) - Project overview
- Supabase docs: https://supabase.com/docs
- Stripe docs: https://stripe.com/docs
- Next.js docs: https://nextjs.org/docs
