"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { exportStockLogs } from "@/app/actions/exportStockLogs";

export default function ExportStockLogsButton() {
    const [isExporting, setIsExporting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleExport = async () => {
        setIsExporting(true);
        setError(null);

        try {
            const result = await exportStockLogs();

            if (result.success && result.data && result.filename) {
                // Convert base64 to blob
                const byteCharacters = atob(result.data);
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                const blob = new Blob([byteArray], {
                    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                });

                // Create download link
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.download = result.filename;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            } else {
                setError(result.error || "Failed to export audit log");
            }
        } catch (e) {
            console.error("Export error:", e);
            setError("An error occurred while exporting");
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div>
            <button
                onClick={handleExport}
                disabled={isExporting}
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1 disabled:opacity-50"
            >
                <Download className="h-4 w-4" />
                {isExporting ? "Exporting..." : "Download Audit Log"}
            </button>
            {error && (
                <p className="mt-2 text-sm text-red-600">{error}</p>
            )}
        </div>
    );
}
