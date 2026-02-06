import DashboardClient from "@/components/dashboard/DashboardClient";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/app/actions/auth";

async function getDashboardData() {
  // Get organization first
  const org = await prisma.organization.findFirst();
  const orgId = org?.id;

  const [revenueResult, pendingCount, lowStockCount, rawRecentActivity, approvedProducts, pendingProductsCount, pendingStockAdjustments, categoryData] =
    await Promise.all([
      prisma.procurement.aggregate({
        where: { status: "APPROVED" },
        _sum: { totalAmount: true },
      }),
      prisma.procurement.count({
        where: { status: "PENDING", organizationId: orgId }
      }),
      prisma.product.count({
        where: { stock: { lt: 10 }, organizationId: orgId }
      }),
      prisma.stockLog.findMany({
        where: {
          product: { organizationId: orgId }
        },
        include: {
          user: true,
          product: true,
        },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      prisma.product.findMany({
        where: {
          organizationId: orgId,
          status: "APPROVED"
        },
        select: { id: true, price: true, stock: true, category: true, name: true },
      }),
      prisma.product.count({
        where: {
          organizationId: orgId,
          status: "PENDING"
        },
      }),
      prisma.stockLog.count({
        where: {
          product: { organizationId: orgId },
          status: "PENDING"
        },
      }),
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
