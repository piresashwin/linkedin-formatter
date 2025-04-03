"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { z } from "zod";
import { useRouter } from "next/navigation";

// Define the Zod schema for signup form validation
const signupSchema = z.object({
    fullName: z.string().min(1, "Full name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
});

const SignupPage = () => {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate the form data using the Zod schema
        const validation = signupSchema.safeParse({ fullName, email, password });
        if (!validation.success) {
            setError(validation.error.errors[0].message);
            return;
        }

        // Attempt to sign up with credentials
        const result = await signIn("credentials", {
            fullName,
            email,
            password,
            redirect: false,
        });

        if (result?.ok) {
            router.push("/dashboard"); // Redirect to dashboard on successful signup
        } else {
            setError("Signup failed. Please try again.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="p-6 bg-white rounded-lg shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold text-center mb-4">Create an Account</h1>
                <form onSubmit={handleSignup} className="space-y-4">
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <div>
                        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                            Full Name
                        </label>
                        <input
                            id="fullName"
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300"
                    >
                        Sign Up
                    </button>
                </form>
                <div className="mt-6">
                    <p className="text-center text-sm text-gray-600">Or sign up with</p>
                    <div className="flex justify-center space-x-4 mt-4">
                        <button
                            className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700 focus:outline-none focus:ring focus:ring-red-300"
                            onClick={() => signIn("google")}
                        >
                            Google
                        </button>
                        <button
                            className="px-4 py-2 text-white bg-blue-800 rounded hover:bg-blue-900 focus:outline-none focus:ring focus:ring-blue-400"
                            onClick={() => signIn("linkedin")}
                        >
                            LinkedIn
                        </button>
                    </div>
                </div>
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        Already have an account?{" "}
                        <a
                            href="/login"
                            className="text-blue-600 hover:underline"
                        >
                            Log in
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;