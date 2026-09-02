import NextAuth from "next-auth";
import authConfig from "./auth.config";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "smartsarabun_default_auth_secret_for_development",
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user, account }: any) {
      if (user) {
        token.id = user.id;
        token.roles = (user as any).roles || ["SUPER_ADMIN", "ADMIN"];
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
        session.user.roles = token.roles || ["SUPER_ADMIN", "ADMIN"];
        session.user.position = token.position;
      }
      session.accessToken = token.accessToken;
      return session;
    },
  },
});
