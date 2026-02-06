import AppLayout from "@/components/layout/AppLayout";
import NewRequestModal from "@/components/procurement/NewRequestModal";
import ProcurementActions from "@/components/procurement/ProcurementActions";
import RoleGuard from "@/components/auth/RoleGuard";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/app/actions/auth";

async function getProcurements() {
  return prisma.procurement.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      status: true,
      totalAmount: true,
      aiAnalysis: true,
    },
  });
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function PriorityBadge({ priority }: { priority?: string | null }) {
  const p = priority?.toUpperCase();
  const styles =
    p === "HIGH"
      ? "bg-red-100 text-red-700"
      : p === "MEDIUM"
        ? "bg-amber-100 text-amber-700"
        : "bg-emerald-100 text-emerald-700";
  const label = p === "HIGH" ? "High" : p === "MEDIUM" ? "Medium" : "Low";

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${styles}`}
    >
      {label}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles =
    status === "APPROVED"
      ? "bg-emerald-100 text-emerald-700"
      : status === "REJECTED"
        ? "bg-red-100 text-red-700"
        : "bg-amber-100 text-amber-700";

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${styles}`}
    >
      {status}
    </span>
  );
}

export default async function ProcurementPage() {
  const [procurements, org, currentUser] = await Promise.all([
    getProcurements(),
    prisma.organization.findFirst(),
    getCurrentUser(),
  ]);

  return (
    <AppLayout orgName={org?.name ?? "NexusFlow"} currentUser={currentUser}>
      <div className="flex-1 p-4 sm:p-6">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">
              Procurement
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Smart procurement requests with AI assistance
            </p>
          </div>
          <RoleGuard userRole={currentUser?.role} action="CREATE_PROCUREMENT">
            <NewRequestModal />
          </RoleGuard>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80">
                <th className="px-4 py-3 font-medium text-slate-600 sm:px-6">Title</th>
                <th className="px-4 py-3 font-medium text-slate-600 sm:px-6">Status</th>
                <th className="px-4 py-3 font-medium text-slate-600 sm:px-6">
                  Total Amount
                </th>
                <th className="px-4 py-3 font-medium text-slate-600 sm:px-6">
                  Priority
                </th>
                <th className="px-4 py-3 font-medium text-slate-600 sm:px-6">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {procurements.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-8 text-center text-slate-500 sm:px-6"
                  >
                    No procurement requests yet.
                  </td>
                </tr>
              ) : (
                procurements.map((row) => {
                  const ai = row.aiAnalysis as { priority?: string } | null;
                  const priority = ai?.priority ?? null;

                  return (
                    <tr
                      key={row.id}
                      className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50"
                    >
                      <td className="px-4 py-3 font-medium text-slate-900 sm:px-6">
                        {row.title}
                      </td>
                      <td className="px-4 py-3 sm:px-6">
                        <StatusBadge status={row.status} />
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-900 sm:px-6">
                        {formatCurrency(Number(row.totalAmount))}
                      </td>
                      <td className="px-4 py-3 sm:px-6">
                        <PriorityBadge priority={priority} />
                      </td>
                      <td className="px-4 py-3 sm:px-6">
                        <RoleGuard userRole={currentUser?.role} action="APPROVE_PROCUREMENT">
                          <ProcurementActions id={row.id} status={row.status} />
                        </RoleGuard>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
