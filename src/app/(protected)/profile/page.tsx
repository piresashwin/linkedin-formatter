"use client";

import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import * as Tabs from "@radix-ui/react-tabs";
import { z } from "zod";
import { motion } from "motion/react";
import { useSession } from "next-auth/react";

const ProfilePage = () => {

    const { data: session } = useSession();

    const profileSchema = z.object({
        name: z.string().min(1, "Name is required"),
        email: z.string().email("Invalid email address"),
        plan: z.enum(["Free", "Pro", "Enterprise"]),
        billingAddress: z.string().min(1, "Billing address is required"),
        profilePicture: z.string().url("Invalid URL"),
    });


    const plans = ["Free", "Pro", "Enterprise"];

    const [profile, setProfile] = useState({
        name: "",
        email: "",
        plan: "Free",
        billingAddress: "",
        profilePicture: "",
    });

    const handleProfileUpdate = (field: keyof typeof profile, value: string) => {
        const updatedProfile = { ...profile, [field]: value };
        const validation = profileSchema.safeParse(updatedProfile);

        if (validation.success) {
            setProfile(updatedProfile);
        } else {
            console.error(validation.error.format());
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                const updatedProfile = { ...profile, profilePicture: reader.result as string };
                const validation = profileSchema.safeParse(updatedProfile);

                if (validation.success) {
                    setProfile(updatedProfile);
                } else {
                    console.error(validation.error.format());
                }
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="p-5 space-y-8">
            {/* Header */}
            <header className="flex flex-row justify-between items-center">
                <div className="flex flex-col gap-1">
                    <motion.h1
                        className="text-4xl font-bold text-gray-800"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        Profile
                    </motion.h1>
                    <p className="text-gray-500">{session?.user?.name || "User"}, You can update your account details</p>
                </div>
            </header>
            {/* Tabs Navigation */}
            <Tabs.Root defaultValue="profile">
                <Tabs.List className="flex items-center space-x-4 pb-2">
                    <Tabs.Trigger
                        value="profile"
                        className="flex items-center px-5 py-1 text-black rounded-full hover:bg-gray-200 focus:outline-none data-[state=active]:bg-black data-[state=active]:text-white"
                    >
                        Profile
                    </Tabs.Trigger>
                    <Tabs.Trigger
                        value="billing"
                        className="flex items-center px-5 py-1 text-black rounded-full hover:bg-gray-200 focus:outline-none data-[state=active]:bg-black data-[state=active]:text-white"
                    >
                        Billing
                    </Tabs.Trigger>
                    <Tabs.Trigger
                        value="settings"
                        className="flex items-center px-5 py-1 text-black rounded-full hover:bg-gray-200 focus:outline-none data-[state=active]:bg-black data-[state=active]:text-white"
                    >
                        Settings
                    </Tabs.Trigger>
                </Tabs.List>

                {/* Profile Tab */}
                <Tabs.Content value="profile" className="space-y-6 mt-10">
                    {/* <h1 className="text-xl font-semibold text-gray-800">Edit Profile</h1> */}
                    <div className="space-y-4">
                        {/* Profile Picture */}
                        <div className="flex items-center space-x-4">
                            <img
                                src={profile.profilePicture}
                                alt="Profile"
                                className="w-20 h-20 rounded-full border border-gray-300"
                            />
                            <label className="px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700">
                                Change Picture
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleFileChange}
                                />
                            </label>
                        </div>

                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Name
                            </label>
                            <input
                                type="text"
                                value={profile.name}
                                onChange={(e) => handleProfileUpdate("name", e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <input
                                type="email"
                                value={profile.email}
                                onChange={(e) => handleProfileUpdate("email", e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        {/* Plan */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Plan
                            </label>
                            <select
                                value={profile.plan}
                                onChange={(e) => handleProfileUpdate("plan", e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            >
                                {plans.map((plan) => (
                                    <option key={plan} value={plan}>
                                        {plan}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </Tabs.Content>

                {/* Billing Tab */}
                <Tabs.Content value="billing" className="space-y-6">
                    <h1 className="text-2xl font-bold text-gray-800">Billing Information</h1>
                    <div className="space-y-4">
                        {/* Billing Address */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Billing Address
                            </label>
                            <input
                                type="text"
                                value={profile.billingAddress}
                                onChange={(e) =>
                                    handleProfileUpdate("billingAddress", e.target.value)
                                }
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>
                </Tabs.Content>

                {/* Settings Tab */}
                <Tabs.Content value="settings" className="space-y-6">
                    <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
                    <p className="text-gray-500">Additional settings can go here.</p>
                </Tabs.Content>
            </Tabs.Root>
        </div>
    );
};

export default ProfilePage;