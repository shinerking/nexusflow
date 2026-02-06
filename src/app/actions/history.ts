"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/app/actions/auth";

export type StaffHistoryItem = {
    id: string;
    createdAt: Date;
    productName: string;
    type: "IN" | "OUT";
    quantity: number;
    status: "PENDING" | "APPROVED" | "REJECTED";
    reason: string | null;
    notes: string | null;
    rejectionReason: string | null;
};

export type WeeklyStats = {
    totalRestocked: number;
    approvalRate: number;
    pendingTasks: number;
};

export type StaffHistoryData = {
    items: StaffHistoryItem[];
    weeklyStats: WeeklyStats;
};

/**
 * Get staff member's submission history and weekly performance stats
 * Only returns data for the current logged-in user
 */
export async function getStaffHistory(): Promise<StaffHistoryData> {
    try {
        const currentUser = await getCurrentUser();

        if (!currentUser) {
            throw new Error("Unauthorized");
        }

        // Fetch all stock logs for this user
        const allLogs = await prisma.stockLog.findMany({
            where: {
                userId: currentUser.id,
            },
            include: {
                product: {
                    select: {
                        name: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        // Calculate weekly stats (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const weeklyLogs = allLogs.filter(
            (log) => log.createdAt >= sevenDaysAgo
        );

        // Total Restocked (7 days) - sum of approved IN adjustments
        const totalRestocked = weeklyLogs
            .filter((log) => log.type === "IN" && log.status === "APPROVED")
            .reduce((sum, log) => sum + log.quantity, 0);

        // Approval Rate - percentage of approved vs total
        const totalSubmissions = weeklyLogs.length;
        const approvedSubmissions = weeklyLogs.filter(
            (log) => log.status === "APPROVED"
        ).length;
        const approvalRate =
            totalSubmissions > 0
                ? Math.round((approvedSubmissions / totalSubmissions) * 100)
                : 0;

        // Pending Tasks - count of pending submissions
        const pendingTasks = allLogs.filter(
            (log) => log.status === "PENDING"
        ).length;

        // Transform logs to history items
        const items: StaffHistoryItem[] = allLogs.map((log) => ({
            id: log.id,
            createdAt: log.createdAt,
            productName: log.product.name,
            type: log.type,
            quantity: log.quantity,
            status: log.status,
            reason: log.reason,
            notes: log.notes,
            rejectionReason: log.rejectionReason,
        }));

        return {
            items,
            weeklyStats: {
                totalRestocked,
                approvalRate,
                pendingTasks,
            },
        };
    } catch (e) {
        console.error("getStaffHistory error:", e);
        return {
            items: [],
            weeklyStats: {
                totalRestocked: 0,
                approvalRate: 0,
                pendingTasks: 0,
            },
        };
    }
}
