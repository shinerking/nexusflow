import { NextResponse } from "next/server";
import { getCurrentUser } from "@/app/actions/auth";
import { getPendingApprovals } from "@/app/actions/approval";

export async function GET() {
    try {
        const currentUser = await getCurrentUser();

        // Only MANAGER/ADMIN can see count
        if (!currentUser || !["MANAGER", "ADMIN"].includes(currentUser.role)) {
            return NextResponse.json({ count: 0 });
        }

        const data = await getPendingApprovals();

        return NextResponse.json({ count: data.totalCount });
    } catch (e) {
        console.error("Approval count API error:", e);
        return NextResponse.json({ count: 0 });
    }
}
