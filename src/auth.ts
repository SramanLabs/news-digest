import NextAuth from "next-auth"
import Google from "next-auth/providers/google"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        const userEmail = user.email?.toLowerCase();
        
        if (userEmail) {
          try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://news-digest-backend.onrender.com";
            const res = await fetch(`${apiUrl}/api/auth/verify?email=${encodeURIComponent(userEmail)}`);
            if (res.ok) {
              const data = await res.json();
              if (data.allowed) {
                // Attach role to user object so it can be passed to jwt callback
                user.role = data.role;
                return true;
              }
            }
          } catch (error) {
            console.error("Auth verification failed", error);
          }
        }
        return false;
      }
      return false;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.role) {
        session.user.role = token.role as string;
      }
      return session;
    }
  }
})
