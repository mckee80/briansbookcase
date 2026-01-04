import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  // TODO: Implement Supabase logout
  // const supabase = createClient();
  // await supabase.auth.signOut();

  return NextResponse.json({ success: true });
}
