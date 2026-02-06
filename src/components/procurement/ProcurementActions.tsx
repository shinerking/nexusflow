"use client";

import { Check, X } from "lucide-react";
import { updateProcurementStatus } from "@/app/actions/procurement";
import { useTransition } from "react";

type Props = {
  id: string;
  status: string;
};

export default function ProcurementActions({ id, status }: Props) {
  const [isPending, startTransition] = useTransition();

  if (status !== "PENDING") {
    return <span className="text-xs text-slate-400">—</span>;
  }

  function handleApprove() {
    startTransition(async () => {
      await updateProcurementStatus(id, "APPROVED");
    });
  }

  function handleReject() {
    startTransition(async () => {
      await updateProcurementStatus(id, "REJECTED");
    });
  }

  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={handleApprove}
        disabled={isPending}
        className="inline-flex items-center justify-center rounded-lg p-2 text-emerald-600 hover:bg-emerald-50 disabled:opacity-70"
        aria-label="Approve"
      >
        <Check className="h-4 w-4" aria-hidden />
      </button>
      <button
        type="button"
        onClick={handleReject}
        disabled={isPending}
        className="inline-flex items-center justify-center rounded-lg p-2 text-red-600 hover:bg-red-50 disabled:opacity-70"
        aria-label="Reject"
      >
        <X className="h-4 w-4" aria-hidden />
      </button>
    </div>
  );
}
