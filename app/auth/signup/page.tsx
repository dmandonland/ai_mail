// src/app/signup/page.jsx

import {
  getLoggedInUser
} from "@/lib/server/appwrite";
// src/app/signup/page.jsx

// previous imports ...

import { ID } from "node-appwrite";
import { createAdminClient } from "@/lib/server/appwrite";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {signUpWithGithub} from "@/lib/server/oauth";

export async function signUpWithEmail(formData: FormData): Promise<void> {
    "use server";

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;

    const { account }: { account: import("node-appwrite").Account } = await createAdminClient();
    const user: unknown = await getLoggedInUser();
    if (user) redirect("/account");

    await account.create(ID.unique(), email, password, name);
    const session: { secret: string } = await account.createEmailPasswordSession(email, password);

    (await cookies()).set("my-custom-session", session.secret, {
        path: "/",
        httpOnly: true,
        sameSite: "strict",
        secure: true,
    });

    redirect("/account");
}

// the SignUpPage component ...
import React from "react";

export default async function SignUpPage() {
  const user = await getLoggedInUser();
  if (user) redirect("/account");

  return (
    <>
      <form action={signUpWithEmail}>
        <input
          id="email"
          name="email"
          placeholder="Email"
          type="email"
        />
        <input
          id="password"
          name="password"
          placeholder="Password"
          minLength={8}
          type="password"
        />
        <input
          id="name"
          name="name"
          placeholder="Name"
          type="text"
        />
        <button type="submit">Sign up</button>
      </form>
      

      {/* ... existing form */}
      <form action={signUpWithGithub}>
        <button type="submit">Sign up with GitHub</button>
      </form>


    </>
  );
}


