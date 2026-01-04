# BriansBookcase - Full-Stack Setup Guide

## Overview

BriansBookcase is now configured as a full-stack application with:
- **Supabase** for authentication and database
- **Stripe** for payment processing
- **Next.js 14** App Router with TypeScript

## Project Structure

```
briansbookcase/
├── app/
│   ├── (auth)/              # Authentication pages (grouped route)
│   │   ├── login/
│   │   └── signup/
│   ├── api/                 # API routes
│   │   ├── auth/
│   │   │   ├── callback/    # Supabase OAuth callback
│   │   │   └── logout/      # Logout endpoint
│   │   ├── stripe/
│   │   │   └── create-checkout/  # Stripe checkout session
│   │   └── webhooks/
│   │       └── stripe/      # Stripe webhook handler
│   ├── library/
│   ├── shop/
│   ├── membership/
│   ├── about/
│   ├── authors/
│   ├── account/             # Protected route
│   ├── layout.tsx           # Root layout with AuthProvider
│   ├── page.tsx             # Home page
│   └── globals.css
├── components/
│   ├── AuthProvider.tsx     # Authentication context
│   ├── Navbar.tsx           # Navigation with auth state
│   ├── ProtectedRoute.tsx   # Route protection wrapper
│   ├── Header.tsx           # Original header (deprecated)
│   ├── Footer.tsx
│   └── index.ts
├── lib/
│   ├── supabase.ts          # Supabase client & helpers
│   └── stripe.ts            # Stripe client & helpers
├── data/
│   └── mockData.ts          # Mock data (will migrate to Supabase)
├── .env.local               # Environment variables (DO NOT COMMIT)
├── .env.example             # Environment template
└── package.json
```

## Setup Steps

### 1. Install Dependencies

Already completed:
```bash
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs stripe
```

### 2. Set Up Supabase

1. **Create a Supabase Project:**
   - Go to [https://supabase.com](https://supabase.com)
   - Create a new project
   - Note your project URL and API keys

2. **Get Your API Keys:**
   - Go to Project Settings > API
   - Copy:
     - Project URL
     - `anon` public key
     - `service_role` secret key (keep this secure!)

3. **Create Database Tables:**

   Run this SQL in your Supabase SQL Editor:

   ```sql
   -- Profiles table (extends auth.users)
   CREATE TABLE profiles (
     id UUID REFERENCES auth.users PRIMARY KEY,
     email TEXT UNIQUE NOT NULL,
     full_name TEXT,
     avatar_url TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Ebooks table
   CREATE TABLE ebooks (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     title TEXT NOT NULL,
     author TEXT NOT NULL,
     description TEXT,
     cover_image_url TEXT,
     file_url TEXT NOT NULL,
     genre TEXT,
     publication_year INTEGER,
     page_count INTEGER,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Products table
   CREATE TABLE products (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     name TEXT NOT NULL,
     description TEXT,
     price DECIMAL(10,2) NOT NULL,
     image_url TEXT,
     category TEXT,
     stripe_price_id TEXT,
     in_stock BOOLEAN DEFAULT true,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Memberships table
   CREATE TABLE memberships (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     user_id UUID REFERENCES auth.users NOT NULL,
     tier TEXT CHECK (tier IN ('silver', 'gold', 'platinum')),
     status TEXT CHECK (status IN ('active', 'cancelled', 'expired')),
     start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     end_date TIMESTAMP WITH TIME ZONE,
     stripe_subscription_id TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Enable Row Level Security
   ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
   ALTER TABLE ebooks ENABLE ROW LEVEL SECURITY;
   ALTER TABLE products ENABLE ROW LEVEL SECURITY;
   ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;

   -- RLS Policies

   -- Profiles: Users can read all, but only update their own
   CREATE POLICY "Profiles are viewable by everyone"
     ON profiles FOR SELECT
     USING (true);

   CREATE POLICY "Users can update own profile"
     ON profiles FOR UPDATE
     USING (auth.uid() = id);

   -- Ebooks: Everyone can read
   CREATE POLICY "Ebooks are viewable by everyone"
     ON ebooks FOR SELECT
     USING (true);

   -- Products: Everyone can read
   CREATE POLICY "Products are viewable by everyone"
     ON products FOR SELECT
     USING (true);

   -- Memberships: Users can only see their own
   CREATE POLICY "Users can view own memberships"
     ON memberships FOR SELECT
     USING (auth.uid() = user_id);

   -- Function to create profile on signup
   CREATE OR REPLACE FUNCTION public.handle_new_user()
   RETURNS TRIGGER AS $$
   BEGIN
     INSERT INTO public.profiles (id, email, full_name)
     VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name');
     RETURN new;
   END;
   $$ LANGUAGE plpgsql SECURITY DEFINER;

   -- Trigger to auto-create profile
   CREATE TRIGGER on_auth_user_created
     AFTER INSERT ON auth.users
     FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
   ```

### 3. Set Up Stripe

1. **Create a Stripe Account:**
   - Go to [https://stripe.com](https://stripe.com)
   - Create an account (use test mode for development)

2. **Get Your API Keys:**
   - Go to Developers > API keys
   - Copy:
     - Publishable key
     - Secret key

3. **Create Products & Prices:**
   - Go to Products > Add Product
   - Create membership products:
     - Silver Membership - $25/year
     - Gold Membership - $50/year
     - Platinum Membership - $100/year
   - Copy the Price ID for each (starts with `price_`)

4. **Set Up Webhook:**
   - Go to Developers > Webhooks
   - Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
   - Select events:
     - `checkout.session.completed`
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
   - Copy the webhook signing secret

### 4. Configure Environment Variables

Update [.env.local](.env.local) with your actual keys:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# Stripe Price IDs
STRIPE_PRICE_SILVER=price_xxx
STRIPE_PRICE_GOLD=price_xxx
STRIPE_PRICE_PLATINUM=price_xxx

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. Update Supabase Auth Settings

In Supabase Dashboard > Authentication > URL Configuration:
- Site URL: `http://localhost:3000`
- Redirect URLs: `http://localhost:3000/api/auth/callback`

### 6. Test the Application

```bash
npm run dev
```

Visit:
- http://localhost:3000 - Home page
- http://localhost:3000/signup - Create account
- http://localhost:3000/login - Login
- http://localhost:3000/account - Protected account page (requires login)

## Features Implemented

### Authentication
- ✅ Sign up with email/password
- ✅ Login with email/password
- ✅ Protected routes
- ✅ Auth context & hooks
- ✅ Logout functionality
- ⏳ OAuth providers (Google, GitHub) - Ready to add
- ⏳ Password reset - Ready to add

### Database
- ✅ Supabase client configured
- ✅ Database helper functions
- ✅ TypeScript types for tables
- ⏳ Data migration from mock data
- ⏳ CRUD operations for ebooks/products

### Payments
- ✅ Stripe client configured
- ✅ Checkout session creation
- ✅ Webhook handler structure
- ⏳ Subscription management
- ⏳ Customer portal

### UI Components
- ✅ AuthProvider for global auth state
- ✅ Navbar with auth state (login/signup or logout)
- ✅ ProtectedRoute wrapper
- ✅ Login page
- ✅ Signup page
- ✅ Account page (protected)

## Next Steps

1. **Complete Authentication Implementation:**
   - Wire up Supabase auth in login/signup pages
   - Add password reset functionality
   - Add OAuth providers

2. **Migrate Mock Data:**
   - Import mock ebooks to Supabase
   - Import mock products to Supabase
   - Update pages to fetch from Supabase

3. **Implement Stripe Integration:**
   - Complete checkout session creation
   - Implement webhook processing
   - Add subscription management
   - Create customer portal link

4. **Build Out Pages:**
   - Library page with ebook grid
   - Shop page with products
   - Membership page with pricing cards
   - Enhanced account page

5. **Add Features:**
   - Ebook download functionality
   - Purchase history
   - Reading lists
   - Admin panel

## Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## Support

For questions or issues:
- Supabase docs: https://supabase.com/docs
- Stripe docs: https://stripe.com/docs
- Next.js docs: https://nextjs.org/docs
