
# 🚀 NexusFlow

<div align="center">

![NexusFlow Banner](https://via.placeholder.com/1200x300/0f172a/60a5fa?text=NexusFlow+-+Enterprise+Inventory+System)

**Sistem Manajemen Inventaris Enterprise dengan Internal Control & AI**

[![Next.js](https://img.shields.io/badge/Next.js-14.1.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.10.0-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)

[Demo](#-screenshot) • [Fitur](#-fitur-utama) • [Instalasi](#-instalasi) • [Tech Stack](#-tech-stack)

</div>

---

## 📖 Tentang NexusFlow

**NexusFlow** adalah solusi **Enterprise Resource Planning (ERP)** modern yang dirancang untuk menjaga integritas aset perusahaan. Dibangun dengan filosofi **"Internal Control"**, NexusFlow mentransformasi cara perusahaan mengelola gudang dengan mencegah kecurangan (*fraud*) dan kesalahan manusia (*human error*).

Berbeda dengan aplikasi inventaris biasa, NexusFlow menerapkan **Sistem Maker-Checker**, di mana setiap perubahan data sensitif harus melalui validasi bertingkat sebelum mempengaruhi stok fisik.

### 🎯 Mengapa NexusFlow?

- 🛡️ **Maker-Checker Workflow** - Input dari Staff tidak mengubah stok langsung, melainkan masuk ke antrean persetujuan Manager.
- 🔐 **Role-Based Security (RBAC)** - Pemisahan akses data yang ketat. Staff operasional tidak dapat melihat data finansial sensitif.
- 🤖 **AI-Powered Analytics** - Analisis otomatis menggunakan Google Gemini AI untuk mendeteksi anomali dan rekomendasi stok.
- ⚡ **Real-time Experience** - Notifikasi instan dan pembaruan status tanpa *page reload*.

---

## ✨ Fitur Utama

### 🛡️ Keamanan & Kontrol (Enterprise Grade)
- **Role-Based Access Control:** Hak akses spesifik untuk **Manager** (Full Access), **Staff** (Operational), dan **Auditor** (Read-Only).
- **Approval Queue System:** Mekanisme "Pending Review" untuk setiap penambahan atau pengurangan stok (Adjustment).
- **Audit Trail (Log):** Pencatatan riwayat aktivitas yang permanen dan transparan (Siapa, Kapan, Mengapa).

### ⚡ Produktivitas & UX
- **Real-time Notifications:** Integrasi `Sonner` (Toast) dan Email Alert untuk pemberitahuan instan kepada Manager.
- **Interactive Dashboard:** Visualisasi nilai aset, grafik tren stok, dan peringatan *Low Stock* secara real-time.
- **Custom Modals:** Antarmuka persetujuan modern dengan fitur input alasan penolakan (*Rejection Reason*).
- **Staff History:** Halaman khusus bagi staff untuk memantau status pengajuan mereka dan ringkasan kinerja mingguan.

### 📊 Manajemen Data Cerdas
- **AI Analytics:** Integrasi Google Gemini untuk memberikan insight pengadaan barang.
- **Smart Sorting & Filtering:** Navigasi ribuan data inventaris dengan mudah.
- **Import/Export:** Dukungan penuh untuk Import Excel dan Export Laporan PDF/Excel.

---

## 🛠️ Tech Stack

### Frontend
- **[Next.js 14](https://nextjs.org/)** - App Router & Server Actions
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development
- **[Tailwind CSS](https://tailwindcss.com/)** & **[Shadcn UI](https://ui.shadcn.com/)** - Modern styling
- **[Framer Motion](https://www.framer.com/motion/)** - Smooth animations
- **[Recharts](https://recharts.org/)** - Data visualization

### Backend & Database
- **[Prisma ORM](https://www.prisma.io/)** - Database management
- **[PostgreSQL](https://www.postgresql.org/)** - Primary database (via Supabase)
- **[Resend](https://resend.com/)** - Transactional Email API
- **[Google Gemini API](https://ai.google.dev/)** - Generative AI Service

---

## 📦 Instalasi

### Prasyarat
Pastikan Anda telah menginstall:
- Node.js (v18+)
- Git
- PostgreSQL Database (Local atau Cloud seperti Supabase/Neon)

### Langkah-langkah

#### 1️⃣ Clone Repository
```bash
git clone [https://github.com/shinerking/nexusflow.git](https://github.com/shinerking/nexusflow.git)
cd nexusflow

```

#### 2️⃣ Install Dependencies

```bash
npm install
# atau
yarn install

```

#### 3️⃣ Setup Environment Variables

Buat file `.env` di root project dan isi konfigurasi berikut:

```env
# Database (Supabase/Postgres)
DATABASE_URL="postgresql://user:password@host:5432/postgres?pgbouncer=true"
DIRECT_URL="postgresql://user:password@host:5432/postgres"

# Authentication & Security
NEXTAUTH_SECRET="rahasia_dapur_nexusflow"
NEXTAUTH_URL="http://localhost:3000"

# AI & Services
GEMINI_API_KEY="your_gemini_api_key"
RESEND_API_KEY="your_resend_api_key"

# Email Config
NOTIFICATION_EMAIL="admin@nexusflow.com"

```

#### 4️⃣ Setup Database

```bash
# Generate Prisma Client
npx prisma generate

# Push schema ke database
npx prisma migrate dev

# (Opsional) Isi data dummy untuk testing
npx prisma db seed

```

#### 5️⃣ Jalankan Server

```bash
npm run dev

```

Buka browser dan akses [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) 🎉

---

## 👥 Akun Demo (Seeding)

Gunakan kredensial ini untuk mencoba berbagai fitur berdasarkan role:

| Role | Email | Password | Fitur yang Bisa Diakses |
| --- | --- | --- | --- |
| **👑 Manager** | `manager@nexusflow.com` | `password123` | Full Access, Approvals, Analytics, User Mgmt. |
| **👷 Staff** | `staff@nexusflow.com` | `password123` | Request Stock, History, No Financial Data. |
| **🔍 Auditor** | `auditor@nexusflow.com` | `password123` | Read-Only Logs & Reports. |

---

## 📸 Galeri Tampilan (Screenshots)

Berikut adalah tampilan antarmuka NexusFlow yang dirancang dengan mode gelap (*Dark Mode*) untuk kenyamanan visual dan nuansa profesional.

### 1. Manager Dashboard (Executive View)
Pusat kendali utama bagi Manager. Menampilkan data krusial seperti **Total Asset Value**, **Revenue**, dan grafik tren stok.
![Manager Dashboard](./docs/manager-dashboard.png)
> *Dashboard Manager memiliki akses penuh ke data finansial dan statistik global.*

### 2. Approval Workflow (Maker-Checker System)
Fitur unggulan NexusFlow. Setiap perubahan stok yang dilakukan Staff masuk ke antrean ini. Manager dapat melihat detail, menyetujui, atau menolak dengan **Alasan Penolakan** (*Rejection Reason*).
![Approval Modal](./docs/approval-modal.png)
> *Modal konfirmasi kustom dengan fitur input alasan penolakan untuk audit trail.*

### 3. Staff View (Restricted Access)
Tampilan khusus Staff Gudang. Perhatikan bahwa kartu **Revenue** dan **Total Value** disembunyikan secara otomatis demi keamanan data perusahaan (*Role-Based Access Control*).
![Staff Dashboard](./docs/staff-view.png)
> *Antarmuka Staff yang bersih, fokus pada operasional tanpa akses ke data sensitif.*

### 4. Staff History & Weekly Summary
Halaman transparansi bagi Staff untuk memantau status pengajuan mereka (Approved/Rejected) serta melihat ringkasan kinerja mingguan mereka.
![Staff History](./docs/staff-history.png)
> *Staff dapat belajar dari kesalahan melalui catatan penolakan yang tertera di history.*

---

---

## 📁 Struktur Project

```
nexusflow/
├── prisma/
│   └── schema.prisma      # Database Schema & Models
├── src/
│   ├── app/
│   │   ├── actions/       # Server Actions (Backend Logic)
│   │   ├── api/           # API Routes
│   │   ├── (dashboard)/   # Protected Routes
│   │   └── layout.tsx     # Root Layout
│   ├── components/
│   │   ├── ui/            # Shadcn UI Components
│   │   ├── dashboard/     # Charts & Stats Cards
│   │   └── modals/        # Approval/Reject Modals
│   └── lib/
│       ├── db.ts          # Prisma Client Singleton
│       └── gemini.ts      # AI Configuration
└── public/                # Static Assets

```

---

## 🤝 Kontribusi

Kontribusi selalu diterima! Jika Anda ingin berkontribusi:

1. Fork repository ini
2. Buat branch baru (`git checkout -b feature/FiturBaru`)
3. Commit perubahan (`git commit -m 'Add fitur baru'`)
4. Push ke branch (`git push origin feature/FiturBaru`)
5. Buat Pull Request

---

## 👨‍💻 Developer

Dibuat dengan ❤️ oleh **Abimanyu R Putra**

* 🌐 Website: [shinerking.github.io](https://shinerking.github.io/)
* 📧 Email: abimanyuriantoputra@gmail.com
* 💼 LinkedIn: [Abimanyu Rianto Putra](https://www.linkedin.com/in/abimanyu-rianto-putra-277966318)
* 🐙 GitHub: [@shinerking](https://github.com/shinerking/)

---

<div align="center">

**⭐ Jangan lupa beri star pada repository ini jika bermanfaat! ⭐**

Made by NexusFlow Team

</div>

```

```
