"use client";

import { useState, useActionState } from "react";
import { X, Package, AlertCircle, CheckCircle } from "lucide-react";
import { createStockAdjustment, type CreateStockAdjustmentState } from "@/app/actions/stock";

type Product = {
    id: string;
    name: string;
    stock: number;
};

type StockAdjustmentModalProps = {
    product: Product;
};

const REASONS_IN = [
    { value: "Restock", label: "Restock" },
    { value: "Pembelian Baru", label: "Pembelian Baru" },
    { value: "Retur Customer", label: "Retur dari Customer" },
];

const REASONS_OUT = [
    { value: "Barang Rusak", label: "Barang Rusak" },
    { value: "Barang Expired", label: "Barang Expired" },
    { value: "Salah Input", label: "Salah Input" },
];

export default function StockAdjustmentModal({ product }: StockAdjustmentModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [type, setType] = useState<"IN" | "OUT">("IN");
    const [state, formAction, isPending] = useActionState<CreateStockAdjustmentState | null, FormData>(
        createStockAdjustment,
        null
    );

    const reasons = type === "IN" ? REASONS_IN : REASONS_OUT;

    const handleClose = () => {
        if (!isPending) {
            setIsOpen(false);
            setType("IN");
        }
    };

    // Auto-close on success after showing message
    if (state?.success && isOpen) {
        setTimeout(() => {
            setIsOpen(false);
            setType("IN");
        }, 2000);
    }

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                title="Adjust Stock"
            >
                <Package className="h-4 w-4" />
                Adjust
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-xl bg-white shadow-xl dark:bg-slate-900 dark:border dark:border-slate-800">
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800">
                            <div>
                                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Stock Adjustment</h2>
                                <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">{product.name}</p>
                                <p className="text-xs text-slate-400 dark:text-slate-500">Current Stock: {product.stock}</p>
                            </div>
                            <button
                                onClick={handleClose}
                                disabled={isPending}
                                className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 disabled:opacity-50 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Form */}
                        <form action={formAction} className="p-6">
                            <input type="hidden" name="productId" value={product.id} />
                            <input type="hidden" name="type" value={type} />

                            <div className="space-y-4">
                                {/* Type Selection */}
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Tipe Perubahan
                                    </label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setType("IN")}
                                            disabled={isPending}
                                            className={`rounded-lg border-2 px-4 py-3 text-sm font-medium transition-all ${type === "IN"
                                                ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400"
                                                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:border-slate-600"
                                                } disabled:opacity-50`}
                                        >
                                            ➕ Tambah Stok
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setType("OUT")}
                                            disabled={isPending}
                                            className={`rounded-lg border-2 px-4 py-3 text-sm font-medium transition-all ${type === "OUT"
                                                ? "border-red-500 bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                                                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:border-slate-600"
                                                } disabled:opacity-50`}
                                        >
                                            ➖ Kurangi Stok
                                        </button>
                                    </div>
                                </div>

                                {/* Quantity */}
                                <div>
                                    <label htmlFor="quantity" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Jumlah Perubahan <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        id="quantity"
                                        name="quantity"
                                        min="1"
                                        required
                                        disabled={isPending}
                                        className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-blue-500 dark:disabled:bg-slate-800/50"
                                        placeholder="Masukkan jumlah"
                                    />
                                </div>

                                {/* Reason */}
                                <div>
                                    <label htmlFor="reason" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Alasan <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        id="reason"
                                        name="reason"
                                        required
                                        disabled={isPending}
                                        className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-blue-500 dark:disabled:bg-slate-800/50"
                                    >
                                        <option value="">Pilih alasan...</option>
                                        {reasons.map((r) => (
                                            <option key={r.value} value={r.value}>
                                                {r.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Notes */}
                                <div>
                                    <label htmlFor="notes" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Catatan (Opsional)
                                    </label>
                                    <textarea
                                        id="notes"
                                        name="notes"
                                        rows={3}
                                        disabled={isPending}
                                        className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-blue-500 dark:disabled:bg-slate-800/50"
                                        placeholder="Keterangan tambahan..."
                                    />
                                </div>

                                {/* Error Message */}
                                {state?.error && (
                                    <div className="flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                                        <AlertCircle className="h-5 w-5 flex-shrink-0" />
                                        <p>{state.error}</p>
                                    </div>
                                )}

                                {/* Success Message */}
                                {state?.success && (
                                    <div
                                        className={`flex items-start gap-2 rounded-lg p-3 text-sm ${state.isPending
                                            ? "bg-amber-50 text-amber-700"
                                            : "bg-emerald-50 text-emerald-700"
                                            }`}
                                    >
                                        <CheckCircle className="h-5 w-5 flex-shrink-0" />
                                        <p>{state.message}</p>
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="mt-6 flex gap-3">
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    disabled={isPending}
                                    className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={isPending}
                                    className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {isPending ? "Memproses..." : "Submit"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
