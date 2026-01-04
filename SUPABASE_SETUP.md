# Supabase Setup Instructions

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
