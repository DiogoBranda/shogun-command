import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { cookies } from "next/headers";

const e2eAuthEnabled = process.env.E2E_TEST_AUTH === "true";
export const e2eAuthCookieName = "e2e-test-auth";
export const e2eEmail = "e2e@shogun.local";

const allowedEmails = new Set(
  (process.env.AUTH_ALLOWED_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean)
);

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
    Google,
    ...(e2eAuthEnabled
      ? [
          Credentials({
            id: "e2e-test",
            name: "E2E Test",
            credentials: {},
            async authorize() {
              return {
                id: "e2e-test-user",
                name: "Diogo Silva",
                email: e2eEmail
              };
            }
          })
        ]
      : [])
  ],
  session: {
    strategy: "jwt"
  },
  callbacks: {
    signIn({ account, profile, user }) {
      if (e2eAuthEnabled && account?.provider === "e2e-test" && user.email === e2eEmail) {
        return true;
      }

      const email = (profile?.email ?? user.email ?? "").toLowerCase();
      return allowedEmails.has(email);
    },
    session({ session, token }) {
      if (session.user && token.email) {
        session.user.email = token.email;
      }

      return session;
    }
  },
  pages: {
    signIn: "/login",
    error: "/login"
  }
});

export async function getCommandSession() {
  if (e2eAuthEnabled) {
    const cookieStore = await cookies();
    if (cookieStore.get(e2eAuthCookieName)?.value === "true") {
      return {
        user: {
          name: "Diogo Silva",
          email: e2eEmail
        }
      };
    }
  }

  return auth();
}
