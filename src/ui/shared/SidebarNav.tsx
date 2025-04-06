"use client";

import { signOut, useSession } from "next-auth/react";
import React, { useState } from "react";
import { HomeIcon, UserIcon, CogIcon, ArrowLeftOnRectangleIcon } from "@heroicons/react/24/outline";
import Logo from "./Logo";
import Link from "next/link";

const SidebarNav = () => {
    const { data: session } = useSession();
    const [selectedMenu, setSelectedMenu] = useState("dashboard"); // Default selected menu item

    const menuItems = [
        { id: "dashboard", label: "Dashboard", icon: HomeIcon, href: "/dashboard" },
        { id: "series", label: "Series", icon: HomeIcon, href: "/series" },
        { id: "profile", label: "Profile", icon: UserIcon, href: "/profile" },
    ];

    return (

        <aside className="w-full bg-white text-black flex flex-col border border-gray-300 h-full">
            {/* Logo Section */}
            <div className="p-4 flex items-center">
                <Logo />
            </div>


            {/* Navigation Links */}
            <nav className="flex-1 p-4 space-y-2">
                <p className="text-xs text-gray-500">Menu</p>
                {menuItems.map((item) => (
                    <Link
                        key={item.id}
                        href={item.href}
                        onClick={() => setSelectedMenu(item.id)}
                        className={`flex items-center px-4 py-2 rounded-lg ${selectedMenu === item.id ? "bg-black text-white" : "hover:bg-gray-100"
                            }`}
                    >
                        <item.icon className="w-5 h-5 mr-2" />
                        {item.label}
                    </Link>
                ))}
            </nav>

            {/* Profile and Settings */}
            <div className="p-4 space-y-2">
                {session?.user && (

                    <Link href="/profile" className=" flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                            <img
                                src={session.user.image || "/images/avatar.jpg"}
                                alt="Profile"
                                className="w-10 h-10 rounded-full border border-gray-300"
                            />
                            <div>
                                <p className="text-sm font-medium">{session.user.name}</p>
                                <p className="text-xs text-gray-500">{session.user.email}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => signOut({ callbackUrl: "/login" })}
                            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100"
                            title="Logout"
                        >
                            <ArrowLeftOnRectangleIcon className="w-6 h-6" />
                        </button>
                    </Link>
                )}
            </div>
        </aside>
    );
};

export default SidebarNav;