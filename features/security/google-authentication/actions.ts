"use server";

import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { e2eEmail, signIn, signOut } from "@/auth";

function safeCallbackUrl(value: FormDataEntryValue | null) {
  const callbackUrl = String(value ?? "/");
  return callbackUrl.startsWith("/") && !callbackUrl.startsWith("//") ? callbackUrl : "/";
}

export async function signInWithGoogle(formData: FormData) {
  await signIn("google", { redirectTo: safeCallbackUrl(formData.get("callbackUrl")) });
}

export async function signInWithE2ETest(formData: FormData) {
  if (process.env.E2E_TEST_AUTH !== "true") {
    throw new Error("E2E test auth is disabled");
  }

  try {
    await signIn("credentials", {
      email: String(formData.get("email") ?? e2eEmail),
      redirectTo: safeCallbackUrl(formData.get("callbackUrl"))
    });
  } catch (error) {
    if (error instanceof AuthError) {
      const errorType = error.type === "AccessDenied" ? "AccessDenied" : "Configuration";
      redirect(`/login?error=${errorType}`);
    }

    throw error;
  }
}

export async function signOutOfGoogle() {
  await signOut({ redirectTo: "/login" });
}
