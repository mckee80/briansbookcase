# Deployment Guide for Brian's Bookcase

This guide will help you deploy your website to the internet.

## Prerequisites

Before deploying, you need to:
1. ✅ Create a Supabase project (if you haven't already)
2. ✅ Run the database migration SQL
3. ✅ Set up Supabase Storage bucket
4. ✅ Have your GitHub repository ready

## Step 1: Set Up Supabase (Database)

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Click "New Project"
3. Fill in:
   - **Name**: briansbookcase
   - **Database Password**: (create a strong password and save it)
   - **Region**: Choose closest to your location
4. Wait for the project to be created (2-3 minutes)

### Run Database Migration

1. In your Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy and paste the contents of `supabase_migrations.sql`
4. Click **Run**

### Set Up Storage Bucket

1. In your Supabase dashboard, go to **Storage**
2. Click **New Bucket**
3. Name it `ebooks`
4. Check **Public bucket**
5. Click **Create bucket**
6. Go to **Storage** → **Policies**
7. Follow the instructions in `SUPABASE_STORAGE_SETUP.md` to add the storage policies

### Get Your Supabase Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy these two values:
   - **Project URL** (something like `https://xxxxx.supabase.co`)
   - **anon public** key (under "Project API keys")

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Website (Easiest)

1. Go to [vercel.com](https://vercel.com) and sign up with your GitHub account
2. Click **Add New** → **Project**
3. Import your `briansbookcase` repository from GitHub
4. Configure your project:
   - **Framework Preset**: Next.js (should auto-detect)
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

5. Add Environment Variables:
   - Click **Environment Variables**
   - Add these two variables:
     ```
     NEXT_PUBLIC_SUPABASE_URL = your-supabase-url
     NEXT_PUBLIC_SUPABASE_ANON_KEY = your-supabase-anon-key
     ```

6. Click **Deploy**
7. Wait 2-3 minutes for deployment to complete

### Option B: Deploy via CLI

From your project directory, run:

```bash
vercel
```

Follow the prompts:
- **Set up and deploy**: Yes
- **Which scope**: Your account
- **Link to existing project**: No
- **Project name**: briansbookcase
- **Directory**: `./`
- **Override settings**: No

Then add environment variables:

```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL
# Paste your Supabase URL when prompted

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
# Paste your Supabase anon key when prompted
```

Deploy to production:

```bash
vercel --prod
```

## Step 3: Update Admin Email

After deployment, you need to update the admin email whitelist:

1. In your deployed Vercel project settings, go to **Environment Variables**
2. Add a new variable:
   ```
   NEXT_PUBLIC_ADMIN_EMAIL = your-email@example.com
   ```
   (Use the same email you'll sign up with)

3. Redeploy the project for changes to take effect

## Step 4: Test Your Website

1. Visit your Vercel deployment URL (e.g., `https://briansbookcase.vercel.app`)
2. Test the signup/login flow
3. Sign up with your admin email
4. Go to `/admin` to access the admin dashboard
5. Try uploading an EPUB file
6. Check that the library page displays the book

## Step 5: Custom Domain (Optional)

To use your own domain (e.g., `briansbookcase.org`):

1. Buy a domain from a registrar (Namecheap, GoDaddy, etc.)
2. In Vercel, go to your project → **Settings** → **Domains**
3. Add your domain
4. Follow Vercel's instructions to update your DNS records
5. Wait for DNS propagation (up to 24 hours)

## Alternative Deployment Options

### Netlify
Similar to Vercel, great for Next.js:
1. Go to [netlify.com](https://netlify.com)
2. Connect your GitHub repository
3. Add the same environment variables
4. Deploy

### Railway
Good for full-stack apps:
1. Go to [railway.app](https://railway.app)
2. Connect your GitHub repository
3. Add environment variables
4. Deploy

## Troubleshooting

### "Failed to fetch data"
- Check that your Supabase environment variables are correct
- Verify the database migration was run successfully
- Check Supabase dashboard for any errors

### "Cannot access admin page"
- Ensure NEXT_PUBLIC_ADMIN_EMAIL is set in Vercel
- Make sure you're signed in with the admin email
- Check browser console for errors

### "Upload failed"
- Verify the `ebooks` storage bucket exists in Supabase
- Check that storage policies are set up correctly
- Ensure file size is under 50MB

## Cost Breakdown

All services have generous free tiers:

- **Vercel**: Free for personal projects
  - Unlimited deployments
  - Custom domain support
  - 100GB bandwidth/month

- **Supabase**: Free tier includes:
  - 500MB database
  - 1GB file storage
  - 2GB bandwidth/month
  - 50,000 monthly active users

Perfect for a charity website!

## Next Steps

After deployment:
1. Test all functionality thoroughly
2. Add your first ebooks to the library
3. Share your website URL
4. Set up analytics (optional - Google Analytics, Plausible, etc.)
5. Add a custom domain for a professional look

## Support

If you encounter issues:
- Vercel Docs: https://vercel.com/docs
- Supabase Docs: https://supabase.com/docs
- Next.js Docs: https://nextjs.org/docs
