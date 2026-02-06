import AppLayout from "@/components/layout/AppLayout";
import WeeklyStatsCards from "@/components/history/WeeklyStatsCards";
import HistoryTable from "@/components/history/HistoryTable";
import ExportHistoryButton from "@/components/history/ExportHistoryButton";
import { getStaffHistory } from "@/app/actions/history";
import { getCurrentUser } from "@/app/actions/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function HistoryPage() {
    const currentUser = await getCurrentUser();

    // Redirect if not logged in or not STAFF
    if (!currentUser) {
        redirect("/login");
    }

    if (currentUser.role !== "STAFF") {
        redirect("/");
    }

    const [historyData, org] = await Promise.all([
        getStaffHistory(),
        prisma.organization.findFirst(),
    ]);

    return (
        <AppLayout orgName={org?.name ?? "NexusFlow"} currentUser={currentUser}>
            <div className="flex-1 p-4 sm:p-6">
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">
                            My History
                        </h1>
                        <p className="mt-1 text-sm text-slate-500">
                            Track your submissions and weekly performance
                        </p>
                    </div>
                    <ExportHistoryButton
                        items={historyData.items}
                        weeklyStats={historyData.weeklyStats}
                        userName={currentUser.name}
                    />
                </div>

                {/* Weekly Performance Stats */}
                <WeeklyStatsCards
                    totalRestocked={historyData.weeklyStats.totalRestocked}
                    approvalRate={historyData.weeklyStats.approvalRate}
                    pendingTasks={historyData.weeklyStats.pendingTasks}
                />

                {/* History Table */}
                <HistoryTable items={historyData.items} />
            </div>
        </AppLayout>
    );
}
