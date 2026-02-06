"use client";

import { TrendingUp, CheckCircle, Clock } from "lucide-react";

type WeeklyStatsCardsProps = {
    totalRestocked: number;
    approvalRate: number;
    pendingTasks: number;
};

export default function WeeklyStatsCards({
    totalRestocked,
    approvalRate,
    pendingTasks,
}: WeeklyStatsCardsProps) {
    const stats = [
        {
            label: "Total Restocked (7 Days)",
            value: totalRestocked,
            icon: TrendingUp,
            iconBg: "bg-emerald-100",
            iconColor: "text-emerald-600",
            sub: "Items added to inventory",
        },
        {
            label: "Approval Rate",
            value: `${approvalRate}%`,
            icon: CheckCircle,
            iconBg: "bg-blue-100",
            iconColor: "text-blue-600",
            sub: "Submissions approved",
        },
        {
            label: "Pending Tasks",
            value: pendingTasks,
            icon: Clock,
            iconBg: "bg-amber-100",
            iconColor: "text-amber-600",
            sub: "Awaiting manager review",
        },
    ];

    return (
        <div className="mb-6 grid gap-4 sm:grid-cols-3">
            {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                    <div
                        key={stat.label}
                        className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                    >
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500">
                                    {stat.label}
                                </p>
                                <p className="mt-1 text-2xl font-semibold text-slate-900">
                                    {stat.value}
                                </p>
                                <p className="mt-0.5 text-xs text-slate-500">
                                    {stat.sub}
                                </p>
                            </div>
                            <div
                                className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.iconBg} ${stat.iconColor}`}
                            >
                                <Icon className="h-5 w-5" aria-hidden />
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
