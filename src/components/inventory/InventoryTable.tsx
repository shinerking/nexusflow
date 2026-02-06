"use client";

import { useState, useMemo } from "react";
import { Search, Check, Clock, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import EditProductModal from "./EditProductModal";
import DeleteProductButton from "./DeleteProductButton";
import ApproveProductButton from "./ApproveProductButton";
import StockAdjustmentModal from "./StockAdjustmentModal";
import RoleGuard from "@/components/auth/RoleGuard";
import { type UserWithRole } from "@/app/actions/auth";

type Product = {
  id: string;
  name: string;
  category: string;
  price: number | null;
  stock: number;
  status: string;
};

type SortColumn = "name" | "category" | "price" | "stock" | "status";
type SortDirection = "asc" | "desc";

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
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${isLow ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"
        }`}
    >
      {isLow ? "Low Stock" : "In Stock"}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  if (status === "APPROVED") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
        <Check className="h-3 w-3" />
        Approved
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700">
      <Clock className="h-3 w-3" />
      Pending Review
    </span>
  );
}

export default function InventoryTable({
  products: initialProducts,
  currentUser,
}: {
  products: Product[];
  currentUser?: UserWithRole | null;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortColumn, setSortColumn] = useState<SortColumn | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      // Toggle direction
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // New column, default to ascending
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (column: SortColumn) => {
    if (sortColumn !== column) {
      return <ArrowUpDown className="h-4 w-4 text-slate-400" />;
    }
    return sortDirection === "asc" ? (
      <ArrowUp className="h-4 w-4 text-slate-600" />
    ) : (
      <ArrowDown className="h-4 w-4 text-slate-600" />
    );
  };

  const sortedAndFilteredProducts = useMemo(() => {
    // First filter by search
    let result = initialProducts;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((p) => p.name.toLowerCase().includes(q));
    }

    // Then sort
    if (sortColumn) {
      result = [...result].sort((a, b) => {
        let comparison = 0;

        switch (sortColumn) {
          case "name":
          case "category":
            comparison = a[sortColumn].localeCompare(b[sortColumn]);
            break;
          case "price":
            const priceA = a.price ?? 0;
            const priceB = b.price ?? 0;
            comparison = priceA - priceB;
            break;
          case "stock":
            comparison = a.stock - b.stock;
            break;
          case "status":
            // Priority: PENDING > APPROVED
            const statusOrder = { PENDING: 0, APPROVED: 1 };
            comparison =
              statusOrder[a.status as keyof typeof statusOrder] -
              statusOrder[b.status as keyof typeof statusOrder];
            break;
        }

        return sortDirection === "asc" ? comparison : -comparison;
      });
    }

    return result;
  }, [initialProducts, searchQuery, sortColumn, sortDirection]);

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
              <th
                className="cursor-pointer select-none px-6 py-3 font-medium text-slate-600 transition-colors hover:bg-slate-100"
                onClick={() => handleSort("name")}
              >
                <div className="flex items-center gap-2">
                  Name
                  {getSortIcon("name")}
                </div>
              </th>
              <th
                className="cursor-pointer select-none px-6 py-3 font-medium text-slate-600 transition-colors hover:bg-slate-100"
                onClick={() => handleSort("category")}
              >
                <div className="flex items-center gap-2">
                  Category
                  {getSortIcon("category")}
                </div>
              </th>
              <th
                className="cursor-pointer select-none px-6 py-3 font-medium text-slate-600 transition-colors hover:bg-slate-100"
                onClick={() => handleSort("price")}
              >
                <div className="flex items-center gap-2">
                  Price
                  {getSortIcon("price")}
                </div>
              </th>
              <th
                className="cursor-pointer select-none px-6 py-3 font-medium text-slate-600 transition-colors hover:bg-slate-100"
                onClick={() => handleSort("stock")}
              >
                <div className="flex items-center gap-2">
                  Stock
                  {getSortIcon("stock")}
                </div>
              </th>
              <th
                className="cursor-pointer select-none px-6 py-3 font-medium text-slate-600 transition-colors hover:bg-slate-100"
                onClick={() => handleSort("status")}
              >
                <div className="flex items-center gap-2">
                  Status
                  {getSortIcon("status")}
                </div>
              </th>
              <th className="px-6 py-3 font-medium text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedAndFilteredProducts.length === 0 ? (
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
              sortedAndFilteredProducts.map((product) => (
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
                  <td className="px-6 py-3">
                    <span
                      className={`font-semibold ${product.stock < 5 ? "text-red-600" : "text-slate-900"
                        }`}
                    >
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <StatusBadge status={product.status} />
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-2">
                      {/* Approve button - only for MANAGER on PENDING products */}
                      {product.status === "PENDING" && (
                        <RoleGuard userRole={currentUser?.role} action="APPROVE_PRODUCT">
                          <ApproveProductButton productId={product.id} />
                        </RoleGuard>
                      )}

                      {/* Adjust Stock button - STAFF, MANAGER, ADMIN */}
                      <RoleGuard userRole={currentUser?.role} action="ADJUST_STOCK">
                        <StockAdjustmentModal product={product} />
                      </RoleGuard>

                      {/* Edit button - STAFF and MANAGER */}
                      <RoleGuard userRole={currentUser?.role} action="EDIT_PRODUCT">
                        <EditProductModal product={product} />
                      </RoleGuard>

                      {/* Delete button - MANAGER only */}
                      <RoleGuard userRole={currentUser?.role} action="DELETE_PRODUCT">
                        <DeleteProductButton product={product} />
                      </RoleGuard>
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
