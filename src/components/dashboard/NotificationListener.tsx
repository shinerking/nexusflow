"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { checkNewPendingStockLogs } from "@/app/actions/notifications";
import { useRouter } from "next/navigation";

export default function NotificationListener() {
    const lastCheckRef = useRef<Date>(new Date());
    const router = useRouter();

    useEffect(() => {
        // Poll every 30 seconds
        const interval = setInterval(async () => {
            try {
                const now = new Date();
                const newLogs = await checkNewPendingStockLogs(lastCheckRef.current);

                if (newLogs && newLogs.length > 0) {
                    newLogs.forEach((log) => {
                        // Play sound
                        const audio = new Audio("/sounds/ping.mp3"); // Assuming file exists or fails silently
                        audio.play().catch(() => { });

                        toast(`🔔 Persetujuan Baru`, {
                            description: `${log.user?.name || "Staff"} telah mengajukan penyesuaian stok untuk ${log.product.name}.`,
                            action: {
                                label: "Lihat",
                                onClick: () => router.push("/approvals"),
                            },
                            duration: 5000,
                        });
                    });

                    // Update last check time
                    lastCheckRef.current = now;
                }
            } catch (error) {
                console.error("Failed to check notifications", error);
            }
        }, 10000); // Check every 10 seconds for "real-time" feel

        return () => clearInterval(interval);
    }, [router]);

    return null;
}
