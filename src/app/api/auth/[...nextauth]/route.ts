
import NextAuth, { SessionStrategy } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";



export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "usuario@laofi.com" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        console.log("[NextAuth] Credenciales recibidas:", credentials);
        // Usuario de prueba hardcodeado
        if (
          credentials?.email === "test@laofi.com" &&
          credentials?.password === "1234"
        ) {
          console.log("[NextAuth] Login exitoso");
          return {
            id: "1",
            name: "Usuario Test",
            email: "test@laofi.com",
            role: "admin",
          };
        }
        console.log("[NextAuth] Login fallido");
        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt" as SessionStrategy,
  },
  pages: {
    signIn: "/login",
    //error: "/login/error", // Pantalla personalizada de error
  },
  callbacks: {
    async jwt({ token, user }: { token: any; user?: any }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }: { session: import("next-auth").Session, token: any }) {
      if (token && session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
        (session.user as any).email = token.email;
        (session.user as any).name = token.name;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

// Export both GET and POST handlers for NextAuth to support both authentication and session endpoints.
// NextAuth expects both methods to be handled by the same function in the route handler.
export { handler as GET, handler as POST };

