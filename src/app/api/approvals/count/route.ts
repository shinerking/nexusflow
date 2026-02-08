import { NextResponse } from "next/server";
import { getPendingApprovalsCount } from "@/app/actions/approval";

export async function GET() {
    try {
        const count = await getPendingApprovalsCount();
        return NextResponse.json({ count });
    } catch (e) {
        console.error("Approval count API error:", e);
        return NextResponse.json({ count: 0 });
    }
}
