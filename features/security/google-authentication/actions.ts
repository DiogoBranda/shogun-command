"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { e2eAuthCookieName, signIn, signOut } from "@/auth";

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

  const cookieStore = await cookies();
  cookieStore.set(e2eAuthCookieName, "true", {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/"
  });
  redirect(safeCallbackUrl(formData.get("callbackUrl")));
}

export async function signOutOfGoogle() {
  if (process.env.E2E_TEST_AUTH === "true") {
    const cookieStore = await cookies();
    cookieStore.delete(e2eAuthCookieName);
  }

  await signOut({ redirectTo: "/login" });
}
