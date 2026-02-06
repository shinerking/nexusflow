# Email Notifications - Setup & Troubleshooting

## Status Saat Ini

Email notifications menggunakan **Resend API** untuk mengirim approval emails.

## Error: "You can only send testing emails to your own email address"

### Penyebab
Resend API berada dalam **testing/trial mode** yang memiliki batasan:
- ❌ Hanya bisa mengirim ke email yang terdaftar di akun Resend
- ❌ Dari address harus dari domain yang verified atau format khusus
- ✅ Dalam production, perlu verified domain

### Solusi

#### **Opsi 1: Update Resend API Key (Recommended)**
1. Go to https://resend.com/api-keys
2. Create atau dapatkan API key yang active
3. Pastikan account sudah email verified
4. Update `RESEND_API_KEY` di `.env`

#### **Opsi 2: Setup Verified Domain (Production)**
1. Go to https://resend.com/domains
2. Add custom domain Anda
3. Update DNS records sesuai instruksi
4. After verified, gunakan email dari domain tersebut:
   ```dotenv
   SENDER_EMAIL=noreply@yourdomain.com
   NOTIFICATION_EMAIL=admin@yourdomain.com
   ```

#### **Opsi 3: Use Testing Email Format (Temporary)**
Ganti `SENDER_EMAIL` di `.env` ke format testing Resend:
```dotenv
SENDER_EMAIL=admin@nexusflow.com
NOTIFICATION_EMAIL=admin@nexusflow.com
```

#### **Opsi 4: Invite Preview Recipient (Trial Mode)**
1. Go ke https://resend.com/account
2. Tab "Preview Recipients"
3. Add email yang ingin menerima testing emails
4. Update `NOTIFICATION_EMAIL` di `.env`

## Configuration Variables

### `.env` Variables

```dotenv
# Email Notifications
RESEND_API_KEY=your_api_key_here

# Notification recipients dan sender
NOTIFICATION_EMAIL=admin@nexusflow.com     # Penerima email notifikasi
SENDER_EMAIL=onboarding@resend.dev         # Email pengirim
```

## Testing Email Notifications

1. **Jalankan aplikasi**
   ```bash
   npm run dev
   ```

2. **Buat Procurement Request** di `/procurement`
   - Klik "Create New Request"
   - Isi form dan submit

3. **Approve Procurement**
   - Lihat list procurement requests
   - Klik "Approve" pada salah satu request

4. **Check Server Logs**
   - Terminal akan menampilkan:
     ```
     📧 Sending approval email to: admin@nexusflow.com
     ✅ Email queued successfully!
     ```

5. **Check Email**
   - Email akan dikirim ke `NOTIFICATION_EMAIL` address
   - Subject: `Pengajuan Pembelian Disetujui - [Item Name]`
   - Format: Professional HTML dengan details procurement

## Debug Tips

### Jika Email Tidak Terkirim
1. **Check API Key**
   ```bash
   # Lihat di .env
   echo $RESEND_API_KEY
   ```

2. **Check Server Logs**
   - Cari `📧 Sending approval email`
   - Cari `✅ Email` atau `❌ Email` messages

3. **Verify Email Address**
   - Pastikan `NOTIFICATION_EMAIL` tidak typo
   - Pastikan email sudah verified di Resend account

4. **Check Resend Dashboard**
   - Go to https://resend.com/emails
   - Lihat status pengiriman email
   - Check error logs

### Error Message Meanings

| Error | Arti | Solusi |
|-------|------|--------|
| `401 Unauthorized` | API Key invalid | Regenerate API key di resend.com |
| `validation_error: domain` | Domain not verified | Setup verified domain di Resend |
| `No route to host` | Network issue | Check internet connection |
| `timeout` | API slow response | Retry atau contact Resend support |

## Logging Output

### ✅ Success
```
📧 Sending approval email to: admin@nexusflow.com
   From: onboarding@resend.dev
   Item: Laptop Gaming
✅ Email queued successfully!
   Message ID: re_xxx...
   Status: Will be delivered to: admin@nexusflow.com
```

### ❌ Error - Domain Not Verified
```
❌ Email send failed: {...validation_error...}
💡 Tip: For production, verify a domain at resend.com/domains
   Testing mode: Can also use NOTIFICATION_EMAIL env var
```

### ❌ Error - Invalid API Key
```
❌ Email exception: 401: Unauthorized
💡 Check your RESEND_API_KEY in .env
```

## Production Setup

Ketika siap untuk production:

1. **Setup Custom Domain**
   ```bash
   # 1. Go resend.com/domains
   # 2. Add domain (example: nexusflow.com)
   # 3. Update DNS records
   # 4. Verify domain
   ```

2. **Update Configuration**
   ```dotenv
   SENDER_EMAIL=noreply@nexusflow.com
   NOTIFICATION_EMAIL=admin@nexusflow.com
   ```

3. **Test Again**
   - Create & approve new procurement
   - Verify email diterima dengan baik

## Useful Links

- 📖 Resend Docs: https://resend.com/docs
- 🔑 API Keys: https://resend.com/api-keys
- 🌐 Domain Setup: https://resend.com/domains
- 📧 Email Log: https://resend.com/emails
- 💬 Support: https://resend.com/support

## Email Template Details

Email notification mencakup:
- ✅ Item name
- ✅ Total harga (format Rupiah)
- ✅ Professional HTML design
- ✅ Call-to-action steps
- ✅ NexusFlow branding

Email dikirim ke: **Configured NOTIFICATION_EMAIL**
Dari: **Configured SENDER_EMAIL**
Subject: `Pengajuan Pembelian Disetujui - [Item Name]`
