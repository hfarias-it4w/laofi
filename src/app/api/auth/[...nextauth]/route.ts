
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDatabase, Usuario } from "@/lib/mongo";
//import bcrypt from "bcryptjs";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "usuario@laofi.com" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        await connectToDatabase();
        // Buscar usuario por correo
        const user = await Usuario.findOne({ correo: credentials?.email, activo: true });
        if (!user) return null;
        // Comparar contraseña (en backend.js está como contraseñaHash, pero aquí asumimos texto plano para demo)
        // Si usas hash, descomenta la línea de bcrypt y comenta la comparación directa
        // const valid = await bcrypt.compare(credentials?.password || "", user.contraseñaHash);
        const valid = credentials?.password === user.contraseñaHash;
        if (!valid) return null;
        // NextAuth espera que el usuario tenga id:string
        return {
          id: user._id.toString(),
          name: user.nombre,
          email: user.correo,
          role: user.rol,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
});

// Export both GET and POST handlers for NextAuth to support both authentication and session endpoints.
// NextAuth expects both methods to be handled by the same function in the route handler.
export { handler as GET, handler as POST };
