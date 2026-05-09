import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

const e2eAuthEnabled = process.env.E2E_TEST_AUTH === "true";
export const e2eEmail = "e2e@shogun.local";

function normalizeEmail(email?: unknown) {
  return typeof email === "string" ? email.trim().toLowerCase() : "";
}

function getAllowedEmails() {
  const configuredEmails =
    e2eAuthEnabled && process.env.E2E_AUTH_ALLOWED_EMAILS
      ? process.env.E2E_AUTH_ALLOWED_EMAILS
      : process.env.AUTH_ALLOWED_EMAILS;

  return new Set(
    (configuredEmails ?? "")
      .split(",")
      .map(normalizeEmail)
      .filter(Boolean)
  );
}

const allowedEmails = getAllowedEmails();

function isAllowedEmail(email: string) {
  const emails = e2eAuthEnabled ? getAllowedEmails() : allowedEmails;
  return emails.has(email);
}

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
    Google,
    ...(e2eAuthEnabled
      ? [
          Credentials({
            name: "E2E Test",
            credentials: {
              email: { label: "Email", type: "email" }
            },
            async authorize(credentials) {
              const email = normalizeEmail(credentials?.email);

              if (!email) {
                return null;
              }

              return {
                id: "e2e-test-user",
                name: "Diogo Silva",
                email
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
      const email =
        account?.provider === "credentials" ? normalizeEmail(user.email) : normalizeEmail(profile?.email ?? user.email);
      return isAllowedEmail(email);
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
  return auth();
}
