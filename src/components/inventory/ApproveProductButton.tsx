"use client";

import { approveProduct, type ApproveProductState } from "@/app/actions/product";
import { Check } from "lucide-react";
import { useActionState, useEffect } from "react";

export default function ApproveProductButton({ productId }: { productId: string }) {
    const [state, formAction, isPending] = useActionState<ApproveProductState, FormData>(
        approveProduct,
        null
    );

    useEffect(() => {
        if (state?.success) {
            // Success feedback - product approved
            console.log(state.message);
        } else if (state?.error) {
            // Error feedback
            console.error(state.error);
        }
    }, [state]);

    return (
        <form action={formAction}>
            <input type="hidden" name="id" value={productId} />
            <button
                type="submit"
                disabled={isPending}
                className="flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
            >
                <Check className="h-4 w-4" />
                {isPending ? "Approving..." : "Approve"}
            </button>
        </form>
    );
}
