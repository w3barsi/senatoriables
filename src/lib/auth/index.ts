import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin } from "better-auth/plugins";
import { reactStartCookies } from "better-auth/react-start";
import { db } from "../server/db";

export const auth = betterAuth({
  advanced: {
    cookiePrefix: "senatoriables",
  },
  baseURL: process.env.VITE_BASE_URL,
  database: drizzleAdapter(db, {
    provider: "sqlite",
  }),

  // https://www.better-auth.com/docs/concepts/session-management#session-caching
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
  },
  // https://www.better-auth.com/docs/concepts/users-accounts#account-linking
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google", "facebook", "twitter"],
    },
  },

  user: {
    additionalFields: {
      shortId: {
        type: "string",
      },
    },
  },

  // https://www.better-auth.com/docs/concepts/oauth
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
    facebook: {
      clientId: process.env.FACEBOOK_CLIENT_ID as string,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
    },
    twitter: {
      clientId: process.env.TWITTER_CLIENT_ID as string,
      clientSecret: process.env.TWITTER_CLIENT_SECRET as string,
    },
  },

  // https://www.better-auth.com/docs/authentication/email-password
  // emailAndPassword: {
  //   enabled: true,
  // },

  plugins: [admin(), reactStartCookies()],
});
