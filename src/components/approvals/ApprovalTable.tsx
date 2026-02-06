"use client";

import { useState, useMemo } from "react";
import { CheckCircle, XCircle, Clock, Package, TrendingUp, TrendingDown } from "lucide-react";
import { type ApprovalItem } from "@/app/actions/approval";
import { type UserWithRole } from "@/app/actions/auth";
import ApprovalActionButtons from "./ApprovalActionButtons";
import BulkApprovalButtons from "./BulkApprovalButtons";

type ApprovalTableProps = {
    items: ApprovalItem[];
    currentUser: UserWithRole;
};

export default function ApprovalTable({ items, currentUser }: ApprovalTableProps) {
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedIds(new Set(items.map((item) => item.id)));
        } else {
            setSelectedIds(new Set());
        }
    };

    const handleSelectOne = (id: string, checked: boolean) => {
        const newSelected = new Set(selectedIds);
        if (checked) {
            newSelected.add(id);
        } else {
            newSelected.delete(id);
        }
        setSelectedIds(newSelected);
    };

    const selectedItems = useMemo(() => {
        return items.filter((item) => selectedIds.has(item.id));
    }, [items, selectedIds]);

    const allSelected = items.length > 0 && selectedIds.size === items.length;
    const someSelected = selectedIds.size > 0 && selectedIds.size < items.length;

    const getActionTypeBadge = (actionType: string, type: string) => {
        if (type === "PRODUCT") {
            return (
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                    <Package className="h-3 w-3" />
                    {actionType}
                </span>
            );
        }

        if (actionType === "Restock") {
            return (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                    <TrendingUp className="h-3 w-3" />
                    {actionType}
                </span>
            );
        }

        return (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700">
                <TrendingDown className="h-3 w-3" />
                {actionType}
            </span>
        );
    };

    if (items.length === 0) {
        return (
            <div className="rounded-xl border border-slate-200 bg-white p-12 text-center shadow-sm">
                <CheckCircle className="mx-auto h-12 w-12 text-emerald-500" />
                <h3 className="mt-4 text-lg font-semibold text-slate-900">
                    No Pending Approvals
                </h3>
                <p className="mt-2 text-sm text-slate-500">
                    Semua transaksi telah diverifikasi
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Bulk Actions Header */}
            <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                <div className="flex items-center gap-3">
                    <input
                        type="checkbox"
                        checked={allSelected}
                        ref={(input) => {
                            if (input) {
                                input.indeterminate = someSelected;
                            }
                        }}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-2 focus:ring-slate-400 focus:ring-offset-1"
                    />
                    <span className="text-sm font-medium text-slate-700">
                        {selectedIds.size > 0
                            ? `${selectedIds.size} item${selectedIds.size > 1 ? "s" : ""} selected`
                            : "Select All"}
                    </span>
                </div>

                {selectedIds.size > 0 && (
                    <BulkApprovalButtons
                        selectedItems={selectedItems}
                        onComplete={() => setSelectedIds(new Set())}
                    />
                )}
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
                <table className="w-full">
                    <thead className="border-b border-slate-200 bg-slate-50">
                        <tr>
                            <th className="px-4 py-3 text-left">
                                <span className="sr-only">Select</span>
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                                Tanggal
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                                Tipe Aksi
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                                Staff
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                                Produk
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                                Jumlah
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                                Alasan
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-600">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {items.map((item) => (
                            <tr
                                key={item.id}
                                className={`transition-colors hover:bg-slate-50 ${selectedIds.has(item.id) ? "bg-blue-50" : ""
                                    }`}
                            >
                                <td className="px-4 py-3">
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.has(item.id)}
                                        onChange={(e) => handleSelectOne(item.id, e.target.checked)}
                                        className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-2 focus:ring-slate-400 focus:ring-offset-1"
                                    />
                                </td>
                                <td className="px-6 py-3 text-sm text-slate-600">
                                    {new Date(item.date).toLocaleDateString("id-ID", {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </td>
                                <td className="px-6 py-3">
                                    {getActionTypeBadge(item.actionType, item.type)}
                                </td>
                                <td className="px-6 py-3 text-sm font-medium text-slate-900">
                                    {item.staffName}
                                </td>
                                <td className="px-6 py-3 text-sm text-slate-900">
                                    {item.productName}
                                </td>
                                <td className="px-6 py-3 text-sm text-slate-600">
                                    {item.quantity !== undefined ? (
                                        <span className={item.type === "STOCK_ADJUSTMENT" && item.actionType !== "Restock" ? "text-red-600" : "text-emerald-600"}>
                                            {item.type === "STOCK_ADJUSTMENT" && item.actionType !== "Restock" ? "-" : "+"}
                                            {item.quantity}
                                        </span>
                                    ) : (
                                        "-"
                                    )}
                                </td>
                                <td className="px-6 py-3 text-sm text-slate-600">
                                    <div className="max-w-xs">
                                        <p className="truncate">{item.reason || "-"}</p>
                                        {item.notes && (
                                            <p className="mt-0.5 truncate text-xs text-slate-500">
                                                {item.notes}
                                            </p>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-3 text-right">
                                    <ApprovalActionButtons
                                        itemId={item.id}
                                        itemType={item.type}
                                        productName={item.productName}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Summary */}
            <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Clock className="h-4 w-4" />
                    <span>
                        Total: <span className="font-semibold text-slate-900">{items.length}</span> pending approval
                        {items.length > 1 ? "s" : ""}
                    </span>
                </div>
            </div>
        </div>
    );
}
