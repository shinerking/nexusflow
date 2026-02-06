"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

type RejectionModalProps = {
    productName: string;
    onConfirm: (reason: string) => void;
    onCancel: () => void;
};

export default function RejectionModal({
    productName,
    onConfirm,
    onCancel,
}: RejectionModalProps) {
    const [reason, setReason] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!reason.trim()) {
            setError("Rejection reason is required");
            return;
        }

        onConfirm(reason);
    };

    return (
        <AnimatePresence>
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
                    onClick={onCancel}
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
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-slate-900">
                            Reject Item
                        </h2>
                        <button
                            type="button"
                            onClick={onCancel}
                            className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <p className="mb-3 text-sm text-slate-600">
                                You are rejecting: <span className="font-semibold text-slate-900">{productName}</span>
                            </p>

                            <label
                                htmlFor="rejection-reason"
                                className="mb-1 block text-sm font-medium text-slate-700"
                            >
                                Rejection Reason <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                id="rejection-reason"
                                value={reason}
                                onChange={(e) => {
                                    setReason(e.target.value);
                                    setError("");
                                }}
                                rows={4}
                                placeholder="Jelaskan alasan penolakan..."
                                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
                            />
                            {error && (
                                <p className="mt-1 text-xs text-red-600">{error}</p>
                            )}
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                            <button
                                type="button"
                                onClick={onCancel}
                                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
                            >
                                Confirm Rejection
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
