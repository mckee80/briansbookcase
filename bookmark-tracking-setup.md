# Bookmark QR Code Tracking Setup Guide

## Overview
This guide covers how to track bookmark QR code scans and view geographic data using the `/bookmark` redirect page and Google Analytics.

---

## What's Already Implemented

✅ **Bookmark redirect page**: `app/bookmark/page.tsx`
- URL: `https://briansbookcase.org/bookmark`
- Shows welcome message for 1.5 seconds
- Automatically redirects to homepage
- Tracks scan event in Google Analytics (if configured)

---

## QR Code URL

Use this URL in your bookmark QR code:
```
https://briansbookcase.org/bookmark
```

Or if not using HTTPS yet:
```
http://briansbookcase.org/bookmark
```

**Test the page**: Visit the URL directly to see the welcome message and redirect.

---

## Google Analytics Setup

### Step 1: Create Google Analytics Account (If You Don't Have One)

1. Go to [analytics.google.com](https://analytics.google.com)
2. Sign in with Google account
3. Click "Start measuring"
4. Enter account name: "Brian's Bookcase"
5. Click "Next"
6. Enter property name: "Brian's Bookcase Website"
7. Select timezone and currency
8. Click "Next"
9. Select business category and size
10. Click "Create"
11. Accept terms of service

### Step 2: Get Your Measurement ID

1. In Google Analytics, go to **Admin** (gear icon, bottom left)
2. Under **Property**, click **Data Streams**
3. Click **Add stream** → **Web**
4. Enter your website URL: `briansbookcase.org`
5. Enter stream name: "Brian's Bookcase"
6. Click **Create stream**
7. Copy your **Measurement ID** (looks like `G-XXXXXXXXXX`)

### Step 3: Add Google Analytics to Your Next.js App

**Option A: Using next/script (Recommended)**

1. Open `app/layout.tsx`
2. Add Google Analytics script in the `<head>` section:

```typescript
import Script from 'next/script';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Google Analytics */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXXXXX');
          `}
        </Script>
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
```

**Replace `G-XXXXXXXXXX` with your actual Measurement ID**

**Option B: Using Environment Variable (More Secure)**

1. Add to `.env.local`:
```
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

2. Update `app/layout.tsx`:
```typescript
import Script from 'next/script';

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {GA_MEASUREMENT_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_MEASUREMENT_ID}');
              `}
            </Script>
          </>
        )}
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
```

3. Add to `.env.production` (for Vercel deployment):
```
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### Step 4: Deploy Changes

1. Commit changes:
```bash
git add .
git commit -m "Add Google Analytics tracking for bookmark scans"
git push
```

2. If using Vercel:
   - Go to Vercel dashboard
   - Select your project
   - Go to **Settings** → **Environment Variables**
   - Add `NEXT_PUBLIC_GA_MEASUREMENT_ID` with your measurement ID
   - Redeploy

### Step 5: Verify Tracking Works

1. Visit your deployed site: `briansbookcase.org/bookmark`
2. Wait 24-48 hours for data to appear
3. In Google Analytics, go to **Reports** → **Realtime**
4. Visit `/bookmark` in another browser tab
5. You should see the visit appear in Realtime report within seconds

---

## Viewing Bookmark Scan Data

### Geographic Data

**See where scans are coming from:**

1. In Google Analytics, go to **Reports**
2. Click **User** → **User attributes** → **Overview**
3. Scroll to "Users by country"
4. Click "View country details" for full breakdown
5. Can also see city, region data

**Filter by bookmark page:**

1. Click **Add filter** (top right)
2. Select **Page path and screen class**
3. Set to **contains** → `/bookmark`
4. Apply filter
5. Now all geographic data is filtered to bookmark scans only

### Bookmark Scan Count

**Total scans over time:**

1. Go to **Reports** → **Engagement** → **Pages and screens**
2. Search for `/bookmark` in the page path list
3. See views, users, sessions

**Custom bookmark scan event:**

1. Go to **Reports** → **Engagement** → **Events**
2. Look for `bookmark_scan` event
3. Click it to see details
4. See event count, users who triggered it

### Time-Based Analysis

**When are bookmarks being scanned:**

1. Go to any report (like Pages and screens)
2. Filter to `/bookmark` page
3. Adjust date range (top right)
4. View graph to see scan trends over time

### Device & Browser Data

**What devices are scanning:**

1. Go to **Reports** → **Tech** → **Overview**
2. Filter to `/bookmark` page
3. See breakdown by:
   - Device type (mobile, desktop, tablet)
   - Browser
   - Operating system
   - Screen resolution

---

## Alternative: Vercel Analytics (Simpler Option)

If you're using Vercel for hosting, you can use their built-in analytics instead of Google Analytics.

### Setup

1. In Vercel dashboard, go to your project
2. Click **Analytics** tab
3. Click **Enable**
4. Install package:
```bash
npm install @vercel/analytics
```

5. Update `app/layout.tsx`:
```typescript
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### Viewing Data

1. Go to Vercel dashboard → Analytics
2. See top pages (look for `/bookmark`)
3. Geographic data included (country level)
4. Real-time data

**Pros:**
- Easier setup
- Privacy-friendly (no cookies)
- Fast performance
- Built into hosting

**Cons:**
- Less detailed than Google Analytics
- Limited free tier (2,500 events/month on Hobby plan)
- No custom event tracking (just page views)

---

## Tracking Multiple Bookmark Campaigns

If you distribute bookmarks in different locations (e.g., bookstore A, bookstore B, library), you can track them separately.

### Method 1: Different URLs

Create multiple redirect pages:
- `/bookmark/bookstore-a`
- `/bookmark/bookstore-b`
- `/bookmark/library`

Each redirects to homepage but tracks separately in analytics.

### Method 2: UTM Parameters

Use URLs like:
- `briansbookcase.org/bookmark?source=bookstore_a`
- `briansbookcase.org/bookmark?source=library`

Track the source parameter in analytics.

---

## Privacy Considerations

### GDPR Compliance

If you have European visitors:
- Google Analytics requires cookie consent banner
- Consider privacy-friendly alternatives:
  - **Plausible**: No cookies, GDPR compliant ($9/month)
  - **Fathom**: Privacy-first analytics ($14/month)
  - **Simple Analytics**: Cookie-free ($19/month)

### Vercel Analytics
- No cookies required
- GDPR compliant out of the box
- Good middle ground

---

## Testing Before Printing Bookmarks

### Pre-Print Checklist

1. **QR Code Works:**
   - Generate QR code with URL: `briansbookcase.org/bookmark`
   - Test scan with iPhone camera app
   - Test scan with Android camera app
   - Verify it opens your site

2. **Page Loads:**
   - Visit URL directly in browser
   - Verify welcome message appears
   - Verify redirect to homepage works
   - Check on mobile device

3. **Tracking Works:**
   - Visit URL from different device
   - Check Google Analytics Realtime report
   - Verify page view appears
   - Verify event appears (if using GA)

4. **Print Test:**
   - Print bookmark at actual size
   - Test QR scan from printed version
   - Ensure QR code size is adequate (minimum 1" × 1")

---

## Troubleshooting

### QR Code Not Working
- **Check URL**: Ensure it's exactly `briansbookcase.org/bookmark` (no typos)
- **Check QR size**: Must be at least 1" × 1" when printed
- **Check error correction**: Use High (30%) setting when generating QR
- **Test before printing**: Always test digital QR before printing thousands

### Analytics Not Showing Data
- **Wait 24-48 hours**: Google Analytics has delay
- **Check Realtime**: Use Realtime reports for immediate feedback
- **Verify GA installed**: Check browser console for gtag errors
- **Ad blockers**: Some users block analytics (normal, accept some data loss)

### Page Not Found (404)
- **Check deployment**: Ensure `/bookmark/page.tsx` is deployed
- **Clear cache**: Try incognito/private browsing
- **Check route**: URL must be `/bookmark` not `/bookmark/`

---

## Viewing Analytics Dashboard

### Google Analytics Reports You'll Use

1. **Realtime Overview**
   - See scans as they happen
   - Verify tracking is working

2. **Pages and Screens**
   - Total `/bookmark` page views
   - Track growth over time

3. **User Attributes → Country/City**
   - Where scans are coming from
   - Filter by `/bookmark` page

4. **Events**
   - `bookmark_scan` event count
   - User engagement

5. **Traffic Acquisition**
   - See bookmark traffic vs other sources
   - Compare QR scans to organic, social, etc.

### Sample Dashboard View

After a few weeks, you might see:
```
/bookmark page views: 247
Unique users: 198
Countries: 5 (USA, Canada, UK, Australia, Germany)
Top city: Seattle (42 scans)
Device breakdown: 78% mobile, 18% desktop, 4% tablet
Peak scan time: Weekday afternoons 2-5pm
```

---

## Next Steps

1. ✅ Bookmark redirect page created (`/bookmark`)
2. ⏳ Set up Google Analytics (or Vercel Analytics)
3. ⏳ Test the `/bookmark` URL
4. ⏳ Generate QR code with URL `briansbookcase.org/bookmark`
5. ⏳ Test QR code on mobile devices
6. ⏳ Update bookmark design with QR code
7. ⏳ Print test bookmarks and verify QR works
8. ⏳ Order production run
9. ⏳ Distribute at bookstores
10. ⏳ Monitor analytics to see results!

---

## Summary

You now have:
- ✅ `/bookmark` redirect page that welcomes users and redirects to homepage
- ✅ Automatic tracking of bookmark scans (when analytics is set up)
- ✅ Geographic data showing where scans come from
- ✅ Clean URL for QR code: `briansbookcase.org/bookmark`

This simple setup gives you valuable data about bookmark effectiveness while maintaining a professional user experience.
