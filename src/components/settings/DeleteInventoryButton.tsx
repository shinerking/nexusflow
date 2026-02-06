"use client";

import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { deleteAllProducts } from "@/app/actions/product";

export default function DeleteInventoryButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete ALL inventory items? This action cannot be undone."
    );

    if (!confirmed) {
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const result = await deleteAllProducts();

      if (result.error) {
        setError(result.error);
      } else if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
        }, 3000);
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "An error occurred";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-6">
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-red-900">Danger Zone</h3>
        <p className="mt-1 text-sm text-red-700">
          This action will permanently delete all inventory items.
        </p>
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-4 rounded-lg bg-red-100 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Success message */}
      {success && (
        <div className="mb-4 flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          All inventory items have been deleted successfully.
        </div>
      )}

      {/* Delete button */}
      <button
        onClick={handleDelete}
        disabled={isLoading}
        className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
        {!isLoading && <Trash2 className="h-4 w-4" />}
        Clear All Inventory
      </button>
    </div>
  );
}
