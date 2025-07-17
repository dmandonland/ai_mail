// app/api/env-check/route.ts
import { NextResponse } from 'next/server';

export function GET() {
  return NextResponse.json({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Loaded' : '❌ Missing',
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Loaded' : '❌ Missing',
    smtpUser: process.env.SMTP_USER ? '✅ Loaded' : '❌ Missing'
  });
}