import type { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';
import { sanityClient } from './lib/sanity/client';
import { queries } from './lib/sanity/queries';
import { SanityUser } from './lib/sanity/types';

export const authConfig: NextAuthConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Find user by email
          const user = await sanityClient.fetch<SanityUser>(
            queries.getUserByEmail,
            { email: credentials.email }
          );

          if (!user) {
            return null;
          }

          // Verify password
          const isValid = await bcrypt.compare(
            credentials.password as string,
            user.passwordHash
          );

          if (!isValid) {
            return null;
          }

          // Return user object (without password hash)
          return {
            id: user._id,
            email: user.email,
            name: user.username,
            image: user.avatar,
          };
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      // For Google OAuth, check if user exists in Sanity
      if (account?.provider === 'google') {
        try {
          const existingUser = await sanityClient.fetch<SanityUser>(
            queries.getUserByEmail,
            { email: user.email }
          );

          if (existingUser) {
            // User exists, allow sign in
            user.id = existingUser._id;
            user.name = existingUser.username;
            return true;
          } else {
            // New Google user - redirect to username setup
            // We'll handle this in the jwt callback
            return true;
          }
        } catch (error) {
          console.error('Sign in error:', error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, account, trigger, session }) {
      // Handle session update (when user sets username)
      if (trigger === 'update' && session?.user) {
        token.id = session.user.id;
        token.username = session.user.username;
        token.needsUsername = false;
        return token;
      }

      if (user) {
        token.id = user.id;
        token.username = user.name;
        token.email = user.email;
        token.provider = account?.provider;

        // Check if Google user needs username setup
        if (account?.provider === 'google') {
          try {
            const existingUser = await sanityClient.fetch<SanityUser>(
              queries.getUserByEmail,
              { email: user.email }
            );

            if (!existingUser) {
              // Mark that username setup is needed
              token.needsUsername = true;
            } else {
              token.needsUsername = false;
              token.id = existingUser._id;
              token.username = existingUser.username;
            }
          } catch (error) {
            console.error('JWT error:', error);
          }
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
        session.user.needsUsername = token.needsUsername as boolean;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
  },
};
