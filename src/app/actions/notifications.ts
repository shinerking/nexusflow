"use server";

import { prisma } from "@/lib/prisma";

export async function checkNewPendingStockLogs(lastCheck: Date) {
    try {
        const logs = await prisma.stockLog.findMany({
            where: {
                status: "PENDING",
                createdAt: {
                    gt: lastCheck,
                },
            },
            include: {
                user: true,
                product: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return logs;
    } catch (error) {
        console.error("Error checking new pending logs:", error);
        return [];
    }
}
