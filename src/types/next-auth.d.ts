import { DefaultSession, DefaultUser } from "next-auth";
import { JWT as DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user: {
      id?: string;
      roles?: string[];
      departmentId?: string;
      position?: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    roles?: string[];
    departmentId?: string;
    position?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    accessToken?: string;
    roles?: string[];
    departmentId?: string;
    position?: string;
  }
}
