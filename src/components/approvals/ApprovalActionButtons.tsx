"use client";

import { useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import { processApproval } from "@/app/actions/approval";
import ConfirmationModal from "./ConfirmationModal";
import RejectionModal from "./RejectionModal";

type ApprovalActionButtonsProps = {
    itemId: string;
    itemType: "PRODUCT" | "STOCK_ADJUSTMENT";
    productName: string;
};

export default function ApprovalActionButtons({
    itemId,
    itemType,
    productName,
}: ApprovalActionButtonsProps) {
    const [isProcessing, setIsProcessing] = useState(false);
    const [showApproveModal, setShowApproveModal] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleApprove = async () => {
        if (isProcessing) return;

        setIsProcessing(true);
        setError(null);

        const result = await processApproval(itemType, itemId, "APPROVE");

        if (result.error) {
            setError(result.error);
            setIsProcessing(false);
            toast.error(result.error);
        } else {
            // Success - show toast and reload
            toast.success(`Status produk ${productName} berhasil diperbarui!`);
            window.location.reload();
        }
    };

    const handleReject = async (reason: string) => {
        setIsProcessing(true);
        setError(null);

        const result = await processApproval(itemType, itemId, "REJECT", reason);

        if (result.error) {
            setError(result.error);
            setIsProcessing(false);
            toast.error(result.error);
        } else {
            // Success - show toast and reload
            toast.success(`Pengajuan ${productName} berhasil ditolak`);
            window.location.reload();
        }
    };

    return (
        <div className="flex items-center justify-end gap-2">
            {error && (
                <span className="text-xs text-red-600">{error}</span>
            )}

            <button
                onClick={() => setShowApproveModal(true)}
                disabled={isProcessing}
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1 disabled:opacity-50"
            >
                <CheckCircle className="h-4 w-4" />
                Approve
            </button>

            <button
                onClick={() => setShowRejectModal(true)}
                disabled={isProcessing}
                className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 disabled:opacity-50"
            >
                <XCircle className="h-4 w-4" />
                Reject
            </button>

            <ConfirmationModal
                isOpen={showApproveModal}
                onClose={() => setShowApproveModal(false)}
                onConfirm={handleApprove}
                title="Konfirmasi Persetujuan"
                message={`Apakah Anda yakin ingin menyetujui ${itemType === "PRODUCT" ? "produk" : "penyesuaian stok"} ini?`}
                confirmText="Ya, Approve"
                confirmVariant="approve"
                itemDetails={{
                    productName: productName,
                }}
            />

            {showRejectModal && (
                <RejectionModal
                    productName={productName}
                    onConfirm={handleReject}
                    onCancel={() => setShowRejectModal(false)}
                />
            )}
        </div>
    );
}
