"use client";

import { useActionState } from "react";
import { Check } from "lucide-react";
import { approveStockAdjustment, type ApproveStockAdjustmentState } from "@/app/actions/stock";

type ApproveStockButtonProps = {
    stockLogId: string;
    productName: string;
    quantity: number;
};

export default function ApproveStockButton({
    stockLogId,
    productName,
    quantity,
}: ApproveStockButtonProps) {
    const [state, formAction, isPending] = useActionState<ApproveStockAdjustmentState | null, FormData>(
        approveStockAdjustment,
        null
    );

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        const confirmed = confirm(
            `Approve pengurangan stok untuk "${productName}" sebanyak ${quantity} unit?\n\nStok akan langsung berkurang setelah di-approve.`
        );
        if (!confirmed) {
            e.preventDefault();
        }
    };

    return (
        <form action={formAction} onSubmit={handleSubmit}>
            <input type="hidden" name="stockLogId" value={stockLogId} />
            <button
                type="submit"
                disabled={isPending}
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1 disabled:opacity-50"
                title="Approve adjustment"
            >
                <Check className="h-4 w-4" />
                {isPending ? "Processing..." : "Approve"}
            </button>
            {state?.error && (
                <p className="mt-1 text-xs text-red-600">{state.error}</p>
            )}
        </form>
    );
}
