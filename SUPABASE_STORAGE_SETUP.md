# Supabase Storage Setup for Ebook Files

## Step 1: Create Storage Bucket

1. Go to your Supabase Dashboard → **Storage**
2. Click **New Bucket**
3. Configure the bucket:
   - **Name**: `ebooks`
   - **Public bucket**: ✅ Check this (allows users to download files)
   - Click **Create bucket**

## Step 2: Set Storage Policies

After creating the bucket, set up Row Level Security policies:

### Allow Public Downloads (Read Access)

```sql
-- Allow anyone to download ebooks
CREATE POLICY "Public can download ebooks"
ON storage.objects FOR SELECT
USING (bucket_id = 'ebooks');
```

### Allow Authenticated Users to Upload (Write Access)

```sql
-- Allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload ebooks"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'ebooks');
```

### Allow Authenticated Users to Delete Files

```sql
-- Allow authenticated users to delete files
CREATE POLICY "Authenticated users can delete ebooks"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'ebooks');
```

## Step 3: Verify Setup

1. Go to **Storage** → **Policies**
2. Verify you see three policies for the `ebooks` bucket:
   - ✅ Public can download ebooks (SELECT)
   - ✅ Authenticated users can upload ebooks (INSERT)
   - ✅ Authenticated users can delete ebooks (DELETE)

## What This Does:

- **Public downloads**: Anyone can download ebooks from your library (good for charity!)
- **Admin uploads**: Only authenticated users (you as admin) can upload new files
- **Admin deletes**: Only authenticated users can remove files

## Supported File Types:

Common ebook formats:
- `.epub` (most common)
- `.pdf`
- `.mobi` (Kindle)
- `.azw` / `.azw3` (Kindle)
- `.txt`

The bucket will accept files up to **50MB** (Supabase limit).

## Free Tier Limits:

- **1GB storage** (hundreds of ebooks)
- **2GB bandwidth/month** (plenty for downloads)

Perfect for a charity website!
