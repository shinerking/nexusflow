# 🚀 NexusFlow

<div align="center">

![NexusFlow Banner](https://via.placeholder.com/1200x300/0f172a/60a5fa?text=NexusFlow+-+Enterprise+Inventory+System)

**Sistem Manajemen Inventaris Enterprise dengan Internal Control & AI**

[![Next.js](https://img.shields.io/badge/Next.js-14.1.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.10.0-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

[Demo](#-screenshot) • [Fitur](#-fitur-utama) • [Instalasi](#-instalasi) • [Tech Stack](#-tech-stack)

</div>

---

## 📖 Tentang NexusFlow

**NexusFlow** bukan sekadar aplikasi pencatatan stok biasa. Ini adalah solusi **Enterprise Resource Planning (ERP)** modern yang dirancang untuk menjaga integritas aset perusahaan. Dibangun dengan filosofi **"Internal Control"**, NexusFlow menerapkan alur kerja yang ketat untuk mencegah kecurangan (*fraud*) dan kesalahan input (*human error*) di gudang.

### 🎯 Mengapa NexusFlow Berbeda?

- 🛡️ **Maker-Checker Workflow** - Setiap perubahan stok oleh Staff wajib melalui persetujuan Manager.
- 🔐 **Role-Based Security** - Data finansial sensitif hanya bisa dilihat oleh level manajemen.
- ⚡ **Real-time Approval** - Notifikasi instan tanpa refresh untuk mempercepat pengambilan keputusan.
- 🤖 **AI-Powered Analytics** - Analisis otomatis terhadap pola stok dan peringatan dini.

---

## ✨ Fitur Utama

### 🛡️ Keamanan & Kontrol (Enterprise Grade)
- **Role-Based Access Control (RBAC):** Pemisahan hak akses yang ketat antara **Manager**, **Staff**, dan **Auditor**.
- **Approval Queue:** Input Staff masuk ke antrean "Pending Review" dan tidak mengubah stok fisik sebelum disetujui.
- **Audit Trail (Log):** Riwayat aktivitas permanen yang mencatat Siapa, Kapan, dan Mengapa stok berubah.

### ⚡ Produktivitas & UX
- **Real-time Notifications:** Manager menerima notifikasi Toast & Email instan saat ada request baru.
- **Interactive Dashboard:** Visualisasi nilai aset, grafik distribusi kategori, dan indikator *Low Stock*.
- **Custom Modals:** Antarmuka persetujuan modern dengan input alasan penolakan (Rejection Reason).
- **History & Performance:** Halaman khusus Staff untuk memantau status pengajuan dan ringkasan kinerja mingguan.

### 🧠 Analisis Cerdas (Google Gemini AI)
- Deteksi anomali pada pergerakan stok yang mencurigakan.
- Rekomendasi *Restock* cerdas berdasarkan tren pemakaian historis.

### 📁 Manajemen Data
- **Bulk Import/Export:** Dukungan penuh untuk file Excel (.xlsx) dan PDF Reporting.
- **Smart Sorting & Filtering:** Navigasi ribuan data barang dengan mudah.

---

## 🛠️ Tech Stack

### Frontend
- **[Next.js 14](https://nextjs.org/)** - App Router & Server Actions
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development
- **[Tailwind CSS](https://tailwindcss.com/)** & **[Shadcn UI](https://ui.shadcn.com/)** - Modern styling
- **[Framer Motion](https://www.framer.com/motion/)** - Smooth animations
- **[Sonner](https://sonner.emilkowal.ski/)** - High-performance toast notifications

### Backend & Database
- **[Prisma ORM](https://www.prisma.io/)** - Database management
- **[PostgreSQL](https://www.postgresql.org/)** - Primary database (via Supabase/Neon)
- **[Resend](https://resend.com/)** - Transactional Email API

### AI Integration
- **[Google Gemini API](https://ai.google.dev/)** - Generative AI for analytics

---

## 📦 Instalasi Lokal

Ikuti langkah ini untuk menjalankan project di komputer Anda:

### 1️⃣ Clone Repository
```bash
git clone [https://github.com/shinerking/nexusflow.git](https://github.com/shinerking/nexusflow.git)
cd nexusflow
