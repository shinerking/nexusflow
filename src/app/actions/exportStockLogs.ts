"use server";

import * as XLSX from "xlsx";
import { getCurrentUser, requireRole } from "@/app/actions/auth";
import { prisma } from "@/lib/prisma";

/**
 * Export stock logs to Excel format
 * Permission: MANAGER, ADMIN, AUDITOR
 */
export async function exportStockLogs() {
    try {
        // Require MANAGER, ADMIN, or AUDITOR role
        await requireRole(["MANAGER", "ADMIN", "AUDITOR"]);

        // Fetch stock logs with related data
        const stockLogs = await prisma.stockLog.findMany({
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

        // Fetch user data to map userId to names
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
            },
        });

        const userMap = new Map(users.map((u) => [u.id, u.name]));

        // Transform data for Excel export
        const exportData = stockLogs.map((log) => ({
            "Tanggal": new Date(log.createdAt).toLocaleString("id-ID", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            }),
            "Nama Staff": userMap.get(log.userId) || "Unknown",
            "Nama Produk": log.product.name,
            "Jenis Perubahan": log.type === "IN" ? "Tambah Stok" : "Kurangi Stok",
            "Jumlah": log.type === "IN" ? `+${log.quantity}` : `-${log.quantity}`,
            "Alasan": log.reason,
            "Keterangan": log.notes || "-",
            "Status": log.status === "APPROVED" ? "Approved" : "Pending Review",
            "Disetujui Oleh": log.approvedBy ? userMap.get(log.approvedBy) || "Unknown" : "-",
        }));

        // Create workbook and worksheet
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(exportData);

        // Set column widths
        worksheet["!cols"] = [
            { wch: 18 }, // Tanggal
            { wch: 20 }, // Nama Staff
            { wch: 30 }, // Nama Produk
            { wch: 15 }, // Jenis Perubahan
            { wch: 10 }, // Jumlah
            { wch: 20 }, // Alasan
            { wch: 30 }, // Keterangan
            { wch: 15 }, // Status
            { wch: 20 }, // Disetujui Oleh
        ];

        XLSX.utils.book_append_sheet(workbook, worksheet, "Stock Audit Log");

        // Generate buffer
        const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

        return {
            success: true,
            data: Buffer.from(buffer).toString("base64"),
            filename: `Stock_Audit_Log_${new Date().toISOString().split("T")[0]}.xlsx`,
        };
    } catch (e) {
        console.error("exportStockLogs error:", e);
        if (e instanceof Error && e.message.includes("Akses Ditolak")) {
            return { success: false, error: e.message };
        }
        return { success: false, error: "Failed to export stock logs" };
    }
}
