"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import * as XLSX from "xlsx";

export type CreateProductState = {
  error?: string;
  success?: boolean;
};

export async function createProduct(
  _prevState: CreateProductState | null,
  formData: FormData
): Promise<CreateProductState> {
  const name = formData.get("name")?.toString().trim();
  const category = formData.get("category")?.toString().trim();
  const priceStr = formData.get("price")?.toString().trim();
  const stockStr = formData.get("stock")?.toString().trim();

  if (!name) {
    return { error: "Name is required" };
  }

  if (!category) {
    return { error: "Category is required" };
  }

  const stock = stockStr ? parseInt(stockStr, 10) : 0;
  if (isNaN(stock) || stock < 0) {
    return { error: "Stock must be a valid number ≥ 0" };
  }

  const price = priceStr ? parseFloat(priceStr) : null;
  if (priceStr && (isNaN(price!) || price! < 0)) {
    return { error: "Price must be a valid number ≥ 0" };
  }

  const org = await prisma.organization.findFirst();
  if (!org) {
    return { error: "No organization found. Please run seed first." };
  }

  try {
    await prisma.product.create({
      data: {
        name,
        category,
        price: price != null ? price : undefined,
        stock,
        organizationId: org.id,
      },
    });

    revalidatePath("/inventory");
    return { success: true };
  } catch (e) {
    console.error("createProduct error:", e);
    return { error: "Failed to create product. Please try again." };
  }
}

export type UpdateProductState = {
  error?: string;
  success?: boolean;
};

export async function updateProduct(
  _prevState: UpdateProductState | null,
  formData: FormData
): Promise<UpdateProductState> {
  const id = formData.get("id")?.toString().trim();
  if (!id) {
    return { error: "Product ID is required" };
  }

  const name = formData.get("name")?.toString().trim();
  const category = formData.get("category")?.toString().trim();
  const priceStr = formData.get("price")?.toString().trim();
  const stockStr = formData.get("stock")?.toString().trim();

  if (!name) {
    return { error: "Name is required" };
  }

  if (!category) {
    return { error: "Category is required" };
  }

  const stock = stockStr ? parseInt(stockStr, 10) : 0;
  if (isNaN(stock) || stock < 0) {
    return { error: "Stock must be a valid number ≥ 0" };
  }

  const price = priceStr ? parseFloat(priceStr) : null;
  if (priceStr && (isNaN(price!) || price! < 0)) {
    return { error: "Price must be a valid number ≥ 0" };
  }

  try {
    await prisma.product.update({
      where: { id },
      data: {
        name,
        category,
        price: price != null ? price : null,
        stock,
      },
    });

    revalidatePath("/inventory");
    return { success: true };
  } catch (e) {
    console.error("updateProduct error:", e);
    return { error: "Failed to update product. Please try again." };
  }
}

export async function deleteProduct(formData: FormData): Promise<void> {
  const id = formData.get("id")?.toString().trim();
  if (!id) return;

  try {
    await prisma.product.delete({
      where: { id },
    });
    revalidatePath("/inventory");
  } catch (e) {
    console.error("deleteProduct error:", e);
    throw new Error("Failed to delete product");
  }
}

export type ImportProductsState = {
  error?: string;
  success?: boolean;
};

// Helper function: case-insensitive column value getter
function getCaseInsensitiveValue(
  row: Record<string, unknown>,
  columnName: string
): unknown {
  const lowerColumnName = columnName.toLowerCase();
  for (const key in row) {
    if (key.toLowerCase() === lowerColumnName) {
      return row[key];
    }
  }
  return undefined;
}

export type DeleteAllProductsState = {
  error?: string;
  success?: boolean;
};

export async function deleteAllProducts(): Promise<DeleteAllProductsState> {
  try {
    // Get organization first
    const org = await prisma.organization.findFirst();
    if (!org) {
      return { error: "No organization found" };
    }

    // Step 1: Delete all procurement data (berurutan karena Foreign Key)
    await prisma.procurement.deleteMany({
      where: { organizationId: org.id },
    });

    // Step 2: Delete all product data
    await prisma.product.deleteMany({
      where: { organizationId: org.id },
    });

    // Step 3: Revalidate all affected paths untuk update real-time
    revalidatePath("/dashboard");
    revalidatePath("/inventory");
    revalidatePath("/procurement");

    return { success: true };
  } catch (e) {
    console.error("deleteAllProducts error:", e);
    const message =
      e instanceof Error ? e.message : "Failed to reset inventory";
    return { error: `Failed to reset inventory: ${message}` };
  }
}

export async function importProducts(
  formData: FormData
): Promise<ImportProductsState> {
  const file = formData.get("file") as File | null;

  if (!file) {
    return { error: "No file provided" };
  }

  try {
    // Read file as buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Parse Excel file
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];

    if (!sheetName) {
      return { error: "Excel file is empty" };
    }

    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    if (jsonData.length === 0) {
      return { error: "No data found in Excel file" };
    }

    // Validate and transform data
    const org = await prisma.organization.findFirst();
    if (!org) {
      return { error: "No organization found. Please run seed first." };
    }

    const productsToCreate = [];

    for (const row of jsonData) {
      const rowData = row as Record<string, unknown>;

      // Use case-insensitive column lookup
      const name = (
        getCaseInsensitiveValue(rowData, "name") as string | undefined
      )?.toString().trim();
      const category = (
        getCaseInsensitiveValue(rowData, "category") as string | undefined
      )?.toString().trim();
      const priceStr = (
        getCaseInsensitiveValue(rowData, "price") as
          | number
          | string
          | undefined
      )?.toString().trim();
      const stockStr = (
        getCaseInsensitiveValue(rowData, "stock") as
          | number
          | string
          | undefined
      )?.toString().trim();

      // Validate required fields
      if (!name || !category) {
        return {
          error:
            "Excel file must have 'name' and 'category' columns (case-insensitive)",
        };
      }

      // Parse price
      const price =
        priceStr && priceStr !== ""
          ? parseFloat(priceStr)
          : null;

      if (priceStr && (isNaN(price!) || price! < 0)) {
        return { error: `Invalid price format: ${priceStr}` };
      }

      // Parse stock
      const stock = stockStr && stockStr !== "" ? parseInt(stockStr, 10) : 0;

      if (isNaN(stock) || stock < 0) {
        return { error: `Invalid stock format: ${stockStr}` };
      }

      productsToCreate.push({
        name,
        category,
        price: price,
        stock,
        organizationId: org.id,
      });
    }

    // Insert all products
    await prisma.product.createMany({
      data: productsToCreate,
      skipDuplicates: true,
    });

    revalidatePath("/inventory");
    return { success: true };
  } catch (e) {
    console.error("importProducts error:", e);
    const message =
      e instanceof Error ? e.message : "Failed to import products";
    return { error: `Import failed: ${message}` };
  }
}
