import NextAuth from "next-auth";
import Instagram from "next-auth/providers/instagram";
import Credentials from "next-auth/providers/credentials";

// Admin email whitelist - only these emails can access admin
const ADMIN_EMAILS = [
  process.env.ADMIN_EMAIL || "omkarcreations.work@gmail.com",
];

export const authOptions = {
  providers: [
    // Instagram OAuth (via Facebook/Meta)
    Instagram({
      clientId: process.env.INSTAGRAM_CLIENT_ID,
      clientSecret: process.env.INSTAGRAM_CLIENT_SECRET,
      authorization: {
        params: {
          scope: "instagram_business_basic,instagram_business_manage_messages,instagram_business_manage_comments,instagram_business_content_publish",
        },
      },
    }),
    // Fallback email/password for development
    Credentials({
      name: "Admin Login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const adminEmail = process.env.ADMIN_EMAIL || "omkarcreations.work@gmail.com";
        const adminPass = process.env.ADMIN_PASSWORD || "admin123";

        if (credentials?.email === adminEmail && credentials?.password === adminPass) {
          return {
            id: "admin-1",
            name: "Omkar",
            email: adminEmail,
            role: "admin",
          };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, user }) {
      // Store Instagram access token for API calls
      if (account?.provider === "instagram") {
        token.instagramAccessToken = account.access_token;
        token.instagramUserId = account.providerAccountId;
        token.provider = "instagram";
      }
      if (user?.role) token.role = user.role;
      return token;
    },
    async session({ session, token }) {
      session.instagramAccessToken = token.instagramAccessToken;
      session.instagramUserId = token.instagramUserId;
      session.provider = token.provider;
      session.user.role = token.role || "admin";
      return session;
    },
    async signIn({ user, account }) {
      // For Instagram login, check if the email is whitelisted
      if (account?.provider === "instagram") {
        return ADMIN_EMAILS.includes(user.email);
      }
      return true;
    },
  },
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET || "omkar-creations-secret-key-change-in-production",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
