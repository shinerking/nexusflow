import * as React from "react";

interface ApprovalNotificationProps {
    staffName: string;
    productName: string;
    type: "IN" | "OUT";
    quantity: number;
    reason: string;
    notes?: string | null;
    timestamp: string;
}

export const ApprovalNotification: React.FC<ApprovalNotificationProps> = ({
    staffName,
    productName,
    type,
    quantity,
    reason,
    notes,
    timestamp,
}) => (
    <div style={{ fontFamily: "sans-serif", maxWidth: "600px", margin: "0 auto" }}>
        <div style={{ backgroundColor: "#10b981", padding: "20px", borderRadius: "8px 8px 0 0" }}>
            <h1 style={{ color: "white", margin: 0, fontSize: "24px" }}>NexusFlow</h1>
        </div>

        <div style={{ border: "1px solid #e2e8f0", borderTop: "none", borderRadius: "0 0 8px 8px", padding: "24px" }}>
            <h2 style={{ color: "#1e293b", marginTop: 0 }}>Permintaan Persetujuan Stok Baru</h2>

            <p style={{ color: "#475569", fontSize: "16px" }}>
                Halo Manager,
            </p>

            <p style={{ color: "#475569", fontSize: "16px" }}>
                <strong>{staffName}</strong> baru saja mengajukan permintaan <strong>{type === "IN" ? "Stok Masuk" : "Stok Keluar"}</strong>.
            </p>

            <div style={{ backgroundColor: "#f8fafc", padding: "16px", borderRadius: "8px", margin: "20px 0" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <tbody>
                        <tr>
                            <td style={{ padding: "8px 0", color: "#64748b", width: "120px" }}>Produk</td>
                            <td style={{ padding: "8px 0", color: "#0f172a", fontWeight: "bold" }}>{productName}</td>
                        </tr>
                        <tr>
                            <td style={{ padding: "8px 0", color: "#64748b" }}>Tipe</td>
                            <td style={{ padding: "8px 0" }}>
                                <span style={{
                                    backgroundColor: type === "IN" ? "#dcfce7" : "#fee2e2",
                                    color: type === "IN" ? "#166534" : "#991b1b",
                                    padding: "4px 8px",
                                    borderRadius: "9999px",
                                    fontSize: "12px",
                                    fontWeight: "bold"
                                }}>
                                    {type === "IN" ? "IN (Restock)" : "OUT (Keluar/Rusak)"}
                                </span>
                            </td>
                        </tr>
                        <tr>
                            <td style={{ padding: "8px 0", color: "#64748b" }}>Jumlah</td>
                            <td style={{ padding: "8px 0", color: "#0f172a", fontWeight: "bold" }}>{quantity} Unit</td>
                        </tr>
                        <tr>
                            <td style={{ padding: "8px 0", color: "#64748b" }}>Waktu</td>
                            <td style={{ padding: "8px 0", color: "#0f172a" }}>{timestamp}</td>
                        </tr>
                        <tr>
                            <td style={{ padding: "8px 0", color: "#64748b", verticalAlign: "top" }}>Alasan</td>
                            <td style={{ padding: "8px 0", color: "#0f172a" }}>{reason}</td>
                        </tr>
                        {notes && (
                            <tr>
                                <td style={{ padding: "8px 0", color: "#64748b", verticalAlign: "top" }}>Catatan</td>
                                <td style={{ padding: "8px 0", color: "#0f172a" }}>{notes}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <a
                href="http://localhost:3000/approvals"
                style={{
                    display: "block",
                    backgroundColor: "#10b981",
                    color: "white",
                    textDecoration: "none",
                    textAlign: "center",
                    padding: "12px 24px",
                    borderRadius: "6px",
                    fontWeight: "bold",
                    fontSize: "16px",
                    marginTop: "24px"
                }}
            >
                Lihat & Proses di Dashboard
            </a>

            <p style={{ marginTop: "24px", fontSize: "12px", color: "#94a3b8", textAlign: "center" }}>
                © 2026 NexusFlow Inventory Management. All rights reserved.
            </p>
        </div>
    </div>
);

export type { ApprovalNotificationProps };
