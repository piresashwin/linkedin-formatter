import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import { saltAndHashPassword, verifyPassword } from "./lib/password";
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
                fullName: { type: "text", label: "Full Name" },
                email: { type: "email", label: "Email" },
                password: { type: "password", label: "Password" },
            },
            authorize: async (credentials) => {
                let user = null;

                const hashedPassword = await saltAndHashPassword(credentials.password as string);

                // Check if the user already exists in the database
                user = await prisma.user.findUnique({
                    where: { email: credentials?.email as string },
                });

                if (credentials && !user) {
                    // If the user doesn't exist, create a new user in the database
                    const freePlan = await prisma.plans.findFirst({
                        where: { isFree: true },
                    });

                    if (!freePlan) {
                        throw new Error("Free plan not found.");
                    }

                    user = await prisma.user.create({
                        data: {
                            id: new ObjectId().toString(),
                            email: credentials.email as string,
                            password: hashedPassword,
                            name: credentials.fullName as string,
                        },
                    });

                    const profile = await prisma.profile.create({
                        data: {
                            id: new ObjectId().toString(),
                            userId: user.id,
                            email: credentials.email as string,
                            name: credentials.fullName as string,
                            profilePicture: null,
                            planId: freePlan.id,
                            purchaseDate: new Date(),
                            expiryDate: null, // Free plans don't expire
                            isExpired: false,
                        },
                    });

                    await prisma.userPlanHistory.create({
                        data: {
                            id: new ObjectId().toString(),
                            userId: user.id,
                            planId: freePlan.id,
                            purchaseDate: new Date(),
                            expiryDate: null, // Free plans don't expire
                            priceUsd: freePlan.priceUsd,
                            isFree: true,
                            isCancelled: false,
                        },
                    });

                    return user;
                }

                var isVerified = await verifyPassword(
                    credentials.password as string,
                    user?.password as string
                )

                // Check if the password matches using the verifyPassword

                return isVerified ? user : null;
            }
        }),
    ],
    session: {
        strategy: "jwt", // or "database" if you want Prisma to persist sessions
    },
    callbacks: {
        async session({ session, token }) {
            if (session?.user && token?.sub) {
                session.user.id = token.sub;
            }
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
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