"use client";

import { useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import { processBulkApproval, type ApprovalItem } from "@/app/actions/approval";
import ConfirmationModal from "./ConfirmationModal";
import RejectionModal from "./RejectionModal";

type BulkApprovalButtonsProps = {
    selectedItems: ApprovalItem[];
    onComplete: () => void;
};

export default function BulkApprovalButtons({
    selectedItems,
    onComplete,
}: BulkApprovalButtonsProps) {
    const [isProcessing, setIsProcessing] = useState(false);
    const [showApproveModal, setShowApproveModal] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleBulkApprove = async () => {
        if (isProcessing) return;

        setIsProcessing(true);
        setError(null);

        const items = selectedItems.map((item) => ({
            itemType: item.type,
            itemId: item.id,
        }));

        const result = await processBulkApproval(items, "APPROVE");

        if (result.error) {
            setError(result.error);
            setIsProcessing(false);
            toast.error(result.error);
        } else {
            // Success - show toast and reload
            toast.success(`${selectedItems.length} items berhasil diproses!`);
            onComplete();
            window.location.reload();
        }
    };

    const handleBulkReject = async (reason: string) => {
        setIsProcessing(true);
        setError(null);

        const items = selectedItems.map((item) => ({
            itemType: item.type,
            itemId: item.id,
        }));

        const result = await processBulkApproval(items, "REJECT", reason);

        if (result.error) {
            setError(result.error);
            setIsProcessing(false);
            toast.error(result.error);
        } else {
            // Success - show toast and reload
            toast.success(`${selectedItems.length} items berhasil ditolak`);
            onComplete();
            window.location.reload();
        }
    };

    return (
        <div className="flex items-center gap-2">
            {error && (
                <span className="text-xs text-red-600">{error}</span>
            )}

            <button
                onClick={() => setShowApproveModal(true)}
                disabled={isProcessing}
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1 disabled:opacity-50"
            >
                <CheckCircle className="h-4 w-4" />
                Approve Selected ({selectedItems.length})
            </button>

            <button
                onClick={() => setShowRejectModal(true)}
                disabled={isProcessing}
                className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 disabled:opacity-50"
            >
                <XCircle className="h-4 w-4" />
                Reject Selected
            </button>

            <ConfirmationModal
                isOpen={showApproveModal}
                onClose={() => setShowApproveModal(false)}
                onConfirm={handleBulkApprove}
                title="Approve Multiple Items"
                message={`Apakah Anda yakin ingin menyetujui ${selectedItems.length} item${selectedItems.length > 1 ? "s" : ""} yang dipilih?`}
                confirmText="Ya, Approve Semua"
                confirmVariant="approve"
            />

            {showRejectModal && (
                <RejectionModal
                    productName={`${selectedItems.length} item${selectedItems.length > 1 ? "s" : ""}`}
                    onConfirm={handleBulkReject}
                    onCancel={() => setShowRejectModal(false)}
                />
            )}
        </div>
    );
}
