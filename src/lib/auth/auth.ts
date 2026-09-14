import NextAuth from "next-auth";
import authConfig from "./auth.config";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  // Fallback secret ensures build/SSG doesn't crash on Vercel if AUTH_SECRET is not yet configured in project settings
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "smartsarabun-build-secret-key-2569-replace-in-production-vault",
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

