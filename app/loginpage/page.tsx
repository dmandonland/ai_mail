"use client";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const LoginPage = () => {
  interface User {
    id: string;
    email: string;
    // Add other properties as needed
  }
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const login = async (email: string, password: string) => {
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      return;
    }
    const { data } = await supabase.auth.getUser();
    if (data.user) {
      setLoggedInUser({ id: data.user.id, email: data.user.email ?? "" });
    }
  };

  const register = async () => {
    setError("");
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });
    if (error) {
      setError(error.message);
      return;
    }
    // Optionally auto-login after registration
    await login(email, password);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setLoggedInUser(null);
  };

  if (loggedInUser) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background p-4">
        <Card className="w-full max-w-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Welcome</CardTitle>
            <CardDescription>Logged in as {loggedInUser.email}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              className="w-full bg-[#a24ad9]"
              onClick={logout}
            >
              Logout
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Sign In / Register</CardTitle>
          <CardDescription>
            Enter your credentials to access or create your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <form
            className="grid gap-4"
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <Button
              type="button"
              className="w-full bg-[#a24ad9]"
              onClick={async () => {
                await login(email, password);
                if (!error) window.location.href = "/mail-client";
              }}
            >
              Login
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={register}
            >
              Register
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link
            href="../auth/forgot-password"
            className="text-sm text-muted-foreground hover:text-primary"
          >
            Forgot your password?
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginPage;
