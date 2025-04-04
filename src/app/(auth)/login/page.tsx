"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Logo from "@/ui/shared/Logo";

// Define the Zod schema for login form validation
const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
});

const LoginPage = () => {

    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(loginSchema),
    });


    const onSubmit = async (data: { email: string; password: string }) => {
        setError(null); // Clear any previous errors

        try {
            // Attempt to sign in with credentials
            const result = await signIn("credentials", {
                email: data.email,
                password: data.password,
                redirect: false,
            });

            if (result?.ok) {
                router.push("/dashboard"); // Redirect to dashboard on successful login
            } else {
                setError("Invalid email or password");
            }
        } catch (err) {
            setError("An unexpected error occurred. Please try again.");
        }
    };

    return (
        <div className="container mx-auto h-screen p-10">

            <div className="flex flex-row gap-5 h-full justify-center items-center">

                <div className="flex flex-col basis-1/2 justify-center gap-8">

                    <Logo></Logo>

                    <div className="flex flex-col gap-1">
                        <h2 className="text-xl font-semibold">Welcom Back,</h2>
                        <p className="text-sm text-gray-500">Enter your credentials to access your account</p>
                    </div>

                    <div className="flex flex-row gap-5">
                        <button onClick={() => signIn("google", { callbackUrl: "/dashboard" })} className="cursor-pointer flex flex-row gap-3 px-6 py-1.5 bg-white rounded-md text-black text-sm font-medium items-center justify-center border border-gray-400">
                            Login with Google
                        </button>
                        <button onClick={() => signIn("linkedin", { callbackUrl: "/dashboard" })} className="cursor-pointer flex flex-row gap-3 px-6 py-1.5 bg-white rounded-md text-black text-sm font-medium items-center justify-center border border-gray-400">
                            Login with LinkedIn
                        </button>
                    </div>

                    <div className="flex flex-row items-center gap-2 max-w-sm">
                        <hr className="flex-grow border-gray-300" />
                        <span className="text-sm text-gray-500">or</span>
                        <hr className="flex-grow border-gray-300" />
                    </div>

                    <div className="flex flex-col gap-3 max-w-sm">
                        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

                            <label className="flex flex-col gap-1">
                                <span className="text-sm font-medium">Email Address</span>
                                <input
                                    type="email"
                                    {...register("email")}
                                    className={`px-4 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 ${errors.email ? "border-red-500 focus:ring-red-500" : "focus:ring-blue-500"
                                        }`}
                                    placeholder="Enter your email address"
                                />
                                {errors.email && <span className="text-sm text-red-500">{errors.email.message}</span>}
                            </label>

                            <label className="flex flex-col gap-1">
                                <span className="text-sm font-medium">Password</span>
                                <input
                                    type="password"
                                    {...register("password")}
                                    className={`px-4 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 ${errors.password ? "border-red-500 focus:ring-red-500" : "focus:ring-blue-500"
                                        }`}
                                    placeholder="Enter your password"
                                />
                                {errors.password && <span className="text-sm text-red-500">{errors.password.message}</span>}
                            </label>

                            {error && <span className="text-sm text-red-500">{error}</span>}

                            <button
                                type="submit"
                                className="cursor-pointer px-6 py-2 bg-gradient-to-r from-black to-gray-800 text-white rounded-lg hover:from-gray-800 hover:to-black mt-5"
                            >
                                Log In
                            </button>
                        </form>

                        <div className="text-center">
                            <p className="text-sm text-gray-500">
                                Don't have an account?{" "}
                                <a
                                    href="/signup"
                                    className="text-black font-semibold hover:underline"
                                >
                                    Sign up
                                </a>
                            </p>
                        </div>
                    </div>

                </div>
                <div className="flex flex-col basis-1/2 h-full">
                    <div className="w-full h-full bg-gradient-to-b from-blue-500 to-white rounded-4xl overflow-hidden flex items-center justify-center">
                        <img
                            src="/images/signup-bg.jpg"
                            alt="Signup Background"
                            className="object-cover w-full h-full"
                        />
                    </div>

                </div>


            </div>


        </div>
    );
};

export default LoginPage;