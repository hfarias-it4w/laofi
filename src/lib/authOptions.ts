import type { NextAuthOptions, User as NextAuthUser } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { dbConnect } from "./mongodb";
import { User } from "@/models/User";

const rawNextAuthSecret = process.env.NEXTAUTH_SECRET?.trim();
const rawAuthSecret = process.env.AUTH_SECRET?.trim();
const authSecret = rawNextAuthSecret && rawNextAuthSecret.length > 0 ? rawNextAuthSecret : rawAuthSecret ?? "";

if (!authSecret) {
  throw new Error(
    "NEXTAUTH_SECRET o AUTH_SECRET no están definidos o están vacíos. Configurá la variable de entorno antes de iniciar el servidor."
  );
}

export const authOptions: NextAuthOptions = {
  secret: authSecret,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "correo@ejemplo.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        await dbConnect();
        if (!credentials?.email || !credentials?.password) return null;
        const user = await User.findOne({ email: credentials.email });
        if (!user) return null;
        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return null;
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role || "user",
        } satisfies NextAuthUser & { role: string; id: string };
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user && typeof user === "object" && "role" in user) {
        token.role = (user as NextAuthUser & { role?: string }).role;
      }
      if (user && typeof user === "object" && "id" in user) {
        token.id = (user as NextAuthUser & { id?: string }).id;
      }
      return token;
    },
    async session({ session, token }) {
      const mutableUser = session.user as (typeof session.user) & { role?: string; _id?: string; id?: string };
      if (mutableUser && token.role) {
        mutableUser.role = token.role as string;
      }
      if (mutableUser && token.sub) {
        mutableUser._id = token.sub;
      }
      if (mutableUser && token.id) {
        mutableUser.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login"
  }
};
