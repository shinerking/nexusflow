"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, requireRole } from "@/app/actions/auth";
import { sendApprovalNotification } from "@/lib/email";
import { sendApprovalEmail } from "@/lib/mail";

export type CreateStockAdjustmentState = {
    error?: string;
    success?: boolean;
    message?: string;
    isPending?: boolean;
};

export type ApproveStockAdjustmentState = {
    error?: string;
    success?: boolean;
    message?: string;
};

/**
 * Create a stock adjustment record
 * - STAFF: Always creates PENDING record (both IN and OUT require approval)
 * - MANAGER/ADMIN: Auto-approve and immediately update stock
 */
export async function createStockAdjustment(
    _prevState: CreateStockAdjustmentState | null,
    formData: FormData
): Promise<CreateStockAdjustmentState> {
    try {
        // Require STAFF, MANAGER, or ADMIN role
        const currentUser = await requireRole(["STAFF", "MANAGER", "ADMIN"]);

        const productId = formData.get("productId")?.toString().trim();
        const type = formData.get("type")?.toString().trim() as "IN" | "OUT";
        const quantityStr = formData.get("quantity")?.toString().trim();
        const reason = formData.get("reason")?.toString().trim();
        const notes = formData.get("notes")?.toString().trim() || null;

        // Validation
        if (!productId) {
            return { error: "Product ID is required" };
        }

        if (!type || !["IN", "OUT"].includes(type)) {
            return { error: "Type must be IN or OUT" };
        }

        if (!quantityStr) {
            return { error: "Quantity is required" };
        }

        const quantity = parseInt(quantityStr, 10);
        if (isNaN(quantity) || quantity <= 0) {
            return { error: "Quantity must be a positive number" };
        }

        if (!reason) {
            return { error: "Reason is required" };
        }

        // Check if product exists
        const product = await prisma.product.findUnique({
            where: { id: productId },
        });

        if (!product) {
            return { error: "Product not found" };
        }

        // Determine status based on user role
        // STAFF: Always PENDING (needs approval)
        // MANAGER/ADMIN: Auto-approve
        const isManagerOrAdmin = ["MANAGER", "ADMIN"].includes(currentUser.role);
        const status = isManagerOrAdmin ? "APPROVED" : "PENDING";

        // Only change stock if auto-approved (MANAGER/ADMIN)
        const shouldUpdateStock = isManagerOrAdmin;

        // Create stock log and update product stock in a transaction
        await prisma.$transaction(async (tx) => {
            // Create stock log
            await tx.stockLog.create({
                data: {
                    userId: currentUser.id,
                    productId,
                    type,
                    quantity,
                    reason,
                    notes,
                    status,
                    approvedBy: isManagerOrAdmin ? currentUser.id : null,
                },
            });

            // Update product stock only if auto-approved
            if (shouldUpdateStock) {
                await tx.product.update({
                    where: { id: productId },
                    data: {
                        stock: {
                            [type === "IN" ? "increment" : "decrement"]: quantity,
                        },
                    },
                });
            }
        });

        // Send email notification to managers (async, non-blocking)
        if (!isManagerOrAdmin) {
            // Fetch all managers in organization who have enabled notifications
            // Note: emailNotifications field was added to schema, but we use a try/catch block 
            // or optional access to avoid crashing if migration hasn't fully propagated in client types yet
            const managers = await prisma.user.findMany({
                where: {
                    organizationId: currentUser.organizationId,
                    role: "MANAGER",
                    // @ts-ignore - Ignore TS error if client type isn't regenerated yet
                    emailNotifications: true,
                },
                select: { email: true, name: true },
            });

            if (managers.length > 0) {
                const managerEmails = managers.map(m => m.email);

                // Send email asynchronously without awaiting to ensure UI doesn't block
                sendApprovalNotification({
                    to: managerEmails,
                    staffName: currentUser.name,
                    productName: product.name,
                    type,
                    quantity,
                    reason,
                    notes,
                    timestamp: new Date().toLocaleString("id-ID", {
                        dateStyle: "full",
                        timeStyle: "short"
                    })
                }).catch(err => {
                    console.error("Failed to send approval notification email:", err);
                });
            }
        }

        revalidatePath("/inventory");
        revalidatePath("/approvals");

        // Return appropriate message based on role and type
        if (isManagerOrAdmin) {
            return {
                success: true,
                message: type === "IN"
                    ? "Stok berhasil ditambahkan"
                    : "Stok berhasil dikurangi",
                isPending: false,
            };
        } else {
            return {
                success: true,
                message: type === "IN"
                    ? "Permintaan penambahan stok telah dikirim ke Manager untuk diverifikasi"
                    : "Laporan barang rusak telah dikirim ke Manager untuk diverifikasi",
                isPending: true,
            };
        }
    } catch (e) {
        console.error("createStockAdjustment error:", e);
        if (e instanceof Error && e.message.includes("Akses Ditolak")) {
            return { error: e.message };
        }
        return { error: "Failed to create stock adjustment" };
    }
}

/**
 * Approve a pending stock adjustment (MANAGER/ADMIN only)
 * Decreases product stock and marks the adjustment as approved
 */
export async function approveStockAdjustment(
    _prevState: ApproveStockAdjustmentState | null,
    formData: FormData
): Promise<ApproveStockAdjustmentState> {
    try {
        // Require MANAGER or ADMIN role
        const currentUser = await requireRole(["MANAGER", "ADMIN"]);

        const stockLogId = formData.get("stockLogId")?.toString().trim();

        if (!stockLogId) {
            return { error: "Stock log ID is required" };
        }

        // Find the stock log
        const stockLog = await prisma.stockLog.findUnique({
            where: { id: stockLogId },
            include: { product: true, user: true },
        });

        if (!stockLog) {
            return { error: "Stock adjustment record not found" };
        }

        if (stockLog.status !== "PENDING") {
            return { error: "This adjustment has already been processed" };
        }

        // Check if product has enough stock for OUT adjustments
        if (stockLog.type === "OUT" && stockLog.product.stock < stockLog.quantity) {
            return {
                error: `Insufficient stock. Current stock: ${stockLog.product.stock}, requested: ${stockLog.quantity}`,
            };
        }

        // Update stock log and product stock in a transaction
        await prisma.$transaction(async (tx) => {
            // Update stock log status
            await tx.stockLog.update({
                where: { id: stockLogId },
                data: {
                    status: "APPROVED",
                    approvedBy: currentUser.id,
                },
            });

            // Update product stock based on type
            await tx.product.update({
                where: { id: stockLog.productId },
                data: {
                    stock: {
                        [stockLog.type === "IN" ? "increment" : "decrement"]: stockLog.quantity,
                    },
                },
            });

            // Send approval email notification (Async)
            // Convert Decimal price to number, defaulting to 0 if null
            const price = stockLog.product.price ? Number(stockLog.product.price) : 0;
            const amount = stockLog.quantity * price;

            // Log for debugging
            console.log(`[Approval] Triggering email for ${stockLog.product.name} to ${stockLog.user.email}`);

            // We use the simpler HTML email from mail.ts as requested by user
            sendApprovalEmail(
                stockLog.product.name,
                amount,
                stockLog.user.email
            ).catch(err => {
                console.error("Failed to send approval email:", err);
            });
        });

        revalidatePath("/inventory");
        revalidatePath("/approvals");

        return {
            success: true,
            message: stockLog.type === "IN"
                ? "Penambahan stok berhasil di-approve"
                : "Pengurangan stok berhasil di-approve",
        };
    } catch (e) {
        console.error("approveStockAdjustment error:", e);
        if (e instanceof Error && e.message.includes("Akses Ditolak")) {
            return { error: e.message };
        }
        return { error: "Failed to approve stock adjustment" };
    }
}

/**
 * Get stock logs with product and user details
 * Returns all stock logs ordered by creation date (newest first)
 */
export async function getStockLogs() {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
            return [];
        }

        const stockLogs = await prisma.stockLog.findMany({
            include: {
                product: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return stockLogs;
    } catch (e) {
        console.error("getStockLogs error:", e);
        return [];
    }
}
