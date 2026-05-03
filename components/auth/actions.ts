"use server";

import { signIn, signOut } from "@/auth";

function safeCallbackUrl(value: FormDataEntryValue | null) {
  const callbackUrl = String(value ?? "/");
  return callbackUrl.startsWith("/") && !callbackUrl.startsWith("//") ? callbackUrl : "/";
}

export async function signInWithGoogle(formData: FormData) {
  await signIn("google", { redirectTo: safeCallbackUrl(formData.get("callbackUrl")) });
}

export async function signOutOfGoogle() {
  await signOut({ redirectTo: "/login" });
}
