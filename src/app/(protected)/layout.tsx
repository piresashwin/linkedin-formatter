import { SessionProvider } from "next-auth/react";
import React from "react";
import SidebarNav from "@/ui/shared/SidebarNav";

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <SessionProvider>
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
        </SessionProvider>
    );
};

export default Layout;