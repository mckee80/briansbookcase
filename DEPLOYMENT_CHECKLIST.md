# Deployment Checklist for Brian's Bookcase

Use this checklist to track your deployment progress.

## Phase 1: Supabase Setup (Database & Storage)

### Create Supabase Account
- [ ] Go to [supabase.com](https://supabase.com)
- [ ] Sign up with your email or GitHub
- [ ] Verify your email

### Create New Project
- [ ] Click "New Project"
- [ ] Project name: `briansbookcase`
- [ ] Database password: (create a strong password - save it somewhere safe!)
- [ ] Region: (choose closest to you)
- [ ] Click "Create new project"
- [ ] Wait 2-3 minutes for setup

### Run Database Migration
- [ ] In Supabase dashboard, go to **SQL Editor**
- [ ] Click **New Query**
- [ ] Open `supabase_migrations.sql` from your project
- [ ] Copy entire contents and paste into SQL Editor
- [ ] Click **Run** (bottom right)
- [ ] Verify: "Success. No rows returned"

### Create Storage Bucket
- [ ] In Supabase dashboard, go to **Storage**
- [ ] Click **New Bucket**
- [ ] Name: `ebooks`
- [ ] **Check** "Public bucket" ✅
- [ ] Click "Create bucket"

### Add Storage Policies
- [ ] Go to **Storage** → **Policies** tab
- [ ] Click **New Policy** on the `ebooks` bucket
- [ ] Add these three policies (copy from `SUPABASE_STORAGE_SETUP.md`):
  - [ ] Public can download ebooks (SELECT)
  - [ ] Authenticated users can upload ebooks (INSERT)
  - [ ] Authenticated users can delete ebooks (DELETE)

### Get Supabase Credentials
- [ ] In Supabase dashboard, go to **Settings** → **API**
- [ ] Copy **Project URL** (starts with `https://`)
- [ ] Copy **anon public** key (long string under "Project API keys")
- [ ] Save both somewhere safe - you'll need them for Vercel!

**✅ Supabase is ready!**

---

## Phase 2: Vercel Deployment

### Create Vercel Account
- [ ] Go to [vercel.com](https://vercel.com)
- [ ] Click "Sign Up"
- [ ] Sign up with your **GitHub account** (easiest)

### Import Project from GitHub
- [ ] Click **Add New** → **Project**
- [ ] You'll see your GitHub repositories
- [ ] Find and click **Import** next to `briansbookcase`

### Configure Project Settings
- [ ] Framework Preset: **Next.js** (should auto-detect)
- [ ] Root Directory: `./` (default)
- [ ] Build Command: `npm run build` (default)
- [ ] Output Directory: `.next` (default)

### Add Environment Variables (CRITICAL!)
Click "Environment Variables" and add these TWO variables:

- [ ] Variable 1:
  - Name: `NEXT_PUBLIC_SUPABASE_URL`
  - Value: (paste your Supabase Project URL)

- [ ] Variable 2:
  - Name: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - Value: (paste your Supabase anon key)

### Deploy!
- [ ] Click **Deploy**
- [ ] Wait 2-3 minutes
- [ ] You'll get a URL like `https://briansbookcase.vercel.app`

**✅ Your site is live!**

---

## Phase 3: Configure Admin Access

### Add Admin Email
- [ ] In Vercel dashboard, go to your project
- [ ] Click **Settings** → **Environment Variables**
- [ ] Add **one more** variable:
  - Name: `NEXT_PUBLIC_ADMIN_EMAIL`
  - Value: (your email address - the one you'll sign up with)

### Redeploy
- [ ] Go to **Deployments** tab
- [ ] Click the **three dots** on the latest deployment
- [ ] Click **Redeploy**
- [ ] Wait 1-2 minutes

**✅ Admin access configured!**

---

## Phase 4: Test Everything

### Test Public Pages
- [ ] Visit your Vercel URL
- [ ] Click through: Home → Library → Authors → About
- [ ] Verify all pages load correctly

### Test Signup & Login
- [ ] Click **Sign Up**
- [ ] Sign up with your admin email
- [ ] Check your email for Supabase confirmation
- [ ] Click confirmation link
- [ ] Log in with your credentials

### Test Admin Dashboard
- [ ] Go to `/admin` in your browser
- [ ] Verify you can access it (because you're using admin email)
- [ ] Check all three tabs: Ebooks, Authors, Analytics

### Upload Test Ebook
- [ ] In Admin → Ebooks, click "Add Ebook"
- [ ] Upload an EPUB file (or PDF)
- [ ] Fill in title, author, genre (or let it auto-extract from EPUB!)
- [ ] Click "Save Ebook"
- [ ] Go to Library page and verify it appears
- [ ] Click Download and verify file downloads

**✅ Everything works!**

---

## Phase 5: Share Your Site! (Optional)

### Tell the World
- [ ] Share your Vercel URL with friends
- [ ] Post on social media
- [ ] Add to your email signature

### Buy Custom Domain (Later)
When ready:
- [ ] Buy domain (e.g., briansbookcase.org)
- [ ] Add to Vercel (Settings → Domains)
- [ ] Update DNS at your registrar
- [ ] Wait for DNS propagation

---

## Troubleshooting

**"Failed to fetch data"**
- Check environment variables are correct in Vercel
- Verify Supabase URL and key are exact (no extra spaces)
- Check Supabase database migration ran successfully

**"Cannot access admin page"**
- Make sure `NEXT_PUBLIC_ADMIN_EMAIL` is set in Vercel
- Verify you're signed in with that exact email
- Try logging out and back in

**"Upload failed"**
- Check `ebooks` bucket exists in Supabase Storage
- Verify all three storage policies are active
- Ensure file is under 50MB

---

## Support Resources

- **Deployment Guide**: See `DEPLOYMENT.md` for detailed instructions
- **Vercel Docs**: https://vercel.com/docs
- **Supabase Docs**: https://supabase.com/docs
- **Next.js Docs**: https://nextjs.org/docs

---

## Summary

✅ **Your Progress:**
- [ ] Phase 1: Supabase Setup (Database & Storage)
- [ ] Phase 2: Vercel Deployment
- [ ] Phase 3: Configure Admin Access
- [ ] Phase 4: Test Everything
- [ ] Phase 5: Share Your Site!

**Total Time:** ~15-20 minutes

**Cost:** $0/month (using free tiers!)

Good luck! 🎉
