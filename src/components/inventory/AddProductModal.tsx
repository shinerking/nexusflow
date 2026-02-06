"use client";

import { useState, useEffect, useActionState } from "react";
import { Plus, X } from "lucide-react";
import { createProduct } from "@/app/actions/product";

export default function AddProductModal() {
  const [open, setOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(createProduct, null);

  useEffect(() => {
    if (state?.success) {
      setOpen(false);
    }
  }, [state?.success]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800"
      >
        <Plus className="h-4 w-4" aria-hidden />
        Add New Product
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
          aria-modal="true"
          role="dialog"
          aria-labelledby="modal-title"
        >
          <div
            className="fixed inset-0 -z-10"
            aria-hidden
            onClick={() => setOpen(false)}
          />
          <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2
                id="modal-title"
                className="text-lg font-semibold text-slate-900"
              >
                Add New Product
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
              {state?.error && (
                <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                  {state.error}
                </div>
              )}

              <div>
                <label
                  htmlFor="product-name"
                  className="mb-1 block text-sm font-medium text-slate-700"
                >
                  Name
                </label>
                <input
                  id="product-name"
                  name="name"
                  type="text"
                  required
                  placeholder="e.g. Laptop Dell XPS 15"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
                  disabled={isPending}
                />
              </div>

              <div>
                <label
                  htmlFor="product-category"
                  className="mb-1 block text-sm font-medium text-slate-700"
                >
                  Category
                </label>
                <input
                  id="product-category"
                  name="category"
                  type="text"
                  required
                  placeholder="e.g. Electronics"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
                  disabled={isPending}
                />
              </div>

              <div>
                <label
                  htmlFor="product-price"
                  className="mb-1 block text-sm font-medium text-slate-700"
                >
                  Price (optional)
                </label>
                <input
                  id="product-price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="e.g. 299.99"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
                  disabled={isPending}
                />
              </div>

              <div>
                <label
                  htmlFor="product-stock"
                  className="mb-1 block text-sm font-medium text-slate-700"
                >
                  Stock
                </label>
                <input
                  id="product-stock"
                  name="stock"
                  type="number"
                  min="0"
                  defaultValue="0"
                  placeholder="0"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
                  disabled={isPending}
                />
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
                  {isPending ? "Adding..." : "Add Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
