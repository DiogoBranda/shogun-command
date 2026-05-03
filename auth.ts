import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

const allowedEmails = new Set(
  (process.env.AUTH_ALLOWED_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean)
);

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [Google],
  session: {
    strategy: "jwt"
  },
  callbacks: {
    signIn({ profile, user }) {
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
