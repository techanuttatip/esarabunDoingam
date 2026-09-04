import NextAuth from "next-auth";
import authConfig from "./auth.config";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  // Security Fix: Remove hardcoded fallback secret. AUTH_SECRET must be set in environment.
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user, account }: any) {
      if (user) {
        token.id = user.id;
        // Security Fix: Default to least-privilege role (OFFICER) instead of SUPER_ADMIN
        token.roles = (user as any).roles || ["OFFICER"];
        token.position = (user as any).position || "เจ้าหน้าที่";
      }
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session.user) {
        session.user.id = token.id;
        // Security Fix: Default to least-privilege role (OFFICER) instead of SUPER_ADMIN
        session.user.roles = token.roles || ["OFFICER"];
        session.user.position = token.position;
      }
      session.accessToken = token.accessToken;
      return session;
    },
  },
});

