
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions, User as NextAuthUser } from "next-auth";
import { dbConnect } from "@/lib/mongodb";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
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
        } as NextAuthUser & { role: string };
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 días en segundos
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user && typeof user === "object" && "role" in user) {
        token.role = (user as any).role;
      }
      if (user && typeof user === "object" && "id" in user) {
        token.id = (user as any).id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.role) {
        (session.user as any).role = token.role;
      }
      // Agregar el _id del usuario a la sesión para que esté disponible en el backend
      if (session.user && token.sub) {
        (session.user as any)._id = token.sub;
      }
      if (session.user && token.id) {
        (session.user as any).id = token.id;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login"
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
