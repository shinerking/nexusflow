"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, requireRole } from "@/app/actions/auth";

export type ApprovalItem = {
    id: string;
    type: "PRODUCT" | "STOCK_ADJUSTMENT";
    date: Date;
    actionType: string;
    staffId: string;
    staffName: string;
    productName: string;
    quantity?: number;
    reason?: string;
    notes?: string;
};

export type PendingApprovalsData = {
    items: ApprovalItem[];
    totalCount: number;
};

/**
 * Get count of all pending approvals (products and stock adjustments)
 * Lightweight function for badges/notifications
 */
export async function getPendingApprovalsCount(): Promise<number> {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser || !["MANAGER", "ADMIN"].includes(currentUser.role)) {
            return 0;
        }

        const [productCount, stockCount] = await Promise.all([
            prisma.product.count({
                where: { status: "PENDING", organizationId: currentUser.organizationId },
            }),
            prisma.stockLog.count({
                where: {
                    status: "PENDING",
                    product: { organizationId: currentUser.organizationId }
                },
            }),
        ]);

        return productCount + stockCount;
    } catch (e) {
        console.error("getPendingApprovalsCount error:", e);
        return 0;
    }
}

/**
 * Get all pending approvals (products and stock adjustments)
 * Permission: MANAGER, ADMIN only
 */
export async function getPendingApprovals(): Promise<PendingApprovalsData> {
    try {
        const currentUser = await requireRole(["MANAGER", "ADMIN"]);

        // Fetch pending products
        const pendingProducts = await prisma.product.findMany({
            where: {
                status: "PENDING",
                organizationId: currentUser.organizationId,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        // Fetch pending stock adjustments with user info joined
        const pendingStockAdjustments = await prisma.stockLog.findMany({
            where: {
                status: "PENDING",
                product: { organizationId: currentUser.organizationId }
            },
            include: {
                user: {
                    select: { name: true },
                },
                product: {
                    select: { name: true },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        // Transform pending products
        const productItems: ApprovalItem[] = pendingProducts.map((p) => ({
            id: p.id,
            type: "PRODUCT" as const,
            date: p.createdAt,
            actionType: "New Product",
            staffId: "",
            staffName: "System",
            productName: p.name,
            quantity: p.stock,
            reason: undefined,
            notes: undefined,
        }));

        // Transform pending stock adjustments
        const stockItems: ApprovalItem[] = pendingStockAdjustments.map((s) => ({
            id: s.id,
            type: "STOCK_ADJUSTMENT" as const,
            date: s.createdAt,
            actionType: s.type === "IN" ? "Restock" : "Stock Reduction",
            staffId: s.userId,
            staffName: s.user.name || "Unknown",
            productName: s.product.name,
            quantity: s.quantity,
            reason: s.reason,
            notes: s.notes || undefined,
        }));

        // Combine and sort by date
        const allItems = [...productItems, ...stockItems].sort(
            (a, b) => b.date.getTime() - a.date.getTime()
        );

        return {
            items: allItems,
            totalCount: allItems.length,
        };
    } catch (e) {
        console.error("getPendingApprovals error:", e);
        if (e instanceof Error && e.message.includes("Akses Ditolak")) {
            throw e;
        }
        return { items: [], totalCount: 0 };
    }
}

export type ProcessApprovalState = {
    error?: string;
    success?: boolean;
    message?: string;
};

/**
 * Process single approval (approve or reject)
 * Permission: MANAGER, ADMIN only
 */
export async function processApproval(
    itemType: "PRODUCT" | "STOCK_ADJUSTMENT",
    itemId: string,
    action: "APPROVE" | "REJECT",
    rejectionReason?: string
): Promise<ProcessApprovalState> {
    try {
        const currentUser = await requireRole(["MANAGER", "ADMIN"]);

        if (action === "REJECT" && !rejectionReason) {
            return { error: "Rejection reason is required" };
        }

        if (itemType === "PRODUCT") {
            // Handle product approval/rejection
            await prisma.product.update({
                where: { id: itemId },
                data: {
                    status: action === "APPROVE" ? "APPROVED" : "PENDING", // Keep as PENDING if rejected (or delete)
                },
            });

            // If rejected, we could delete the product or keep it with a rejected status
            // For now, we'll just keep it as PENDING (you can modify this logic)
            if (action === "REJECT") {
                // Optionally delete rejected products
                await prisma.product.delete({
                    where: { id: itemId },
                });
            }
        } else {
            // Handle stock adjustment approval/rejection
            const stockLog = await prisma.stockLog.findUnique({
                where: { id: itemId },
                include: { product: true },
            });

            if (!stockLog) {
                return { error: "Stock adjustment not found" };
            }

            if (stockLog.status !== "PENDING") {
                return { error: "This adjustment has already been processed" };
            }

            if (action === "APPROVE") {
                // Check if product has enough stock for OUT adjustments
                if (stockLog.type === "OUT" && stockLog.product.stock < stockLog.quantity) {
                    return {
                        error: `Insufficient stock. Current: ${stockLog.product.stock}, Requested: ${stockLog.quantity}`,
                    };
                }

                // Update stock log and product stock in transaction
                await prisma.$transaction(async (tx) => {
                    // Update stock log
                    await tx.stockLog.update({
                        where: { id: itemId },
                        data: {
                            status: "APPROVED",
                            approvedBy: currentUser.id,
                        },
                    });

                    // Update product stock
                    await tx.product.update({
                        where: { id: stockLog.productId },
                        data: {
                            stock: {
                                [stockLog.type === "IN" ? "increment" : "decrement"]: stockLog.quantity,
                            },
                        },
                    });
                });
            } else {
                // Reject the adjustment
                await prisma.stockLog.update({
                    where: { id: itemId },
                    data: {
                        status: "REJECTED",
                        rejectionReason,
                        rejectedBy: currentUser.id,
                    },
                });
            }
        }

        revalidatePath("/approvals");
        revalidatePath("/inventory");

        return {
            success: true,
            message: action === "APPROVE" ? "Item approved successfully" : "Item rejected",
        };
    } catch (e) {
        console.error("processApproval error:", e);
        if (e instanceof Error && e.message.includes("Akses Ditolak")) {
            return { error: e.message };
        }
        return { error: "Failed to process approval" };
    }
}

/**
 * Process bulk approvals
 * Permission: MANAGER, ADMIN only
 */
export async function processBulkApproval(
    items: Array<{ itemType: "PRODUCT" | "STOCK_ADJUSTMENT"; itemId: string }>,
    action: "APPROVE" | "REJECT",
    rejectionReason?: string
): Promise<ProcessApprovalState> {
    try {
        await requireRole(["MANAGER", "ADMIN"]);

        if (action === "REJECT" && !rejectionReason) {
            return { error: "Rejection reason is required for bulk rejection" };
        }

        let successCount = 0;
        let errorCount = 0;

        for (const item of items) {
            const result = await processApproval(
                item.itemType,
                item.itemId,
                action,
                rejectionReason
            );
            if (result.success) {
                successCount++;
            } else {
                errorCount++;
            }
        }

        revalidatePath("/approvals");
        revalidatePath("/inventory");

        return {
            success: true,
            message: `Processed ${successCount} items successfully${errorCount > 0 ? `, ${errorCount} failed` : ""}`,
        };
    } catch (e) {
        console.error("processBulkApproval error:", e);
        if (e instanceof Error && e.message.includes("Akses Ditolak")) {
            return { error: e.message };
        }
        return { error: "Failed to process bulk approval" };
    }
}
