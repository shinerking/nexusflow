"use client";

import { useState, useEffect, useActionState } from "react";
import { Pencil, X } from "lucide-react";
import { updateProduct } from "@/app/actions/product";

type Product = {
  id: string;
  name: string;
  category: string;
  price: number | null;
  stock: number;
};

export default function EditProductModal({ product }: { product: Product }) {
  const [open, setOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(updateProduct, null);

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
        className="inline-flex items-center justify-center rounded-lg p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
        aria-label={`Edit ${product.name}`}
      >
        <Pencil className="h-4 w-4" aria-hidden />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
          aria-modal="true"
          role="dialog"
          aria-labelledby="edit-modal-title"
        >
          <div
            className="fixed inset-0 -z-10"
            aria-hidden
            onClick={() => setOpen(false)}
          />
          <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2
                id="edit-modal-title"
                className="text-lg font-semibold text-slate-900"
              >
                Edit Product
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
              <input type="hidden" name="id" value={product.id} />

              {state?.error && (
                <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                  {state.error}
                </div>
              )}

              <div>
                <label
                  htmlFor={`edit-name-${product.id}`}
                  className="mb-1 block text-sm font-medium text-slate-700"
                >
                  Name
                </label>
                <input
                  id={`edit-name-${product.id}`}
                  name="name"
                  type="text"
                  required
                  defaultValue={product.name}
                  placeholder="e.g. Laptop Dell XPS 15"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
                  disabled={isPending}
                />
              </div>

              <div>
                <label
                  htmlFor={`edit-category-${product.id}`}
                  className="mb-1 block text-sm font-medium text-slate-700"
                >
                  Category
                </label>
                <input
                  id={`edit-category-${product.id}`}
                  name="category"
                  type="text"
                  required
                  defaultValue={product.category}
                  placeholder="e.g. Electronics"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
                  disabled={isPending}
                />
              </div>

              <div>
                <label
                  htmlFor={`edit-price-${product.id}`}
                  className="mb-1 block text-sm font-medium text-slate-700"
                >
                  Price (optional)
                </label>
                <input
                  id={`edit-price-${product.id}`}
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  defaultValue={product.price ?? ""}
                  placeholder="e.g. 299.99"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
                  disabled={isPending}
                />
              </div>

              <div>
                <label
                  htmlFor={`edit-stock-${product.id}`}
                  className="mb-1 block text-sm font-medium text-slate-700"
                >
                  Stock
                </label>
                <input
                  id={`edit-stock-${product.id}`}
                  name="stock"
                  type="number"
                  min="0"
                  defaultValue={product.stock}
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
                  {isPending ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
