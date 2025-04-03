import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import { saltAndHashPassword } from "./lib/password";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";
import { ObjectId } from "bson";


export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [
        Google({
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
        }),
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            if (account && account.provider === "google") {
                // Check if the user already exists in the database
                const existingUser = await prisma.profile.findUnique({
                    where: { email: user.email as string },
                });

                if (!existingUser) {
                    // Get the free plan from the plans
                    const freePlan = await prisma.plans.findFirst({
                        where: { isFree: true },
                    });

                    if (!freePlan) {
                        throw new Error("Free plan not found.");
                    }

                    // If the user doesn't exist, create a new profile in the database
                    const newUser = await prisma.profile.create({
                        data: {
                            id: new ObjectId().toString(),
                            userId: user.id as string,
                            email: user.email as string,
                            name: user.name as string,
                            profilePicture: user.image as string,
                            planId: freePlan.id,
                            purchaseDate: new Date(),
                            expiryDate: null, // Free plans don't expire
                            isExpired: false,
                        },
                    });

                    await prisma.userPlanHistory.create({
                        data: {
                            id: new ObjectId().toString(),
                            userId: user.id as string,
                            planId: freePlan.id,
                            purchaseDate: new Date(),
                            expiryDate: null, // Free plans don't expire
                            priceUsd: freePlan.priceUsd,
                            isFree: true,
                            isCancelled: false,
                        },
                    });
                }
            }
            return true; // Allow the sign-in
        },
    },
})