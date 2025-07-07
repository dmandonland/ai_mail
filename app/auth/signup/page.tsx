'use client';

import { useState } from 'react';
import { account } from '@/lib/server/appwrite';
import { ID } from 'appwrite';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await account.create(ID.unique(), email, password, name);
      await account.createSession(email, password); // auto-login
      router.push('/dashboard'); // redirect after signup
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'message' in err) {
        setError((err as { message?: string }).message || 'Signup failed');
      } else {
        setError('Signup failed');
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <form onSubmit={handleSignup}>
        <Card className="w-full max-w-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Sign Up</CardTitle>
            <CardDescription>Create a new account to get started.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {error && <p className="rounded bg-red-100 p-2 text-red-600">{error}</p>}
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full bg-[#a24ad9]">
              Create Account
            </Button>
          </CardContent>
          <CardFooter className="flex justify-center">
            <span className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link href="/auth/sign-in" className="text-[#a24ad9] hover:underline">Sign In</Link>
            </span>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
