"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "sonner";
import { type StaffHistoryItem, type WeeklyStats } from "@/app/actions/history";

type ExportHistoryButtonProps = {
    items: StaffHistoryItem[];
    weeklyStats: WeeklyStats;
    userName: string;
};

export default function ExportHistoryButton({
    items,
    weeklyStats,
    userName,
}: ExportHistoryButtonProps) {
    const [isExporting, setIsExporting] = useState(false);

    const handleExport = () => {
        setIsExporting(true);

        try {
            const doc = new jsPDF();

            // Title
            doc.setFontSize(18);
            doc.text("Laporan Riwayat Pengajuan", 14, 20);

            // Staff name and date
            doc.setFontSize(10);
            doc.text(`Staff: ${userName}`, 14, 28);
            doc.text(
                `Tanggal: ${new Date().toLocaleDateString("id-ID")}`,
                14,
                34
            );

            // Weekly Stats
            doc.setFontSize(12);
            doc.text("Ringkasan Mingguan (7 Hari Terakhir)", 14, 44);

            doc.setFontSize(10);
            doc.text(
                `Total Restocked: ${weeklyStats.totalRestocked} items`,
                14,
                52
            );
            doc.text(
                `Approval Rate: ${weeklyStats.approvalRate}%`,
                14,
                58
            );
            doc.text(
                `Pending Tasks: ${weeklyStats.pendingTasks}`,
                14,
                64
            );

            // History Table
            const tableData = items.map((item) => [
                new Date(item.createdAt).toLocaleDateString("id-ID"),
                item.productName,
                item.type === "IN" ? "Restock" : "Stock Reduction",
                item.quantity.toString(),
                item.status,
                item.status === "REJECTED" && item.rejectionReason
                    ? item.rejectionReason
                    : "-",
            ]);

            autoTable(doc, {
                startY: 72,
                head: [
                    [
                        "Tanggal",
                        "Produk",
                        "Tipe",
                        "Jumlah",
                        "Status",
                        "Catatan",
                    ],
                ],
                body: tableData,
                styles: { fontSize: 8 },
                headStyles: { fillColor: [71, 85, 105] },
            });

            // Save PDF
            doc.save(`Laporan_${userName}_${new Date().toISOString().split("T")[0]}.pdf`);
            toast.success("Laporan berhasil diunduh!");
        } catch (error) {
            console.error("Export error:", error);
            toast.error("Gagal mengekspor PDF");
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <button
            onClick={handleExport}
            disabled={isExporting}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-1 disabled:opacity-50"
        >
            <Download className="h-4 w-4" />
            {isExporting ? "Mengekspor..." : "Cetak Laporan Saya"}
        </button>
    );
}
