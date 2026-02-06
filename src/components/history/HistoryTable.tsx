"use client";

import { useState, Fragment } from "react";
import { AlertCircle, TrendingUp, TrendingDown, ChevronDown } from "lucide-react";
import { type StaffHistoryItem } from "@/app/actions/history";

type HistoryTableProps = {
    items: StaffHistoryItem[];
};

type StatusFilter = "ALL" | "APPROVED" | "PENDING" | "REJECTED";

export default function HistoryTable({ items }: HistoryTableProps) {
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

    const filteredItems = items.filter((item) => {
        if (statusFilter === "ALL") return true;
        return item.status === statusFilter;
    });

    const toggleRow = (id: string) => {
        const newExpanded = new Set(expandedRows);
        if (newExpanded.has(id)) {
            newExpanded.delete(id);
        } else {
            newExpanded.add(id);
        }
        setExpandedRows(newExpanded);
    };

    const getStatusBadge = (status: string) => {
        const styles = {
            APPROVED: "bg-emerald-100 text-emerald-700",
            PENDING: "bg-amber-100 text-amber-700",
            REJECTED: "bg-red-100 text-red-700",
        };
        return (
            <span
                className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status as keyof typeof styles] || "bg-slate-100 text-slate-700"
                    }`}
            >
                {status}
            </span>
        );
    };

    const getTypeBadge = (type: string) => {
        if (type === "IN") {
            return (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                    <TrendingUp className="h-3 w-3" />
                    Restock
                </span>
            );
        }
        return (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700">
                <TrendingDown className="h-3 w-3" />
                Stock Reduction
            </span>
        );
    };

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }).format(new Date(date));
    };

    return (
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
            {/* Header with Filter */}
            <div className="border-b border-slate-200 px-6 py-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-slate-900">
                            Submission History
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                            Track your stock adjustment requests
                        </p>
                    </div>
                    <div className="relative">
                        <select
                            value={statusFilter}
                            onChange={(e) =>
                                setStatusFilter(e.target.value as StatusFilter)
                            }
                            className="appearance-none rounded-lg border border-slate-200 bg-white px-4 py-2 pr-10 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-1"
                        >
                            <option value="ALL">All Status</option>
                            <option value="APPROVED">Approved</option>
                            <option value="PENDING">Pending</option>
                            <option value="REJECTED">Rejected</option>
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full min-w-[600px]">
                    <thead className="border-b border-slate-200 bg-slate-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                                Time
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                                Product
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                                Type
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                                Quantity
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                                Status
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredItems.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={5}
                                    className="px-6 py-12 text-center text-slate-500"
                                >
                                    <div className="flex flex-col items-center gap-2">
                                        <AlertCircle className="h-8 w-8 text-slate-400" />
                                        <p>No submissions found</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            filteredItems.map((item) => (
                                <Fragment key={item.id}>
                                    <tr
                                        key={item.id}
                                        className="transition-colors hover:bg-slate-50"
                                    >
                                        <td className="px-6 py-3 text-sm text-slate-600">
                                            {formatDate(item.createdAt)}
                                        </td>
                                        <td className="px-6 py-3 text-sm font-medium text-slate-900">
                                            {item.productName}
                                        </td>
                                        <td className="px-6 py-3">
                                            {getTypeBadge(item.type)}
                                        </td>
                                        <td className="px-6 py-3 text-sm font-semibold text-slate-900">
                                            {item.quantity}
                                        </td>
                                        <td className="px-6 py-3">
                                            <div className="flex items-center gap-2">
                                                {getStatusBadge(item.status)}
                                                {item.status === "REJECTED" &&
                                                    item.rejectionReason && (
                                                        <button
                                                            onClick={() => toggleRow(item.id)}
                                                            className="text-xs text-slate-500 underline hover:text-slate-700"
                                                        >
                                                            {expandedRows.has(item.id)
                                                                ? "Hide"
                                                                : "View"}{" "}
                                                            reason
                                                        </button>
                                                    )}
                                            </div>
                                        </td>
                                    </tr>
                                    {item.status === "REJECTED" &&
                                        item.rejectionReason &&
                                        expandedRows.has(item.id) && (
                                            <tr key={`${item.id}-reason`}>
                                                <td
                                                    colSpan={5}
                                                    className="bg-red-50 px-6 py-3"
                                                >
                                                    <div className="flex items-start gap-2">
                                                        <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-600" />
                                                        <div>
                                                            <p className="text-xs font-semibold text-red-900">
                                                                Rejection Reason:
                                                            </p>
                                                            <p className="mt-1 text-sm text-red-700">
                                                                {item.rejectionReason}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                </Fragment>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Footer */}
            <div className="border-t border-slate-200 px-6 py-3">
                <p className="text-sm text-slate-500">
                    Showing {filteredItems.length} of {items.length} submissions
                </p>
            </div>
        </div>
    );
}
