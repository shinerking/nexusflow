"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import EditProductModal from "./EditProductModal";
import DeleteProductButton from "./DeleteProductButton";

type Product = {
  id: string;
  name: string;
  category: string;
  price: number | null;
  stock: number;
};

function formatCurrency(value: number | null): string {
  if (value == null) return "—";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function StockBadge({ stock }: { stock: number }) {
  const isLow = stock < 10;
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
        isLow ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"
      }`}
    >
      {isLow ? "Low Stock" : "In Stock"}
    </span>
  );
}

export default function InventoryTable({
  products: initialProducts,
}: {
  products: Product[];
}) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return initialProducts;
    const q = searchQuery.toLowerCase().trim();
    return initialProducts.filter((p) => p.name.toLowerCase().includes(q));
  }, [initialProducts, searchQuery]);

  return (
    <div className="space-y-4">
      <div className="relative max-w-sm">
        <Search
          className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
          aria-hidden
        />
        <input
          type="search"
          placeholder="Search products by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-4 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
          aria-label="Search products"
        />
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80">
              <th className="px-6 py-3 font-medium text-slate-600">Name</th>
              <th className="px-6 py-3 font-medium text-slate-600">Category</th>
              <th className="px-6 py-3 font-medium text-slate-600">Price</th>
              <th className="px-6 py-3 font-medium text-slate-600">Stock</th>
              <th className="px-6 py-3 font-medium text-slate-600">Status</th>
              <th className="px-6 py-3 font-medium text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-8 text-center text-slate-500"
                >
                  {searchQuery.trim()
                    ? "No products match your search."
                    : "No products yet."}
                </td>
              </tr>
            ) : (
              filteredProducts.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50"
                >
                  <td className="px-6 py-3 font-medium text-slate-900">
                    {product.name}
                  </td>
                  <td className="px-6 py-3 text-slate-600">{product.category}</td>
                  <td className="px-6 py-3 font-medium text-slate-900">
                    {formatCurrency(product.price)}
                  </td>
                  <td className="px-6 py-3 font-medium text-slate-900">
                    {product.stock}
                  </td>
                  <td className="px-6 py-3">
                    <StockBadge stock={product.stock} />
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-1">
                      <EditProductModal product={product} />
                      <DeleteProductButton product={product} />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
