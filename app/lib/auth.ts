import { NextAuthOptions } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from './prisma';

const adminEmails = process.env.ADMIN_EMAILS?.split(',') || [];

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    // GitHub - for Admin only
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    // Google - for regular users (commenters)
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      console.log('SignIn Attempt:', { 
        userEmail: user.email, 
        provider: account?.provider,
        adminEmails 
      });
      
      // GitHub login - admin only (check allowlist)
      if (account?.provider === 'github') {
        if (adminEmails.length > 0 && user.email) {
          const isAllowed = adminEmails.includes(user.email);
          console.log('GitHub Admin Check:', isAllowed);
          return isAllowed;
        }
        console.log('GitHub Access Denied: Email not in admin list');
        return false;
      }
      
      // Google login - allow all users for commenting
      if (account?.provider === 'google') {
        console.log('Google login allowed for commenting');
        return true;
      }
      
      return false;
    },
    async session({ session, user }) {
      if (session.user) {
        // @ts-expect-error - id is not in default Session type
        session.user.id = user.id;
        // Add isAdmin flag to session
        // @ts-expect-error - isAdmin is not in default Session type
        session.user.isAdmin = adminEmails.includes(user.email || '');
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
