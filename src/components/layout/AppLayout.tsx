"use client";

import { useState, ReactNode } from "react";
import Sidebar from "@/components/layout/Sidebar";
import MobileSidebar from "@/components/layout/MobileSidebar";
import Header from "@/components/layout/Header";

interface AppLayoutProps {
    children: ReactNode;
    orgName: string;
}

export default function AppLayout({ children, orgName }: AppLayoutProps) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-slate-50">
            <Sidebar orgName={orgName} />
            <MobileSidebar
                isOpen={mobileMenuOpen}
                onClose={() => setMobileMenuOpen(false)}
                orgName={orgName}
            />
            <main className="flex min-w-0 flex-1 flex-col pl-0 lg:pl-64">
                <Header onMenuClick={() => setMobileMenuOpen(true)} />
                {children}
            </main>
        </div>
    );
}
