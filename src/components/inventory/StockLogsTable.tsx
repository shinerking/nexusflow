"use client";

import { useMemo } from "react";
import { Clock, TrendingUp, TrendingDown, Check } from "lucide-react";
import ApproveStockButton from "./ApproveStockButton";
import ExportStockLogsButton from "./ExportStockLogsButton";
import RoleGuard from "@/components/auth/RoleGuard";
import { type UserWithRole } from "@/app/actions/auth";

type StockLog = {
    id: string;
    userId: string;
    productId: string;
    type: "IN" | "OUT";
    quantity: number;
    reason: string;
    notes: string | null;
    status: "APPROVED" | "PENDING";
    approvedBy: string | null;
    createdAt: Date;
    product: {
        id: string;
        name: string;
    };
};

type StockLogsTableProps = {
    stockLogs: StockLog[];
    currentUser?: UserWithRole | null;
};

function formatDate(date: Date): string {
    return new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(date));
}

function StatusBadge({ type, status }: { type: "IN" | "OUT"; status: "APPROVED" | "PENDING" }) {
    if (status === "PENDING") {
        return (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700">
                <Clock className="h-3 w-3" />
                Pending Review
            </span>
        );
    }

    if (type === "IN") {
        return (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                <TrendingUp className="h-3 w-3" />
                Approved (IN)
            </span>
        );
    }

    return (
        <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-700">
            <TrendingDown className="h-3 w-3" />
            Approved (OUT)
        </span>
    );
}

export default function StockLogsTable({ stockLogs, currentUser }: StockLogsTableProps) {
    const pendingCount = useMemo(
        () => stockLogs.filter((log) => log.status === "PENDING").length,
        [stockLogs]
    );

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-slate-900">Stock Adjustment History</h2>
                    <p className="text-sm text-slate-500">
                        Riwayat perubahan stok dan approval status
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    {pendingCount > 0 && (
                        <RoleGuard userRole={currentUser?.role} action="APPROVE_STOCK_ADJUSTMENT">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1.5 text-sm font-medium text-amber-700">
                                <Clock className="h-4 w-4" />
                                {pendingCount} Pending Approval
                            </span>
                        </RoleGuard>
                    )}
                    <RoleGuard userRole={currentUser?.role} action="EXPORT_STOCK_LOGS">
                        <ExportStockLogsButton />
                    </RoleGuard>
                </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
                <table className="w-full min-w-[900px] text-left text-sm">
                    <thead>
                        <tr className="border-b border-slate-200 bg-slate-50/80">
                            <th className="px-6 py-3 font-medium text-slate-600">Date</th>
                            <th className="px-6 py-3 font-medium text-slate-600">Product</th>
                            <th className="px-6 py-3 font-medium text-slate-600">Type</th>
                            <th className="px-6 py-3 font-medium text-slate-600">Quantity</th>
                            <th className="px-6 py-3 font-medium text-slate-600">Reason</th>
                            <th className="px-6 py-3 font-medium text-slate-600">Status</th>
                            <th className="px-6 py-3 font-medium text-slate-600">Notes</th>
                            <th className="px-6 py-3 font-medium text-slate-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stockLogs.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="px-6 py-8 text-center text-slate-500">
                                    No stock adjustments yet.
                                </td>
                            </tr>
                        ) : (
                            stockLogs.map((log) => (
                                <tr
                                    key={log.id}
                                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50"
                                >
                                    <td className="px-6 py-3 text-slate-600">
                                        {formatDate(log.createdAt)}
                                    </td>
                                    <td className="px-6 py-3 font-medium text-slate-900">
                                        {log.product.name}
                                    </td>
                                    <td className="px-6 py-3">
                                        {log.type === "IN" ? (
                                            <span className="inline-flex items-center gap-1 text-emerald-700">
                                                <TrendingUp className="h-4 w-4" />
                                                IN
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 text-red-700">
                                                <TrendingDown className="h-4 w-4" />
                                                OUT
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-3 font-medium text-slate-900">
                                        {log.type === "IN" ? "+" : "-"}
                                        {log.quantity}
                                    </td>
                                    <td className="px-6 py-3 text-slate-600">{log.reason}</td>
                                    <td className="px-6 py-3">
                                        <StatusBadge type={log.type} status={log.status} />
                                    </td>
                                    <td className="px-6 py-3 text-slate-600">
                                        {log.notes || <span className="text-slate-400">—</span>}
                                    </td>
                                    <td className="px-6 py-3">
                                        {log.status === "PENDING" && (
                                            <RoleGuard userRole={currentUser?.role} action="APPROVE_STOCK_ADJUSTMENT">
                                                <ApproveStockButton
                                                    stockLogId={log.id}
                                                    productName={log.product.name}
                                                    quantity={log.quantity}
                                                />
                                            </RoleGuard>
                                        )}
                                        {log.status === "APPROVED" && (
                                            <span className="inline-flex items-center gap-1 text-xs text-emerald-600">
                                                <Check className="h-3 w-3" />
                                                Approved
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
