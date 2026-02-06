"use client";

import { useState, ReactNode } from "react";
import Sidebar from "@/components/layout/Sidebar";
import MobileSidebar from "@/components/layout/MobileSidebar";
import Header from "@/components/layout/Header";
import { type UserWithRole } from "@/app/actions/auth";
import { Toaster } from "sonner";

interface AppLayoutProps {
    children: ReactNode;
    orgName: string;
    currentUser?: UserWithRole | null;
}

export default function AppLayout({ children, orgName, currentUser }: AppLayoutProps) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-white transition-colors duration-300">
            <Sidebar orgName={orgName} currentUser={currentUser} />
            <MobileSidebar
                isOpen={mobileMenuOpen}
                onClose={() => setMobileMenuOpen(false)}
                orgName={orgName}
                currentUser={currentUser}
            />
            <main className="relative flex min-w-0 flex-1 flex-col overflow-x-hidden bg-white pl-0 lg:pl-64">
                <Header onMenuClick={() => setMobileMenuOpen(true)} currentUser={currentUser} />
                {children}
            </main>
            <Toaster position="top-right" richColors />
        </div>
    );
}
