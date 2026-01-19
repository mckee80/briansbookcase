# Brian's Bookcase Bookmark Design Specification

## Overview
Minimalist double-sided bookmark for distribution with bookstore book sales. Designed to drive website traffic and raise awareness for suicide prevention through literature.

---

## Physical Specifications

### Dimensions
- **Size**: 2" × 6" (50.8mm × 152.4mm)
- **Orientation**: Vertical/Portrait
- **Bleed**: 0.125" (3.175mm) on all sides
- **Safe Zone**: 0.25" (6.35mm) from trim edge

### Material & Finish
- **Stock**: 14pt cardstock (recommended) or 16pt for premium feel
- **Finish**: Matte laminate (durable, professional, less glare)
- **Corners**: Rounded (2mm radius)
- **Coating**: Both sides laminated for longevity

### Print Specifications
- **Color Mode**: CMYK (4-color process)
- **Resolution**: 300 DPI minimum
- **File Format**: PDF with embedded fonts and bleed

---

## Brand Colors (CMYK for Print)

### Primary Palette
- **Rich Brown (Primary)**: C=67 M=82 Y=85 K=72 | Hex #2C1810
- **Saddle Brown (Accent)**: C=42 M=66 Y=76 K=48 | Hex #8B4513
- **Parchment (Background)**: C=4 M=7 Y=15 K=0 | Hex #F5E6D3
- **Warm Brown (Border)**: C=35 M=49 Y=56 K=31 | Hex #8B7355

### Typography
- **Logo/Headings**: EB Garamond or Crimson Text
- **Body Text**: Crimson Pro or Georgia
- **Accent/Script**: Dancing Script (if used)

---

## FRONT SIDE Design

### Layout Structure
```
┌─────────────────────┐
│                     │ ← 0.25" safe zone
│      [LOGO]         │ ← Logo: centered, 1.5" × 1.5" max
│                     │
│   Brian's Bookcase  │ ← Title (if not in logo): 16-18pt
│                     │
│  Stories that save  │ ← Tagline: 12-14pt, centered
│       lives         │
│                     │
│                     │
│    ═══════════      │ ← Optional decorative element
│                     │
│                     │
│                     │ ← 0.25" safe zone
└─────────────────────┘
```

### Elements

**Logo**
- Position: Top center, 0.5" from top edge (within safe zone)
- Size: Maximum 1.5" × 1.5" (maintain aspect ratio)
- Color: Rich Brown (#2C1810) on Parchment background

**Tagline**
- Text: "Stories that save lives"
- Font: Crimson Pro, 12-14pt
- Color: Rich Brown (#2C1810)
- Position: Centered, 0.5" below logo
- Style: Regular weight, centered alignment

**Background**
- Color: Parchment (#F5E6D3)
- Pattern: Solid or subtle paper texture (optional, 5% opacity max)

**Optional Decorative Element**
- Small book icon, flourish, or divider line
- Position: Lower third
- Color: Saddle Brown (#8B4513) at 30% opacity
- Keep minimal to maintain clean aesthetic

---

## BACK SIDE Design

### Layout Structure
```
┌─────────────────────┐
│                     │ ← 0.25" safe zone
│                     │
│    ┌─────────┐      │
│    │         │      │ ← QR Code: 1" × 1", centered
│    │   QR    │      │
│    │         │      │
│    └─────────┘      │
│                     │
│ Scan to browse our  │ ← Call-to-action: 10pt
│   free library      │
│                     │
│ briansbookcase.com  │ ← URL: 11-12pt, bold
│                     │
│  All proceeds from  │ ← Mission: 9pt, italic
│ book sales support  │
│ suicide prevention  │
│                     │
└─────────────────────┘
```

### Elements

**QR Code**
- Size: 1" × 1" (25.4mm × 25.4mm)
- Position: Centered horizontally, 1" from top edge
- URL: `https://briansbookcase.com` (or tracking URL: `briansbookcase.com/bookmark`)
- Error Correction: High (30%) for printing durability
- Color: Rich Brown (#2C1810) on white background
- Border: 0.1" white margin around QR for scanning reliability

**Call-to-Action**
- Text: "Scan to browse our free library"
- Font: Crimson Pro, 10pt
- Color: Rich Brown (#2C1810)
- Position: Centered, 0.25" below QR code
- Style: Regular weight

**Website URL**
- Text: "briansbookcase.com"
- Font: Crimson Pro, 11-12pt
- Color: Rich Brown (#2C1810)
- Position: Centered, 0.25" below call-to-action
- Style: Bold or semibold

**Mission Statement**
- Text: "All proceeds from book sales support suicide prevention"
- Font: Crimson Pro, 9pt
- Color: Saddle Brown (#8B4513)
- Position: Centered, lower third
- Style: Italic
- Line spacing: 1.3

**Background**
- Color: Parchment (#F5E6D3)
- Pattern: Solid (match front side)

---

## QR Code Generation

### URL Options

**Option 1: Direct**
- Target: `https://briansbookcase.com`
- Pro: Simple, direct to homepage
- Con: No analytics on bookmark scans

**Option 2: Tracking (Recommended)**
- Target: `https://briansbookcase.com/bookmark`
- Set up redirect in Next.js to homepage
- Pro: Track bookmark effectiveness via analytics
- Con: Requires creating redirect route

### QR Code Generators
1. **QR Code Generator** (qr-code-generator.com) - Free, high error correction
2. **QRCode Monkey** (qrcode-monkey.com) - Custom colors, SVG export
3. **Canva** - Built-in QR generator if using Canva for design
4. **Adobe Express** - Professional-grade

### Settings
- Error correction: **H (High - 30%)**
- Format: **SVG** (vector, scales perfectly) or **PNG at 600 DPI**
- Quiet zone: Minimum 0.1" white border around code
- Test on multiple devices before printing!

---

## Typography Specifications

### Font Hierarchy
- **Logo/Brand Name**: EB Garamond, 16-18pt, Bold
- **Tagline**: Crimson Pro, 12-14pt, Regular
- **Call-to-Action**: Crimson Pro, 10pt, Regular
- **URL**: Crimson Pro, 11-12pt, Semibold
- **Mission Statement**: Crimson Pro, 9pt, Italic

### Font Alternatives
If primary fonts unavailable:
- **Primary Alternative**: Georgia (widely available)
- **Script Alternative**: None (keep simple if Dancing Script unavailable)

### Text Alignment
- All text: **Center-aligned**
- Line spacing: 1.2-1.4 for readability

---

## Production Guidelines

### Printing Vendors
**Recommended:**
- **VistaPrint**: Affordable, good quality, fast turnaround
- **Moo**: Premium quality, excellent finish options
- **PrintPlace**: Bulk discounts, trade printing quality
- **Local Print Shop**: Support local, faster pickup, can review proofs in person

### Quantity & Pricing (Approximate)
- 250 bookmarks: ~$40-75 ($0.16-0.30 each)
- 500 bookmarks: ~$60-120 ($0.12-0.24 each)
- 1,000 bookmarks: ~$90-180 ($0.09-0.18 each)

Prices vary by vendor, finish, and turnaround time.

### Pre-Press Checklist
- [ ] All text converted to outlines OR fonts embedded
- [ ] QR code tested and working
- [ ] Colors in CMYK mode
- [ ] Bleed area included (0.125" on all sides)
- [ ] Nothing important within 0.25" of trim edge
- [ ] Resolution 300 DPI minimum
- [ ] PDF format with printer marks
- [ ] Proofread all text carefully
- [ ] Test print at actual size if possible

### Turnaround Time
- **Standard**: 5-7 business days
- **Rush**: 2-3 business days (additional cost)
- **Local**: 1-3 days depending on shop

---

## Usage & Distribution

### Primary Use Case
- **Bookstore Sales**: Include 1 bookmark with each book purchase
- Position as: "Thank you for supporting our cause"

### Secondary Uses
- Author events or book signings
- Library partnerships
- Donation acknowledgments (mail with thank-you card)
- Community events/fundraisers
- Coffee shop/bookstore bulletin boards (with permission)

### Messaging
The bookmark serves three purposes:
1. **Functional**: Actual bookmark for the purchased book
2. **Awareness**: Introduces Brian's Bookcase to new readers
3. **Call-to-Action**: QR code drives website traffic for ebook library

---

## Next Steps

### 1. Create Tracking URL (Optional but Recommended)
Add a redirect route in your Next.js app:

**File**: `app/bookmark/page.tsx`
```typescript
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function BookmarkRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Track the scan (optional analytics event)
    // analytics.track('Bookmark Scanned');

    // Redirect to homepage
    router.push('/');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Redirecting...</p>
    </div>
  );
}
```

This allows you to track bookmark scans in your analytics.

### 2. Design the Bookmark

**Tools:**
- **Canva** (easiest, templates available, web-based)
- **Adobe Illustrator** (professional, vector-based)
- **Affinity Designer** (one-time purchase alternative to Illustrator)
- **Figma** (free, collaborative, web-based)

**Process:**
1. Set up artboard at 2.25" × 6.25" (includes 0.125" bleed)
2. Add guides for safe zone (0.25" from edge)
3. Place logo and text per specifications above
4. Generate and place QR code
5. Export as PDF with bleed and crop marks

### 3. Get a Proof
- Order a small proof run (10-25 pieces) first
- Test QR code on multiple devices
- Check colors match expectations
- Verify text is readable at actual size
- Make adjustments if needed

### 4. Order Production Run
- Start with 250-500 for initial distribution
- Reorder based on bookstore sales volume

---

## Design Templates

### Canva Template Search
Search for: "bookmark 2x6" or "vertical bookmark"
- Filter by "printable" templates
- Customize with your brand colors and logo

### DIY Template Dimensions
```
Total Size (with bleed): 2.25" × 6.25"
Trim Size: 2" × 6"
Safe Zone: 1.5" × 5.5" (keep all important elements here)
```

---

## Contact Information

If you need a designer to create this:
- **Fiverr**: Search "bookmark design" ($20-50)
- **99designs**: Contest or 1-on-1 project ($100-300)
- **Local graphic designer**: Support local creatives
- **Design student**: Reach out to local college art departments

Provide them:
1. This specification document
2. Your logo file (vector format: SVG, AI, or EPS)
3. QR code (SVG or high-res PNG)
4. Brand colors (from this doc)

---

## Accessibility Notes

- High contrast (dark brown on parchment) ensures readability
- QR code size (1") is large enough for easy scanning
- URL printed below QR code for manual entry if needed
- Simple, clean design is visually accessible

---

## Legal/Content Considerations

- **Suicide prevention messaging**: Appropriate and important - highlights mission
- **Website URL**: Double-check spelling and current domain
- **QR destination**: Ensure landing page is welcoming and clear about your mission
- **No contact info**: Intentionally minimal - QR drives to website for more info

---

## Summary

This bookmark design balances:
- **Simplicity**: Clean, uncluttered design
- **Branding**: Consistent with website aesthetic
- **Functionality**: QR code for easy access
- **Mission**: Clear messaging about suicide prevention
- **Practicality**: Durable for actual use as a bookmark

The minimalist approach ensures it feels like a quality gift rather than marketing material, which is appropriate for the bookstore giveaway context.
