"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { analyzeRequest } from "@/lib/gemini";
import { sendApprovalEmail, sendProcurementRequestEmail } from "@/lib/mail";

export type ProcurementAnalysis = {
  name: string;
  category: string;
  estimatedPrice: number;
  priority: "LOW" | "MEDIUM" | "HIGH";
  reason: string;
};

export async function generateProcurementData(
  description: string
): Promise<{ data: ProcurementAnalysis | null; error?: string }> {
  if (!description?.trim()) {
    return { data: null, error: "Description is required" };
  }

  try {
    const data = await analyzeRequest(description.trim());
    return { data };
  } catch (e) {
    console.error("generateProcurementData error:", e);
    return {
      data: null,
      error: e instanceof Error ? e.message : "Failed to analyze request",
    };
  }
}

export type CreateProcurementState = {
  error?: string;
  success?: boolean;
};

export async function createProcurement(
  _prevState: CreateProcurementState | null,
  formData: FormData
): Promise<CreateProcurementState> {
  const title = formData.get("title")?.toString().trim();
  const category = formData.get("category")?.toString().trim();
  const priceStr = formData.get("totalAmount")?.toString().trim();
  const priority = formData.get("priority")?.toString().trim();
  const description = formData.get("description")?.toString().trim();

  if (!title) {
    return { error: "Title is required" };
  }

  const totalAmount = priceStr ? parseFloat(priceStr) : 0;
  if (isNaN(totalAmount) || totalAmount < 0) {
    return { error: "Total amount must be a valid number ≥ 0" };
  }

  const org = await prisma.organization.findFirst();
  if (!org) {
    return { error: "No organization found. Please run seed first." };
  }

  const validPriority = ["LOW", "MEDIUM", "HIGH"].includes(priority || "")
    ? (priority as string)
    : "MEDIUM";

  try {
    await prisma.procurement.create({
      data: {
        title,
        description: description || undefined,
        totalAmount,
        status: "PENDING",
        organizationId: org.id,
        aiAnalysis: {
          priority: validPriority,
          category: category || undefined,
        },
      },
    });

    // Send email notification for new request
    console.log(`📬 Triggering new procurement email for: ${title}`);
    sendProcurementRequestEmail(
      title,
      totalAmount,
      validPriority,
      description
    ).catch(err => console.error("Failed to send procurement email:", err));

    revalidatePath("/procurement");
    return { success: true };
  } catch (e) {
    console.error("createProcurement error:", e);
    return { error: "Failed to create procurement request." };
  }
}

export async function updateProcurementStatus(
  id: string,
  status: "APPROVED" | "REJECTED"
): Promise<{ error?: string }> {
  if (!id?.trim()) {
    return { error: "ID is required" };
  }
  if (!["APPROVED", "REJECTED"].includes(status)) {
    return { error: "Invalid status" };
  }

  try {
    // Get procurement data before updating
    const procurement = await prisma.procurement.findUnique({
      where: { id },
    });

    if (!procurement) {
      return { error: "Procurement not found" };
    }

    // Update status
    await prisma.procurement.update({
      where: { id },
      data: { status },
    });

    // Send email if approved
    if (status === "APPROVED") {
      console.log(`📬 Attempting to send approval email for: ${procurement.title}`);
      const emailResult = await sendApprovalEmail(
        procurement.title,
        Number(procurement.totalAmount)
      );

      if (!emailResult.success) {
        console.warn(`⚠️ Email notification failed: ${emailResult.error}`);
        // Continue anyway - status update is more important
      } else {
        console.log(`✅ Approval email sent successfully for procurement ID: ${id}`);
      }
    }

    revalidatePath("/procurement");
    return {};
  } catch (e) {
    console.error("updateProcurementStatus error:", e);
    return { error: "Failed to update status." };
  }
}
