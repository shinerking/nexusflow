import { redirect } from "next/navigation";
import { getCurrentUser } from "@/app/actions/auth";
import { getPendingApprovals } from "@/app/actions/approval";
import { prisma } from "@/lib/prisma";
import AppLayout from "@/components/layout/AppLayout";
import ApprovalTable from "@/components/approvals/ApprovalTable";

export default async function ApprovalsPage() {
    const [currentUser, org] = await Promise.all([
        getCurrentUser(),
        prisma.organization.findFirst(),
    ]);

    // Restrict access to MANAGER and ADMIN only
    if (!currentUser || !["MANAGER", "ADMIN"].includes(currentUser.role)) {
        redirect("/");
    }

    const approvalsData = await getPendingApprovals();

    return (
        <AppLayout orgName={org?.name ?? "NexusFlow"} currentUser={currentUser}>
            <div className="flex-1 p-4 sm:p-6">
                <div className="mb-6">
                    <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">
                        Approval Queue
                    </h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Verifikasi semua transaksi pending
                    </p>
                </div>

                <ApprovalTable items={approvalsData.items} currentUser={currentUser} />
            </div>
        </AppLayout>
    );
}
