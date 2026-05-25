import NextAuth from "next-auth"
import Google from "next-auth/providers/google"

// Retrieve allowed emails from environment variable, fallback to an empty array
const allowedEmails = process.env.ALLOWED_EMAILS 
  ? process.env.ALLOWED_EMAILS.split(',').map(e => e.trim().toLowerCase()) 
  : [];

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  pages: {
    signIn: '/login', // Custom login page
    error: '/login',  // Redirect errors back to our custom login page
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        const userEmail = user.email?.toLowerCase();
        
        // If ALLOWED_EMAILS is not set, we can either allow all or deny all.
        // Given the requirement "predefined static accounts only", we deny if not in list.
        if (userEmail && allowedEmails.includes(userEmail)) {
          return true;
        } else {
          // Return false to deny sign in
          return false;
        }
      }
      return false;
    },
    async session({ session, token }) {
      return session;
    },
    async jwt({ token, user }) {
      return token;
    }
  }
})
