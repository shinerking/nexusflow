import { Resend } from "resend";
import { type ApprovalNotificationProps, ApprovalNotification } from "./email-templates/approval-notification";

const resend = new Resend(process.env.RESEND_API_KEY);

// Use the verified sender email from env or default to onboarding@resend.dev for testing
const SENDER_EMAIL = process.env.SENDER_EMAIL || "onboarding@resend.dev";
// In development/test mode without domain, we can only send to the verified email
const FORCED_RECIPIENT = process.env.NOTIFICATION_EMAIL;

export async function sendApprovalNotification({
    to,
    ...props
}: ApprovalNotificationProps & { to: string[] }) {
    if (!process.env.RESEND_API_KEY) {
        console.warn("RESEND_API_KEY is not set. Skipping email notification.");
        return { success: false, error: "Missing API key" };
    }

    // Determine recipients
    // If we are in 'onboarding' mode or don't have a custom domain, 
    // Resend only allows sending to the verified email.
    // For production with verified domain, we would use the 'to' array.

    // Logic: If FORCED_RECIPIENT is set (e.g. valid during testing), use it.
    // Otherwise use the real recipients.
    // In a real production app, you'd check process.env.NODE_ENV

    let recipients = to;

    // Checking if we are using the default test sender which definitely restricts recipients
    if (SENDER_EMAIL.includes("resend.dev") && FORCED_RECIPIENT) {
        console.log(`[Email Service] Test mode detected. Redirecting email to ${FORCED_RECIPIENT}`);
        recipients = [FORCED_RECIPIENT];
    }

    try {
        const data = await resend.emails.send({
            from: `NexusFlow <${SENDER_EMAIL}>`,
            to: recipients,
            subject: `🔔 Perlu Persetujuan: Stok ${props.type === "IN" ? "Masuk" : "Keluar"} - ${props.productName}`,
            react: <ApprovalNotification {...props} />,
        });

        return { success: true, data };
    } catch (error) {
        console.error("Failed to send email:", error);
        return { success: false, error };
    }
}
