"use client";

import { Trash2 } from "lucide-react";
import { deleteProduct } from "@/app/actions/product";

type Product = {
  id: string;
  name: string;
};

export default function DeleteProductButton({ product }: { product: Product }) {
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    if (!confirm("Are you sure you want to delete this product?")) {
      e.preventDefault();
    }
  }

  return (
    <form action={deleteProduct} onSubmit={handleSubmit}>
      <input type="hidden" name="id" value={product.id} />
      <button
        type="submit"
        className="inline-flex items-center justify-center rounded-lg p-2 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
        aria-label={`Delete ${product.name}`}
      >
        <Trash2 className="h-4 w-4" aria-hidden />
      </button>
    </form>
  );
}
