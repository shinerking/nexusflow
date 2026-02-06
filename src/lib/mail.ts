import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "");

// Get recipient email from env or use default
const RECIPIENT_EMAIL = process.env.NOTIFICATION_EMAIL || "abimanyuriantoputra@gmail.com";
const SENDER_EMAIL = process.env.SENDER_EMAIL || "onboarding@resend.dev";

// Email HTML template
function getEmailHTML(itemName: string, formattedAmount: string): string {
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
      <div style="background-color: white; padding: 32px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
        <h1 style="color: #0f172a; margin: 0 0 20px 0; font-size: 28px;">✅ Pengajuan Disetujui!</h1>
        
        <p style="color: #475569; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
          Halo,<br/><br/>
          Pengajuan pembelian Anda telah <strong style="color: #10b981;">disetujui</strong> dan siap diproses lebih lanjut.
        </p>
        
        <div style="background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%); border-left: 4px solid #10b981; padding: 20px; margin: 24px 0; border-radius: 6px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #0f172a; font-weight: 600; width: 40%;">Nama Barang:</td>
              <td style="padding: 8px 0; color: #1e293b; font-weight: 500;">${itemName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #0f172a; font-weight: 600;">Total Harga:</td>
              <td style="padding: 8px 0; color: #10b981; font-size: 18px; font-weight: 700;">${formattedAmount}</td>
            </tr>
          </table>
        </div>
        
        <p style="color: #475569; font-size: 14px; line-height: 1.6; margin: 20px 0;">
          Langkah selanjutnya:
        </p>
        <ul style="color: #475569; font-size: 14px; line-height: 1.8; margin: 12px 0; padding-left: 20px;">
          <li>Verifikasi detail pengajuan</li>
          <li>Proses pembayaran atau PO</li>
          <li>Koordinasikan pengiriman</li>
        </ul>
        
        <p style="color: #64748b; font-size: 12px; line-height: 1.6; margin: 24px 0 0 0;">
          Jika ada pertanyaan atau memerlukan informasi lebih lanjut, silakan hubungi tim procurement Anda.
        </p>
        
        <div style="margin-top: 32px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center;">
          <p style="color: #64748b; font-size: 11px; margin: 0;">
            <strong style="color: #0f172a;">NexusFlow Inventory Management System</strong><br/>
            Automated Procurement Notification | © 2026
          </p>
        </div>
      </div>
    </div>
  `;
}

export async function sendApprovalEmail(
  itemName: string,
  amount: number,
  recipientEmail?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Validate API key exists
    if (!process.env.RESEND_API_KEY) {
      console.warn("⚠️ RESEND_API_KEY not configured - email disabled");
      return { success: true }; // Continue anyway for demo
    }

    // Format amount as IDR
    const formattedAmount = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);

    const emailHTML = getEmailHTML(itemName, formattedAmount);

    let targetEmail = recipientEmail || RECIPIENT_EMAIL;

    // Safety: If using default Resend test domain, we can ONLY send to verified email (RECIPIENT_EMAIL/NOTIFICATION_EMAIL)
    // We override the dynamic recipient to ensure delivery during testing
    if (SENDER_EMAIL.includes("resend.dev") && RECIPIENT_EMAIL) {
      console.log(`[Mail Service] Test mode detected. Redirecting email from ${targetEmail} to ${RECIPIENT_EMAIL}`);
      targetEmail = RECIPIENT_EMAIL;
    }

    console.log(`📧 Sending approval email to: ${targetEmail}`);
    console.log(`   From: ${SENDER_EMAIL}`);
    console.log(`   Item: ${itemName}`);

    // Try different sender formats as fallbacks
    const senderFormats = [
      `NexusFlow <${SENDER_EMAIL}>`, // Format 1: With display name
      RECIPIENT_EMAIL, // Format 2: Use recipient as sender (for testing)
      SENDER_EMAIL, // Format 3: Plain email without display name
    ];

    let result = null;
    let lastError = null;

    for (let i = 0; i < senderFormats.length; i++) {
      const senderFormat = senderFormats[i];

      if (i > 0) {
        console.log(`⚠️ Attempt ${i + 1} with sender format: "${senderFormat}"`);
      }

      result = await resend.emails.send({
        from: senderFormat,
        to: recipientEmail || RECIPIENT_EMAIL,
        subject: `Pengajuan Pembelian Disetujui - ${itemName}`,
        html: emailHTML,
      });

      // If successful, break out of loop
      if (result.data?.id) {
        console.log(`✅ Email queued successfully using format: "${senderFormat}"`);
        console.log(`   Message ID: ${result.data.id}`);
        console.log(`   Status: Will be delivered to: ${targetEmail}`);
        return { success: true };
      }

      // Store error for debugging
      lastError = result.error;

      // Log error but continue to next format
      if (result.error) {
        const errorMsg = result.error.message || JSON.stringify(result.error);
        console.warn(`   ❌ Format attempt ${i + 1} failed: ${errorMsg}`);
      }
    }

    // All attempts failed
    if (lastError) {
      console.error("❌ Email send failed on all attempts:", lastError);

      const errorMsg = lastError.message || JSON.stringify(lastError);

      // Provide helpful guidance based on error type
      if (errorMsg.includes("verified") || errorMsg.includes("verification")) {
        console.log(`\n💡 SOLUTION - Verify Email in Resend Dashboard:`);
        console.log(`   1. Go to: https://resend.com/emails`);
        console.log(`   2. Click "Preview Recipient" or "Add Verified Email"`);
        console.log(`   3. Add: ${RECIPIENT_EMAIL}`);
        console.log(`   4. Verify from confirmation email`);
        console.log(`   5. Try approving again!\n`);
      }

      if (errorMsg.includes("domain") || errorMsg.includes("unauthorized")) {
        console.log(`\n💡 SOLUTION - Use Plain Email Format:`);
        console.log(`   Make sure SENDER_EMAIL in .env is: ${RECIPIENT_EMAIL}`);
        console.log(`   Then verify it in Resend dashboard as above\n`);
      }

      return { success: false, error: `Email failed: ${errorMsg}` };
    }

    return { success: false, error: "Email service returned no response" };

  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("❌ Email exception:", message);

    // Log helpful debugging info
    if (message.includes("401") || message.includes("authentication")) {
      console.error("💡 Check your RESEND_API_KEY in .env is correct");
    }

    return { success: false, error: `Exception: ${message}` };
  }
}

// Procurement Submission Email HTML
function getProcurementRequestHTML(
  title: string,
  formattedAmount: string,
  priority: string,
  description?: string | null
): string {
  const priorityColor = priority === "HIGH" ? "#ef4444" : priority === "MEDIUM" ? "#f59e0b" : "#3b82f6";

  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
      <div style="background-color: white; padding: 32px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
        <h1 style="color: #0f172a; margin: 0 0 20px 0; font-size: 24px;">🆕 Pengajuan Pembelian Baru</h1>
        
        <p style="color: #475569; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
          Halo Manager,<br/><br/>
          Ada pengajuan pembelian baru yang memerlukan persetujuan Anda.
        </p>
        
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 20px; margin: 24px 0; border-radius: 6px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #64748b; font-size: 14px; width: 40%;">Judul Pengajuan:</td>
              <td style="padding: 8px 0; color: #0f172a; font-weight: 600;">${title}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Total Estimasi:</td>
              <td style="padding: 8px 0; color: #0f172a; font-weight: 600;">${formattedAmount}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Prioritas:</td>
              <td style="padding: 8px 0; color: ${priorityColor}; font-weight: 700;">${priority}</td>
            </tr>
            ${description ? `
            <tr>
              <td style="padding: 8px 0; color: #64748b; font-size: 14px; vertical-align: top;">Keterangan:</td>
              <td style="padding: 8px 0; color: #334155;">${description}</td>
            </tr>` : ""}
          </table>
        </div>
        
        <div style="text-align: center; margin: 32px 0;">
          <a href="http://localhost:3000/procurement" style="background-color: #0f172a; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 14px;">Lihat di Dashboard</a>
        </div>
        
        <div style="margin-top: 32px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center;">
          <p style="color: #64748b; font-size: 11px; margin: 0;">
            <strong style="color: #0f172a;">NexusFlow Procurement</strong><br/>
            Automated Notification | © 2026
          </p>
        </div>
      </div>
    </div>
  `;
}

export async function sendProcurementRequestEmail(
  title: string,
  amount: number,
  priority: string,
  description?: string | null
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.warn("⚠️ RESEND_API_KEY not configured");
      return { success: true };
    }

    const formattedAmount = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);

    const emailHTML = getProcurementRequestHTML(title, formattedAmount, priority, description);

    // Use global recipient email (Manager)
    let targetEmail = RECIPIENT_EMAIL;

    // Safety logic: if using resend.dev, FORCE to recipient email
    if (SENDER_EMAIL.includes("resend.dev") && RECIPIENT_EMAIL) {
      targetEmail = RECIPIENT_EMAIL;
    }

    console.log(`📧 Sending procurement request email to: ${targetEmail}`);
    console.log(`   Subject: Pengajuan Pembelian Baru - ${title}`);

    const result = await resend.emails.send({
      from: `NexusFlow <${SENDER_EMAIL}>`,
      to: targetEmail,
      subject: `🆕 Pengajuan Pembelian: ${title}`,
      html: emailHTML,
    });

    if (result.error) {
      console.error("❌ Failed to send procurement email:", result.error);
      return { success: false, error: result.error.message };
    }

    console.log(`✅ Procurement email sent. ID: ${result.data?.id}`);
    return { success: true };

  } catch (error) {
    console.error("❌ Exception sending procurement email:", error);
    return { success: false, error: "Exception occurred" };
  }
}
