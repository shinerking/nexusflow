import DashboardClient from "@/components/dashboard/DashboardClient";
import { prisma } from "@/lib/prisma";

async function getDashboardData() {
  // Get organization first
  const org = await prisma.organization.findFirst();
  const orgId = org?.id;

  const [revenueResult, pendingCount, lowStockCount, recentActivity, allProducts, categoryData] =
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
      prisma.procurement.findMany({
        where: { organizationId: orgId },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      prisma.product.findMany({
        where: { organizationId: orgId },
        select: { id: true, price: true, stock: true, category: true, name: true },
      }),
      prisma.product.groupBy({
        by: ["category"],
        _sum: { stock: true },
        where: { organizationId: orgId },
      }),
    ]);

  const totalRevenue = Number(revenueResult._sum.totalAmount ?? 0);
  const totalInventoryValue = allProducts.reduce((sum, p) => {
    return sum + (Number(p.price ?? 0) * p.stock);
  }, 0);
  const totalProducts = allProducts.length;
  const chartData = categoryData
    .sort((a, b) => (b._sum.stock ?? 0) - (a._sum.stock ?? 0))
    .map((cat) => ({
      category: cat.category || "No Category",
      stock: cat._sum.stock ?? 0,
    }));

  return {
    totalRevenue,
    pendingRequests: pendingCount,
    lowStockCount,
    totalInventoryValue,
    totalProducts,
    recentActivity: recentActivity.map((activity) => ({
      id: activity.id,
      title: activity.title,
      totalAmount: Number(activity.totalAmount),
      status: activity.status,
      createdAt: activity.createdAt,
    })),
    chartData,
    orgName: org?.name ?? "NexusFlow",
  };
}

export default async function DashboardPage() {
  const data = await getDashboardData();
  return <DashboardClient data={data} />;
}
