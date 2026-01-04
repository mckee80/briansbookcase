# Troubleshooting Guide

## Common Issues and Solutions

### Error: Invalid supabaseUrl: Must be a valid HTTP or HTTPS URL

**Cause:** This error occurs when the Supabase environment variables are not configured or contain placeholder values.

**Solution:**
1. The app is now configured to handle missing credentials gracefully
2. You'll see a warning in the console: "Supabase is not configured"
3. To fix permanently, add your actual Supabase credentials to `.env.local`:
   - Get your credentials from https://app.supabase.com/project/_/settings/api
   - Replace the placeholder values in `.env.local`
   - Restart the dev server

**What was fixed:**
- Added fallback values in `lib/supabase.ts` to prevent errors
- Added `isSupabaseConfigured` check to gracefully handle missing credentials
- Updated `AuthProvider.tsx` to skip auth initialization when not configured

### Port Already in Use

**Symptoms:**
- `⚠ Port 3000 is in use, trying 3001 instead`
- Server starts on 3001, 3002, etc.

**Solutions:**

**Option 1: Kill the process using the port**
```bash
# Find process on port 3000
netstat -ano | findstr :3000

# Kill the process (replace PID with actual process ID)
taskkill //F //PID <PID>
```

**Option 2: Let Next.js use the next available port**
- Next.js will automatically try the next port
- Just use whichever port is shown in the terminal

**Option 3: Specify a different port**
```bash
# In package.json, modify the dev script:
"dev": "next dev -p 3005"
```

### Authentication Not Working

**Symptom:** Login/signup forms don't work

**Cause:** Supabase credentials not configured

**Solution:**
1. Set up a Supabase project at https://supabase.com
2. Create database tables using SQL from [SETUP.md](SETUP.md)
3. Add credentials to `.env.local`
4. Restart dev server

### Stripe Integration Not Working

**Symptom:** Checkout doesn't redirect to Stripe

**Cause:** Stripe credentials not configured

**Solution:**
1. Create Stripe account at https://stripe.com
2. Create products and get price IDs
3. Add credentials to `.env.local`
4. Restart dev server

### TypeScript Errors

**Symptom:** Red squiggly lines in VSCode

**Solutions:**
- Restart TypeScript server: `Ctrl+Shift+P` > "TypeScript: Restart TS Server"
- Reinstall dependencies: `npm install`
- Clear cache: Delete `.next` folder and restart

### Build Errors

**Symptom:** `npm run build` fails

**Common causes:**
- Unused imports
- Type errors
- Missing environment variables in production

**Solution:**
```bash
# Run lint to find issues
npm run lint

# Fix any reported issues
# Then try build again
npm run build
```

### Hot Reload Not Working

**Symptom:** Changes don't appear in browser

**Solutions:**
1. Hard refresh: `Ctrl+Shift+R` or `Cmd+Shift+R`
2. Check terminal for compilation errors
3. Restart dev server
4. Clear browser cache

### Database Queries Failing

**Symptom:** Database operations return errors

**Possible causes:**
1. **Tables not created:** Run SQL from [SETUP.md](SETUP.md)
2. **RLS policies:** Check Row Level Security settings
3. **Invalid credentials:** Verify `.env.local` values
4. **Network issues:** Check Supabase dashboard status

**Debug steps:**
```typescript
// Add logging to see actual errors
import { supabase } from '@/lib/supabase';

const { data, error } = await supabase.from('ebooks').select('*');
console.log('Data:', data);
console.log('Error:', error);
```

### Missing Dependencies

**Symptom:** Import errors, module not found

**Solution:**
```bash
# Reinstall all dependencies
rm -rf node_modules package-lock.json
npm install

# Or install specific package
npm install <package-name>
```

## Development Tips

### Checking Environment Variables

```typescript
// In a component
console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
```

### Clearing Next.js Cache

```bash
# Delete cache and rebuild
rm -rf .next
npm run dev
```

### Viewing Logs

Check the dev server terminal for:
- Compilation errors
- Runtime errors
- API route responses
- Console.log output (server-side)

Browser console for:
- Client-side errors
- Network requests
- Console.log output (client-side)

### Testing API Routes

Use a tool like Postman or curl:
```bash
# Test auth callback
curl http://localhost:3000/api/auth/callback

# Test logout (POST request)
curl -X POST http://localhost:3000/api/auth/logout
```

## Getting Help

If you're still stuck:

1. **Check the documentation:**
   - [SETUP.md](SETUP.md) - Setup instructions
   - [QUICK_REFERENCE.md](QUICK_REFERENCE.md) - Quick reference
   - [README.md](README.md) - Project overview

2. **Check external docs:**
   - Next.js: https://nextjs.org/docs
   - Supabase: https://supabase.com/docs
   - Stripe: https://stripe.com/docs

3. **Common error messages:**
   - Search the error message on Stack Overflow
   - Check GitHub issues for Next.js, Supabase, or Stripe
   - Look for similar issues in the Next.js discussions

4. **Enable verbose logging:**
   ```bash
   # Run with debug output
   DEBUG=* npm run dev
   ```

## Prevention Checklist

Before starting development:
- [ ] Node.js installed (v18+)
- [ ] Dependencies installed (`npm install`)
- [ ] `.env.local` created from `.env.example`
- [ ] Environment variables configured (or acknowledged as optional)
- [ ] Dev server starts without errors
- [ ] Home page loads in browser

Before committing code:
- [ ] Code lints without errors (`npm run lint`)
- [ ] TypeScript compiles without errors
- [ ] No sensitive data in committed files
- [ ] `.env.local` is in `.gitignore`
