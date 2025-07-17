import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  // 1. Authenticate
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // 2. Send SMTP Email
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const { to, subject, body } = await request.json();
  await transporter.sendMail({
    from: `"Mail Client" <no-reply@example.com>`,
    to,
    subject,
    text: body,
  });

  // 3. Save to Supabase
  const { error } = await supabase.from('emails').insert({
    user_id: user.id,
    to_email: to,
    subject,
    body
  });

  if (error) console.error('DB save failed:', error);

  return NextResponse.json({ success: true });
}