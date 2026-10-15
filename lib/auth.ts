import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/db";
import User from "@/models/User";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        emailOrUsername: { label: "Email or Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.emailOrUsername || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        await connectDB();

        const identifier = (credentials.emailOrUsername as string).toLowerCase().trim();
        const user = await User.findOne({
          $or: [{ email: identifier }, { username: identifier }],
        });

        if (!user) {
          throw new Error("No user found with this email or username");
        }

        if (!user.isVerified) {
          throw new Error("Please verify your email address before logging in");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error("Invalid password");
        }

        return {
          id: user._id.toString(),
          username: user.username,
          email: user.email,
          isVerified: user.isVerified,
          isAcceptingFeedback: user.isAcceptingFeedback,
          image: user.profileImage || null,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.username = (user as any).username;
        token.isVerified = (user as any).isVerified;
        token.isAcceptingFeedback = (user as any).isAcceptingFeedback;
      }
      if (trigger === "update" && session) {
        if (session.user?.isAcceptingFeedback !== undefined) {
          token.isAcceptingFeedback = session.user.isAcceptingFeedback;
        }
        if (session.user?.username) {
          token.username = session.user.username;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
        session.user.isVerified = token.isVerified as boolean;
        session.user.isAcceptingFeedback = token.isAcceptingFeedback as boolean;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "unsaid-super-secret-key-32chars-min-change-in-env",
});
