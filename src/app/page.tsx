import DashboardClient from "@/components/dashboard/DashboardClient";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/app/actions/auth";

async function getDashboardData() {
  // Get organization first
  const org = await prisma.organization.findFirst({
    select: { id: true, name: true }
  });
  const orgId = org?.id;

  if (!orgId) {
    return {
      totalRevenue: 0,
      pendingRequests: 0,
      lowStockCount: 0,
      totalInventoryValue: 0,
      totalProducts: 0,
      pendingProductsCount: 0,
      recentActivity: [],
      chartData: [],
      orgName: "NexusFlow",
    };
  }

  const [
    revenueResult,
    pendingCount,
    lowStockCount,
    rawRecentActivity,
    approvedProducts,
    pendingProductsCount,
    pendingStockAdjustments,
    categoryData
  ] = await Promise.all([
    // 1. Total Revenue
    prisma.procurement.aggregate({
      where: { status: "APPROVED", organizationId: orgId },
      _sum: { totalAmount: true },
    }),
    // 2. Pending Requests
    prisma.procurement.count({
      where: { status: "PENDING", organizationId: orgId }
    }),
    // 3. Low Stock Items
    prisma.product.count({
      where: { stock: { lt: 10 }, organizationId: orgId, status: "APPROVED" }
    }),
    // 4. Recent Activity (Simplified)
    prisma.stockLog.findMany({
      where: {
        product: { organizationId: orgId }
      },
      select: {
        id: true,
        type: true,
        quantity: true,
        status: true,
        createdAt: true,
        user: { select: { name: true } },
        product: { select: { name: true, price: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    // 5. Approved Products (Simplified)
    prisma.product.findMany({
      where: {
        organizationId: orgId,
        status: "APPROVED"
      },
      select: { id: true, price: true, stock: true },
    }),
    // 6. Pending Products
    prisma.product.count({
      where: {
        organizationId: orgId,
        status: "PENDING"
      },
    }),
    // 7. Pending Stock Adjustments
    prisma.stockLog.count({
      where: {
        product: { organizationId: orgId },
        status: "PENDING"
      },
    }),
    // 8. Category Data
    prisma.product.groupBy({
      by: ["category"],
      _sum: { stock: true },
      where: {
        organizationId: orgId,
        status: "APPROVED"
      },
    }),
  ]);

  const totalRevenue = Number(revenueResult._sum.totalAmount ?? 0);
  const totalInventoryValue = approvedProducts.reduce((sum, p) => {
    return sum + (Number(p.price ?? 0) * p.stock);
  }, 0);
  const totalProducts = approvedProducts.length;

  const chartData = categoryData
    .sort((a, b) => (b._sum?.stock ?? 0) - (a._sum?.stock ?? 0))
    .map((cat) => ({
      category: cat.category || "No Category",
      stock: cat._sum?.stock ?? 0,
    }));

  const recentActivity = rawRecentActivity.map((log) => ({
    ...log,
    product: {
      ...log.product,
      price: Number(log.product.price)
    }
  }));

  return {
    totalRevenue,
    pendingRequests: pendingCount,
    lowStockCount,
    totalInventoryValue,
    totalProducts,
    pendingProductsCount: pendingProductsCount + pendingStockAdjustments,
    recentActivity,
    chartData,
    orgName: org?.name ?? "NexusFlow",
  };
}

export default async function DashboardPage() {
  const data = await getDashboardData();
  const currentUser = await getCurrentUser();

  return <DashboardClient data={data} currentUser={currentUser} />;
}
