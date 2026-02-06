import AppLayout from "@/components/layout/AppLayout";
import InventoryTable from "@/components/inventory/InventoryTable";
import StockLogsTable from "@/components/inventory/StockLogsTable";
import AddProductModal from "@/components/inventory/AddProductModal";
import ExportButton from "@/components/inventory/ExportButton";
import ImportModal from "@/components/inventory/ImportModal";
import RoleGuard from "@/components/auth/RoleGuard";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/app/actions/auth";
import { getStockLogs } from "@/app/actions/stock";

async function getProducts() {
  return prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      category: true,
      price: true,
      stock: true,
      status: true,
    },
  });
}

function serializeProducts(products: Awaited<ReturnType<typeof getProducts>>) {
  return products.map((p) => ({
    id: p.id,
    name: p.name,
    category: p.category,
    price: p.price != null ? Number(p.price) : null,
    stock: p.stock,
    status: p.status,
  }));
}

export default async function InventoryPage() {
  const [products, org, currentUser, stockLogs] = await Promise.all([
    getProducts(),
    prisma.organization.findFirst(),
    getCurrentUser(),
    getStockLogs(),
  ]);
  const serialized = serializeProducts(products);

  return (
    <AppLayout orgName={org?.name ?? "NexusFlow"} currentUser={currentUser}>
      <div className="flex-1 p-4 sm:p-6">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">
              Inventory Management
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Manage your product stock and availability
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <RoleGuard userRole={currentUser?.role} action="ADD_PRODUCT">
              <AddProductModal />
            </RoleGuard>
            <ExportButton products={serialized} currentUser={currentUser} />
            <RoleGuard userRole={currentUser?.role} action="IMPORT_PRODUCTS">
              <ImportModal />
            </RoleGuard>
          </div>
        </div>

        <InventoryTable products={serialized} currentUser={currentUser} />

        {/* Stock Adjustment History */}
        <RoleGuard userRole={currentUser?.role} action="VIEW_STOCK_LOGS">
          <div className="mt-8">
            <StockLogsTable stockLogs={stockLogs} currentUser={currentUser} />
          </div>
        </RoleGuard>
      </div>
    </AppLayout>
  );
}
