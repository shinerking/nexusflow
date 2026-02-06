import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function main() {
  console.log("Seeding NexusFlow database...\n");

  // 1. Organization: Demo Corp
  const org = await prisma.organization.upsert({
    where: { slug: "demo-corp" },
    update: {},
    create: {
      name: "Demo Corp",
      slug: "demo-corp",
    },
  });
  console.log("[OK] Organization created:", org.name);

  // 2. Create 3 demo users with different roles
  const adminUser = await prisma.user.upsert({
    where: {
      email_organizationId: {
        email: "admin@nexusflow.com",
        organizationId: org.id,
      },
    },
    update: {},
    create: {
      name: "Admin Manager",
      email: "admin@nexusflow.com",
      role: "MANAGER",
      organizationId: org.id,
    },
  });
  console.log("[OK] User created:", adminUser.name, `(${adminUser.email}) - Role: ${adminUser.role}`);

  const staffUser = await prisma.user.upsert({
    where: {
      email_organizationId: {
        email: "staff@nexusflow.com",
        organizationId: org.id,
      },
    },
    update: {},
    create: {
      name: "Staff User",
      email: "staff@nexusflow.com",
      role: "STAFF",
      organizationId: org.id,
    },
  });
  console.log("[OK] User created:", staffUser.name, `(${staffUser.email}) - Role: ${staffUser.role}`);

  const auditorUser = await prisma.user.upsert({
    where: {
      email_organizationId: {
        email: "auditor@nexusflow.com",
        organizationId: org.id,
      },
    },
    update: {},
    create: {
      name: "Auditor User",
      email: "auditor@nexusflow.com",
      role: "AUDITOR",
      organizationId: org.id,
    },
  });
  console.log("[OK] User created:", auditorUser.name, `(${auditorUser.email}) - Role: ${auditorUser.role}`);

  // Clear existing products and procurements for Demo Corp (for re-seeding)
  await prisma.procurement.deleteMany({ where: { organizationId: org.id } });
  await prisma.product.deleteMany({ where: { organizationId: org.id } });

  // 3. 20 sample Products
  const productData = [
    { name: "Laptop Dell XPS 15", category: "Electronics", price: 1299 },
    { name: "Wireless Mouse Logitech MX", category: "Peripherals", price: 99 },
    { name: "27\" LED Monitor Samsung", category: "Electronics", price: 349 },
    { name: "Mechanical Keyboard RGB", category: "Peripherals", price: 149 },
    { name: "Webcam HD 1080p", category: "Electronics", price: 79 },
    { name: "Bluetooth Headphones", category: "Audio", price: 199 },
    { name: "USB-C Hub 7-in-1", category: "Accessories", price: 45 },
    { name: "SSD 1TB NVMe", category: "Storage", price: 129 },
    { name: "RAM DDR5 32GB Kit", category: "Components", price: 189 },
    { name: "HDMI Cable 2m", category: "Cables", price: 15 },
    { name: "Standing Desk Adjustable", category: "Office", price: 599 },
    { name: "Ergonomic Office Chair", category: "Office", price: 449 },
    { name: "Desk Lamp LED", category: "Office", price: 49 },
    { name: "Wireless Printer HP", category: "Electronics", price: 179 },
    { name: "Document Scanner A4", category: "Electronics", price: 129 },
    { name: "Portable Projector", category: "Electronics", price: 399 },
    { name: "Tablet 10 inch", category: "Electronics", price: 329 },
    { name: "Smartphone Holder", category: "Accessories", price: 25 },
    { name: "Laptop Charger 65W", category: "Accessories", price: 49 },
    { name: "Monitor Arm Mount", category: "Office", price: 89 },
  ];

  const products = await Promise.all(
    productData.map((p) =>
      prisma.product.create({
        data: {
          name: p.name,
          category: p.category,
          price: p.price,
          stock: randomInt(5, 150),
          status: "APPROVED", // All seed products are pre-approved
          organizationId: org.id,
        },
      })
    )
  );
  console.log(`[OK] ${products.length} Products created`);

  // 4. 5 Procurement Requests (PENDING / APPROVED)
  const procurementData = [
    {
      title: "Q1 Office Supplies",
      description: "Bulk order for office stationery and supplies",
      status: "APPROVED" as const,
      totalAmount: 2450.75,
    },
    {
      title: "New Laptops for Sales Team",
      description: "5 units Dell Latitude for new hires",
      status: "PENDING" as const,
      totalAmount: 8750.0,
    },
    {
      title: "Monitor Upgrade Batch",
      description: "10x 27\" monitors for development team",
      status: "APPROVED" as const,
      totalAmount: 4200.0,
    },
    {
      title: "Conference Room Equipment",
      description: "Projector, speakers, and cables",
      status: "PENDING" as const,
      totalAmount: 1899.5,
    },
    {
      title: "Ergonomic Chairs - Office Refresh",
      description: "Replacement chairs for main office area",
      status: "APPROVED" as const,
      totalAmount: 5600.0,
    },
  ];

  const procurements = await Promise.all(
    procurementData.map((p) =>
      prisma.procurement.create({
        data: {
          title: p.title,
          description: p.description,
          status: p.status,
          totalAmount: p.totalAmount,
          organizationId: org.id,
          aiAnalysis: p.status === "APPROVED" ? { recommended: true, score: 0.92 } : null as any,
        },
      })
    )
  );
  console.log(`[OK] ${procurements.length} Procurement requests created`);

  console.log("\nSeeding completed successfully.");
}

main()
  .catch((e) => {
    console.error("Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
