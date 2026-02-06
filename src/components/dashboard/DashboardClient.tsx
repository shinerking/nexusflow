"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import MobileSidebar from "@/components/layout/MobileSidebar";
import Header from "@/components/layout/Header";
import OverviewChart from "@/components/dashboard/OverviewChart";
import {
    DollarSign,
    ShoppingCart,
    Package,
} from "lucide-react";

interface DashboardData {
    totalRevenue: number;
    pendingRequests: number;
    lowStockCount: number;
    totalInventoryValue: number;
    totalProducts: number;
    recentActivity: Array<{
        id: string;
        title: string;
        totalAmount: number; // Decimal type from Prisma
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
    },
    {
        key: "totalProducts" as const,
        label: "Total Products",
        sub: "Items in inventory",
        icon: Package,
        iconBg: "bg-blue-100",
        iconColor: "text-blue-600",
        format: (v: number) => String(v),
    },
    {
        key: "lowStockCount" as const,
        label: "Low Stock",
        sub: "Items need restock",
        icon: Package,
        iconBg: "bg-amber-100",
        iconColor: "text-amber-600",
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
    },
];

export default function DashboardClient({ data }: { data: DashboardData }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const statValues = {
        totalRevenue: data.totalRevenue,
        totalProducts: data.totalProducts,
        lowStockCount: data.lowStockCount,
        totalInventoryValue: data.totalInventoryValue,
    };

    return (
        <div className="flex min-h-screen bg-slate-50">
            <Sidebar orgName={data.orgName} />
            <MobileSidebar
                isOpen={mobileMenuOpen}
                onClose={() => setMobileMenuOpen(false)}
                orgName={data.orgName}
            />
            <main className="flex min-w-0 flex-1 flex-col pl-0 lg:pl-64">
                <Header onMenuClick={() => setMobileMenuOpen(true)} />
                <div className="flex-1 p-4 sm:p-6">
                    <div className="mb-4 sm:mb-6">
                        <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">Dashboard</h1>
                        <p className="mt-1 text-sm text-slate-500">
                            Overview of your business performance
                        </p>
                    </div>

                    <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:mb-8 lg:grid-cols-4">
                        {statCardConfig.map((card) => {
                            const Icon = card.icon;
                            const value = statValues[card.key];
                            return (
                                <div
                                    key={card.label}
                                    className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow sm:p-5"
                                >
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-slate-500">
                                                {card.label}
                                            </p>
                                            <p className="mt-1 text-xl font-semibold text-slate-900 sm:text-2xl">
                                                {card.format(value)}
                                            </p>
                                            <p className="mt-0.5 text-xs text-slate-500">
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

                    <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 lg:mb-8">
                        <h2 className="text-base font-semibold text-slate-900 sm:text-lg">
                            Inventory by Category
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                            Stock distribution across product categories
                        </p>
                        <div className="mt-4">
                            <OverviewChart chartData={data.chartData} />
                        </div>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
                        <div className="border-b border-slate-200 px-4 py-3 sm:px-6 sm:py-4">
                            <h2 className="text-base font-semibold text-slate-900 sm:text-lg">
                                Recent Activity
                            </h2>
                            <p className="mt-1 text-sm text-slate-500">
                                Latest procurement requests
                            </p>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[600px] text-left text-sm">
                                <thead>
                                    <tr className="border-b border-slate-200 bg-slate-50/80">
                                        <th className="px-4 py-3 font-medium text-slate-600 sm:px-6">
                                            Title
                                        </th>
                                        <th className="px-4 py-3 font-medium text-slate-600 sm:px-6">
                                            Type
                                        </th>
                                        <th className="px-4 py-3 font-medium text-slate-600 sm:px-6">
                                            Amount
                                        </th>
                                        <th className="px-4 py-3 font-medium text-slate-600 sm:px-6">
                                            Status
                                        </th>
                                        <th className="px-4 py-3 font-medium text-slate-600 sm:px-6">
                                            Date
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.recentActivity.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={5}
                                                className="px-4 py-8 text-center text-slate-500 sm:px-6"
                                            >
                                                No recent activity yet.
                                            </td>
                                        </tr>
                                    ) : (
                                        data.recentActivity.map((row) => (
                                            <tr
                                                key={row.id}
                                                className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50"
                                            >
                                                <td className="px-4 py-3 font-medium text-slate-900 sm:px-6">
                                                    {row.title}
                                                </td>
                                                <td className="px-4 py-3 text-slate-600 sm:px-6">
                                                    Procurement
                                                </td>
                                                <td className="px-4 py-3 font-medium text-slate-900 sm:px-6">
                                                    {formatCurrency(Number(row.totalAmount))}
                                                </td>
                                                <td className="px-4 py-3 sm:px-6">
                                                    <span
                                                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${row.status === "APPROVED"
                                                            ? "bg-emerald-100 text-emerald-700"
                                                            : row.status === "PENDING"
                                                                ? "bg-amber-100 text-amber-700"
                                                                : "bg-slate-100 text-slate-700"
                                                            }`}
                                                    >
                                                        {row.status}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-slate-500 sm:px-6">
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
