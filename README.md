# BriansBookcase

A charity website supporting mental health through donated fiction ebooks.

## Tech Stack

- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Supabase** for authentication and database
- **Stripe** for payment processing
- Custom fonts: EB Garamond, Libre Baskerville, Crimson Pro

## 🚀 Full-Stack Setup

This project is now configured as a full-stack application. See [SETUP.md](SETUP.md) for detailed setup instructions including:
- Supabase configuration
- Stripe integration
- Database schema
- Environment variables

## Custom Theme

- Primary color: `#2c1810` (dark brown)
- Accent color: `#8b4513` (saddle brown)
- Parchment background: `#faf8f3`

## Project Structure

```
briansbookcase/
├── app/                    # Next.js 14 App Router pages
│   ├── about/             # About page
│   ├── account/           # User account page
│   ├── authors/           # Authors page
│   ├── library/           # Ebook library page
│   ├── membership/        # Membership page
│   ├── shop/              # Shop page
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # Reusable React components
│   ├── Header.tsx         # Navigation header
│   └── Footer.tsx         # Site footer
├── data/                  # Mock data
│   └── mockData.ts        # Ebooks and products data
└── public/                # Static assets
```

## Getting Started

### Prerequisites

Make sure you have Node.js installed (version 18 or higher recommended).

### Installation

1. Install dependencies:

```bash
npm install
```

2. Run the development server:

```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Pages

- **Home** (`/`) - Landing page with mission statement
- **Library** (`/library`) - Browse donated ebooks
- **Shop** (`/shop`) - Purchase merchandise and memberships
- **Membership** (`/membership`) - Membership information and plans
- **About** (`/about`) - About the charity and mission
- **Authors** (`/authors`) - Featured authors and contributors
- **Account** (`/account`) - User account management

## Mock Data

The project includes mock data in [data/mockData.ts](data/mockData.ts):
- 4 sample ebooks with metadata
- 6 sample products including merchandise and memberships

## Current Features

### Authentication & User Management
- ✅ User signup and login
- ✅ Protected routes
- ✅ Session management
- ✅ User profile display

### Database & Backend
- ✅ Supabase integration
- ✅ Database helper functions
- ✅ TypeScript types for all tables

### Payments
- ✅ Stripe integration setup
- ✅ Checkout session creation
- ✅ Webhook handlers

## Future Development

- Complete Supabase auth implementation
- Migrate mock data to database
- Implement Stripe checkout flow
- Ebook reader functionality
- Subscription management
- Admin panel
- Blog/resources section

## Mission

BriansBookcase is dedicated to supporting mental health through the power of literature. We provide donated fiction ebooks to raise awareness and funds for mental health resources.
