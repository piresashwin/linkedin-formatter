import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { saltAndHashPassword } from "./lib/password";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        }),
        Credentials({
            credentials: {
                email: {},
                password: { type: "text", label: "Password" },
            },
            authorize: async (credentials) => {
                let user = null;

                const hashedPassword = await saltAndHashPassword(credentials.password as string);

                // Get the user from the database
                if (!user) {
                    // No user found, so this is their first attempt to login
                    // Optionally, this is also the place you could do a user registration
                    throw new Error("Invalid credentials.")
                }

                // Check if the password matches using the verifyPassword

                return user;
            }
        })
    ],
})