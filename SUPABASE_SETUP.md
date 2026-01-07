# Supabase Setup Instructions

## Database Tables Setup (REQUIRED)

Before using the application, you **must** set up the database tables in Supabase. The application stores ebooks and authors in the database for persistence across all users.

### Steps to Create Database Tables:

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Open the `supabase_migrations.sql` file from your project root
4. Copy the entire SQL script
5. Paste it into the SQL Editor
6. Click **Run** to execute the script

This will create:
- `ebooks` table - Stores all ebook information
- `authors` table - Stores author information with book counts
- Row Level Security policies - Controls who can read/write data
- Triggers - Automatically updates author book counts when ebooks change
- Initial sample data - 4 ebooks and 4 authors to get started

### What the Migration Does:

- **Creates tables** with proper schema and indexes
- **Enables RLS (Row Level Security)** so anyone can read, but only authenticated users can modify
- **Auto-syncs author book counts** whenever ebooks are added/removed
- **Inserts initial data** so you have sample ebooks to start with

### After Running the Migration:

The application will automatically:
- Fetch ebooks and authors from the database on load
- Save all admin changes to the database
- Keep author book counts synchronized
- Fall back to localStorage if database connection fails

---

## Admin Access Configuration

To restrict admin page access to specific users, you need to configure admin emails.

### Option 1: Using Admin Email List (Current Implementation)

1. Open `lib/adminCheck.ts`
2. Add your admin email address to the `ADMIN_EMAILS` array:

```typescript
const ADMIN_EMAILS = [
  'mckee80@hotmail.com', // Your admin email
  // Add more admin emails here if needed
];
```

3. Save the file
4. Users with these email addresses will have access to the `/admin` page

### Option 2: Using User Metadata (Alternative)

For a more flexible approach using Supabase user metadata:

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** → **Users**
3. Click on the user you want to make an admin
4. Under **User Metadata**, add:
   ```json
   {
     "role": "admin"
   }
   ```
5. Update your code to use `isAdminByRole()` instead of `isAdmin()` in:
   - `components/AdminRoute.tsx`
   - `components/Navbar.tsx`

### How It Works:

- **AdminRoute Component**: Protects the admin page from unauthorized access
- **isAdmin() Function**: Checks if user's email is in the admin list
- **Navbar**: Only shows "Admin" link to users with admin access
- **Automatic Redirects**:
  - Not logged in → Redirected to `/login`
  - Logged in but not admin → Redirected to home with error message

---

## Delete User Function

To enable the account deletion feature, you need to create a database function in Supabase.

### Steps:

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Create a new query and paste the following SQL:

```sql
-- Function to delete the current user's account
CREATE OR REPLACE FUNCTION delete_user()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Delete the user from auth.users table
  DELETE FROM auth.users WHERE id = auth.uid();
END;
$$;
```

4. Run the query to create the function
5. The delete account feature will now work properly

### How it works:

- When a user clicks "Delete My Account" on the account page, it calls this database function
- The function uses `auth.uid()` to get the current user's ID
- It deletes the user record from the `auth.users` table
- The user is then automatically signed out and redirected to the home page

### Fallback:

If the function doesn't exist or fails, the application will gracefully fall back to just signing out the user without deleting their data.
