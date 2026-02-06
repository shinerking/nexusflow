"use client";

import { useState, useEffect, useActionState } from "react";
import { Plus, X, Loader2, Sparkles } from "lucide-react";
import { createProcurement, generateProcurementData } from "@/app/actions/procurement";
import type { ProcurementAnalysis } from "@/app/actions/procurement";

export default function NewRequestModal() {
  const [open, setOpen] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [formValues, setFormValues] = useState({
    title: "",
    category: "",
    totalAmount: "",
    priority: "MEDIUM" as "LOW" | "MEDIUM" | "HIGH",
    description: "",
  });
  const [state, formAction, isPending] = useActionState(createProcurement, null);

  useEffect(() => {
    if (state?.success) {
      setOpen(false);
      setFormValues({
        title: "",
        category: "",
        totalAmount: "",
        priority: "MEDIUM",
        description: "",
      });
      setAiError(null);
    }
  }, [state?.success]);

  async function handleAutoFill() {
    const desc = formValues.description.trim();
    if (!desc) {
      setAiError("Please describe your request first");
      return;
    }

    setAiLoading(true);
    setAiError(null);

    try {
      const result = await generateProcurementData(desc);
      if (result.error) {
        setAiError(result.error);
        return;
      }
      if (result.data) {
        const d = result.data as ProcurementAnalysis;
        setFormValues((prev) => ({
          ...prev,
          title: d.name,
          category: d.category,
          totalAmount: String(d.estimatedPrice),
          priority: d.priority,
        }));
      }
    } finally {
      setAiLoading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800"
      >
        <Plus className="h-4 w-4" aria-hidden />
        New Request
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
          aria-modal="true"
          role="dialog"
          aria-labelledby="new-request-modal-title"
        >
          <div
            className="fixed inset-0 -z-10"
            aria-hidden
            onClick={() => setOpen(false)}
          />
          <div className="w-full max-w-lg rounded-xl border border-slate-200 bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2
                id="new-request-modal-title"
                className="text-lg font-semibold text-slate-900"
              >
                New Procurement Request
              </h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>

            <form action={formAction} className="space-y-4">
              <div>
                <label
                  htmlFor="description"
                  className="mb-1 block text-sm font-medium text-slate-700"
                >
                  Jelaskan kebutuhan Anda
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  value={formValues.description}
                  onChange={(e) =>
                    setFormValues((p) => ({ ...p, description: e.target.value }))
                  }
                  placeholder="e.g. Saya butuh 5 unit laptop untuk tim baru, budget sekitar 50 juta..."
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
                  disabled={isPending}
                />
                <button
                  type="button"
                  onClick={handleAutoFill}
                  disabled={aiLoading || isPending}
                  className="mt-2 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-70"
                >
                  {aiLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" aria-hidden />
                      Auto-Generate
                    </>
                  )}
                </button>
                {aiError && (
                  <p className="mt-1 text-sm text-red-600">{aiError}</p>
                )}
              </div>

              {state?.error && (
                <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                  {state.error}
                </div>
              )}

              <div>
                <label
                  htmlFor="title"
                  className="mb-1 block text-sm font-medium text-slate-700"
                >
                  Name
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  required
                  value={formValues.title}
                  onChange={(e) =>
                    setFormValues((p) => ({ ...p, title: e.target.value }))
                  }
                  placeholder="e.g. Laptops for New Team"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
                  disabled={isPending}
                />
              </div>

              <div>
                <label
                  htmlFor="category"
                  className="mb-1 block text-sm font-medium text-slate-700"
                >
                  Category
                </label>
                <input
                  id="category"
                  name="category"
                  type="text"
                  value={formValues.category}
                  onChange={(e) =>
                    setFormValues((p) => ({ ...p, category: e.target.value }))
                  }
                  placeholder="e.g. Electronics"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
                  disabled={isPending}
                />
              </div>

              <div>
                <label
                  htmlFor="totalAmount"
                  className="mb-1 block text-sm font-medium text-slate-700"
                >
                  Price
                </label>
                <input
                  id="totalAmount"
                  name="totalAmount"
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={formValues.totalAmount}
                  onChange={(e) =>
                    setFormValues((p) => ({ ...p, totalAmount: e.target.value }))
                  }
                  placeholder="e.g. 50000000"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
                  disabled={isPending}
                />
              </div>

              <div>
                <label
                  htmlFor="priority"
                  className="mb-1 block text-sm font-medium text-slate-700"
                >
                  Priority
                </label>
                <select
                  id="priority"
                  name="priority"
                  value={formValues.priority}
                  onChange={(e) =>
                    setFormValues((p) => ({
                      ...p,
                      priority: e.target.value as "LOW" | "MEDIUM" | "HIGH",
                    }))
                  }
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
                  disabled={isPending}
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  disabled={isPending}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-70"
                >
                  {isPending ? "Submitting..." : "Submit Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
