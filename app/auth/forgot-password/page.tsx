"use client"

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      toast.success("Password reset successfully!");
      setLoading(false);
      setTimeout(() => {
        router.push("/auth/sign-in");
      }, 1200);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <form className="bg-card p-8 rounded-xl shadow-md w-full max-w-md flex flex-col gap-6 border" onSubmit={handleSubmit}>
        <h1 className="text-2xl font-bold mb-2 text-center">Forgot your password?</h1>
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="font-medium">Email</label>
          <Input id="email" name="email" type="email" autoComplete="email" required />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="new-password" className="font-medium">New Password</label>
          <Input id="new-password" name="new-password" type="password" autoComplete="new-password" required />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="confirm-password" className="font-medium">Confirm Password</label>
          <Input id="confirm-password" name="confirm-password" type="password" autoComplete="new-password" required />
        </div>
        <Button asChild type="submit" className="w-full mt-2" disabled={loading}>
          {loading ? "Resetting..." : "Reset Password"}
        </Button>
      </form>
    </div>
  );
} 