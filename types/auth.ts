import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string;
      isVerified: boolean;
      isAcceptingFeedback: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    id?: string;
    username?: string;
    isVerified?: boolean;
    isAcceptingFeedback?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    username?: string;
    isVerified?: boolean;
    isAcceptingFeedback?: boolean;
  }
}
