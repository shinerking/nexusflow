"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { clsx } from "clsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "sonner";
import { type UserWithRole } from "@/app/actions/auth";

type Product = {
  id: string;
  name: string;
  category: string;
  price: number | null;
  stock: number;
};

type ExportButtonProps = {
  products: Product[];
  currentUser?: UserWithRole | null;
};

function formatCurrency(value: number | null): string {
  if (value == null) return "—";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export default function ExportButton({ products, currentUser }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const canDownload = currentUser && ["MANAGER", "ADMIN", "AUDITOR"].includes(currentUser.role);

  const handleExport = () => {
    if (!canDownload) {
      // STAFF: Just show toast, no download
      toast.info("Anda hanya bisa melihat data inventory.\n\nUntuk mengunduh report, hubungi Manager atau Admin.");
      return;
    }

    // MANAGER/ADMIN/AUDITOR: Download PDF
    setIsExporting(true);

    try {
      const doc = new jsPDF();

      // Header
      const today = new Date().toLocaleDateString("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      doc.setFontSize(16);
      doc.text("NexusFlow Inventory Report", 14, 16);
      doc.setFontSize(10);
      doc.text(`Generated on ${today}`, 14, 24);

      // Table
      const tableData = products.map((p) => [
        p.name,
        p.category,
        p.stock.toString(),
        formatCurrency(p.price),
      ]);

      autoTable(doc, {
        head: [["Name", "Category", "Stock", "Price"]],
        body: tableData,
        startY: 32,
        headStyles: {
          fillColor: [51, 65, 85],
          textColor: [255, 255, 255],
          fontStyle: "bold",
          fontSize: 11,
        },
        bodyStyles: {
          fontSize: 10,
        },
        alternateRowStyles: {
          fillColor: [248, 250, 252],
        },
        margin: { left: 14, right: 14 },
        didDrawPage: (data) => {
          // Footer
          const pageCount = doc.getNumberOfPages();
          const pageSize = doc.internal.pageSize;
          const pageHeight = pageSize.getHeight();
          const pageWidth = pageSize.getWidth();

          doc.setFontSize(9);
          doc.setTextColor(128, 128, 128);
          const footerText = `Page ${data.pageNumber} of ${pageCount}`;
          doc.text(footerText, pageWidth / 2, pageHeight - 10, {
            align: "center",
          });
        },
      });

      doc.save("inventory-report.pdf");
      toast.success("Report berhasil diunduh!");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Gagal mengekspor report. Silakan coba lagi.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={isExporting}
      className={clsx(
        "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1",
        canDownload
          ? "bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500"
          : "bg-slate-600 text-white hover:bg-slate-700 focus:ring-slate-500",
        isExporting && "opacity-50 cursor-not-allowed"
      )}
      title={canDownload ? "Download inventory report as PDF" : "View inventory data (download restricted)"}
    >
      {isExporting ? (
        <>
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          Exporting...
        </>
      ) : (
        <>
          <Download className="h-4 w-4" />
          {canDownload ? "Download Report" : "View Report"}
        </>
      )}
    </button>
  );
}
