"use client";

import { FileDown } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type Product = {
  id: string;
  name: string;
  category: string;
  price: number | null;
  stock: number;
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

export default function ExportButton({ products }: { products: Product[] }) {
  const handleExportPDF = () => {
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
        doc.text(
          footerText,
          pageWidth / 2,
          pageHeight - 10,
          { align: "center" }
        );
      },
    });

    doc.save("inventory-report.pdf");
  };

  return (
    <button
      onClick={handleExportPDF}
      className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      title="Download inventory report as PDF"
    >
      <FileDown className="h-4 w-4" />
      Download Report
    </button>
  );
}
