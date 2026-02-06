import AppLayout from "@/components/layout/AppLayout";
import InventoryTable from "@/components/inventory/InventoryTable";
import AddProductModal from "@/components/inventory/AddProductModal";
import ExportButton from "@/components/inventory/ExportButton";
import ImportModal from "@/components/inventory/ImportModal";
import { prisma } from "@/lib/prisma";

async function getProducts() {
  return prisma.product.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      category: true,
      price: true,
      stock: true,
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
  }));
}

export default async function InventoryPage() {
  const [products, org] = await Promise.all([
    getProducts(),
    prisma.organization.findFirst(),
  ]);
  const serialized = serializeProducts(products);

  return (
    <AppLayout orgName={org?.name ?? "NexusFlow"}>
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
            <AddProductModal />
            <ExportButton products={serialized} />
            <ImportModal />
          </div>
        </div>

        <InventoryTable products={serialized} />
      </div>
    </AppLayout>
  );
}
