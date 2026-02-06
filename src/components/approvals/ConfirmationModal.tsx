"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, CheckCircle, XCircle } from "lucide-react";

type ConfirmationModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText: string;
    confirmVariant: "approve" | "reject";
    itemDetails?: {
        productName: string;
        quantity?: number;
        reason?: string;
    };
};

export default function ConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText,
    confirmVariant,
    itemDetails,
}: ConfirmationModalProps) {
    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    aria-modal="true"
                    role="dialog"
                >
                    {/* Backdrop with blur */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{
                            duration: 0.2,
                            ease: [0.4, 0, 0.2, 1]
                        }}
                        className="relative w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-2xl"
                    >
                        {/* Header */}
                        <div className="mb-4 flex items-start gap-3">
                            <div
                                className={`rounded-full p-2 ${confirmVariant === "approve"
                                        ? "bg-emerald-100"
                                        : "bg-red-100"
                                    }`}
                            >
                                {confirmVariant === "approve" ? (
                                    <CheckCircle className="h-6 w-6 text-emerald-600" />
                                ) : (
                                    <AlertCircle className="h-6 w-6 text-red-600" />
                                )}
                            </div>
                            <div className="flex-1">
                                <h2 className="text-lg font-semibold text-slate-900">
                                    {title}
                                </h2>
                                <p className="mt-1 text-sm text-slate-600">
                                    {message}
                                </p>
                            </div>
                        </div>

                        {/* Item Details */}
                        {itemDetails && (
                            <div className="mb-6 rounded-lg border border-slate-200 bg-slate-50 p-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-sm font-medium text-slate-700">
                                            Produk:
                                        </span>
                                        <span className="text-sm font-semibold text-slate-900">
                                            {itemDetails.productName}
                                        </span>
                                    </div>
                                    {itemDetails.quantity !== undefined && (
                                        <div className="flex justify-between">
                                            <span className="text-sm font-medium text-slate-700">
                                                Jumlah:
                                            </span>
                                            <span className="text-sm font-semibold text-slate-900">
                                                {itemDetails.quantity}
                                            </span>
                                        </div>
                                    )}
                                    {itemDetails.reason && (
                                        <div className="flex flex-col gap-1">
                                            <span className="text-sm font-medium text-slate-700">
                                                Alasan:
                                            </span>
                                            <span className="text-sm text-slate-900">
                                                {itemDetails.reason}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Footer */}
                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirm}
                                className={`rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${confirmVariant === "approve"
                                        ? "bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500"
                                        : "bg-red-600 hover:bg-red-700 focus:ring-red-500"
                                    }`}
                            >
                                {confirmText}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
