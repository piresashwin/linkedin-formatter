'use client'

import React from "react";
import SidebarNav from "@/ui/shared/SidebarNav";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        }
    }, [status, router]);

    if (status === "loading") {
        return <div>Loading...</div>;
    }

    return (

        <div className="flex h-screen bg-white">
            {/* Sidebar */}
            <div className="w-72 items-stretch flex flex-col">
                <SidebarNav />
            </div>

            {/* Main Content */}
            <div className="flex-1 flex justify-center bg-gray-50 overflow-auto">
                <div className="container max-w-[990px] rounded-lg p-5 mt-14">
                    {children}
                </div>
            </div>
        </div>

    );
};

export default Layout;