"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/layout/Sidebar";
import MobileSidebar from "@/components/layout/MobileSidebar";
import Header from "@/components/layout/Header";
import OverviewChart from "@/components/dashboard/OverviewChart";
import NotificationListener from "@/components/dashboard/NotificationListener";
import {
    DollarSign,
    ShoppingCart,
    Package,
    Eye,
} from "lucide-react";
import { type UserWithRole } from "@/app/actions/auth";
import { isReadOnly } from "@/lib/permissions";

// Dashboard component handling logic and adaptive theming

interface DashboardData {
    totalRevenue: number;
    pendingRequests: number;
    lowStockCount: number;
    totalInventoryValue: number;
    totalProducts: number;
    pendingProductsCount: number;
    recentActivity: Array<{
        id: string;
        user?: { name: string } | null;
        product: { name: string };
        type: "IN" | "OUT";
        quantity: number;
        status: string;
        createdAt: Date;
    }>;
    chartData: Array<{
        category: string;
        stock: number;
    }>;
    orgName: string;
}

function formatCurrency(value: number): string {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
}

function formatDate(date: Date): string {
    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(date);
}

const statCardConfig = [
    {
        key: "totalRevenue" as const,
        label: "Total Revenue",
        sub: "From approved procurements",
        icon: DollarSign,
        iconBg: "bg-emerald-100",
        iconColor: "text-emerald-600",
        format: (v: number) => formatCurrency(v),
        hideForStaff: true,
    },
    {
        key: "totalProducts" as const,
        label: "Total Products",
        sub: "Approved items in inventory",
        icon: Package,
        iconBg: "bg-blue-100",
        iconColor: "text-blue-600",
        format: (v: number) => String(v),
    },
    {
        key: "pendingProductsCount" as const,
        label: "Pending Review",
        sub: "Products awaiting approval",
        icon: Eye,
        iconBg: "bg-amber-100",
        iconColor: "text-amber-600",
        format: (v: number) => String(v),
        highlightIfPositive: true,
    },
    {
        key: "lowStockCount" as const,
        label: "Low Stock",
        sub: "Items need restock",
        icon: Package,
        iconBg: "bg-red-100",
        iconColor: "text-red-600",
        format: (v: number) => String(v),
    },
    {
        key: "totalInventoryValue" as const,
        label: "Inventory Value",
        sub: "Total current value",
        icon: ShoppingCart,
        iconBg: "bg-violet-100",
        iconColor: "text-violet-600",
        format: (v: number) => formatCurrency(v),
        hideForStaff: true,
    },
];

export default function DashboardClient({
    data,
    currentUser
}: {
    data: DashboardData;
    currentUser: UserWithRole | null;
}) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const readOnly = isReadOnly(currentUser?.role);
    const isStaff = currentUser?.role === "STAFF";
    const isManager = currentUser?.role === "MANAGER" || currentUser?.role === "ADMIN";

    const statValues = {
        totalRevenue: data.totalRevenue,
        totalProducts: data.totalProducts,
        pendingProductsCount: data.pendingProductsCount,
        lowStockCount: data.lowStockCount,
        totalInventoryValue: data.totalInventoryValue,
    };

    return (
        <div className="flex min-h-screen bg-background">
            {isManager && <NotificationListener />}
            <Sidebar orgName={data.orgName} currentUser={currentUser} />
            <MobileSidebar
                isOpen={mobileMenuOpen}
                onClose={() => setMobileMenuOpen(false)}
                orgName={data.orgName}
                currentUser={currentUser}
            />
            <main className="flex min-w-0 flex-1 flex-col pl-0 lg:pl-64">
                <Header onMenuClick={() => setMobileMenuOpen(true)} currentUser={currentUser} />
                <div className="flex-1 p-4 sm:p-6">
                    <div className="mb-4 sm:mb-6">
                        <h1 className="text-xl font-semibold text-foreground sm:text-2xl">Dashboard</h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Overview of your business performance
                        </p>
                    </div>

                    {/* Read-Only Mode Banner */}
                    {readOnly && (
                        <div className="mb-6 rounded-xl border border-blue-200 bg-blue-50 p-4 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                                    <Eye className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-blue-900">Read-Only Mode</h3>
                                    <p className="text-sm text-blue-700">
                                        You are viewing as an Auditor. You can view all data but cannot make changes.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:mb-8 lg:grid-cols-4">
                        {statCardConfig.filter(card => !isStaff || !card.hideForStaff).map((card) => {
                            const Icon = card.icon;
                            const value = statValues[card.key];
                            const isHighlight = card.highlightIfPositive && value > 0;

                            return (
                                <div
                                    key={card.label}
                                    className={`rounded-xl border bg-card p-4 shadow-sm transition-all hover:shadow sm:p-5 ${isHighlight ? "border-amber-400 ring-4 ring-amber-100 animate-pulse-slow" : "border-border"
                                        }`}
                                >
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">
                                                {card.label}
                                            </p>
                                            <p className="mt-1 text-xl font-semibold text-foreground sm:text-2xl">
                                                {card.format(value)}
                                            </p>
                                            <p className="mt-0.5 text-xs text-muted-foreground">
                                                {card.sub}
                                            </p>
                                        </div>
                                        <div
                                            className={`flex h-10 w-10 items-center justify-center rounded-lg ${card.iconBg} ${card.iconColor}`}
                                        >
                                            <Icon className="h-5 w-5" aria-hidden />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="mb-6 rounded-xl border border-border bg-card p-4 shadow-sm sm:p-6 lg:mb-8">
                        <h2 className="text-base font-semibold text-foreground sm:text-lg">
                            Inventory by Category
                        </h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Stock distribution across product categories
                        </p>
                        <div className="mt-4">
                            <OverviewChart chartData={data.chartData} />
                        </div>
                    </div>

                    <div className="rounded-xl border border-border bg-card shadow-sm">
                        <div className="border-b border-border px-4 py-3 sm:px-6 sm:py-4">
                            <h2 className="text-base font-semibold text-foreground sm:text-lg">
                                Recent Activity
                            </h2>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Latest stock adjustment logs
                            </p>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[600px] text-left text-sm">
                                <thead>
                                    <tr className="border-b border-border bg-muted/50">
                                        <th className="px-4 py-3 font-medium text-muted-foreground sm:px-6">
                                            User
                                        </th>
                                        <th className="px-4 py-3 font-medium text-muted-foreground sm:px-6">
                                            Product
                                        </th>
                                        <th className="px-4 py-3 font-medium text-muted-foreground sm:px-6">
                                            Type
                                        </th>
                                        <th className="px-4 py-3 font-medium text-muted-foreground sm:px-6">
                                            Qty
                                        </th>
                                        <th className="px-4 py-3 font-medium text-muted-foreground sm:px-6">
                                            Status
                                        </th>
                                        <th className="px-4 py-3 font-medium text-muted-foreground sm:px-6">
                                            Date
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.recentActivity.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={6}
                                                className="px-4 py-8 text-center text-muted-foreground sm:px-6"
                                            >
                                                No recent activity yet.
                                            </td>
                                        </tr>
                                    ) : (
                                        data.recentActivity.map((row) => (
                                            <tr
                                                key={row.id}
                                                className="border-b border-border last:border-0 hover:bg-muted/50"
                                            >
                                                <td className="px-4 py-3 font-medium text-foreground sm:px-6">
                                                    {row.user?.name || "Unknown"}
                                                </td>
                                                <td className="px-4 py-3 text-muted-foreground sm:px-6">
                                                    {row.product.name}
                                                </td>
                                                <td className="px-4 py-3 font-medium text-foreground sm:px-6">
                                                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${row.type === "IN" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                                        }`}>
                                                        {row.type}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 font-medium text-foreground sm:px-6">
                                                    {Math.abs(row.quantity)}
                                                </td>
                                                <td className="px-4 py-3 sm:px-6">
                                                    <span
                                                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${row.status === "APPROVED"
                                                            ? "bg-emerald-100 text-emerald-700"
                                                            : row.status === "PENDING"
                                                                ? "bg-amber-100 text-amber-700"
                                                                : "bg-muted text-muted-foreground"
                                                            }`}
                                                    >
                                                        {row.status}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-muted-foreground sm:px-6">
                                                    {formatDate(row.createdAt)}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
