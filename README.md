# 🚀 NexusFlow

<div align="center">

![NexusFlow Banner](https://via.placeholder.com/1200x300/0f172a/60a5fa?text=NexusFlow+-+Sistem+Manajemen+Inventaris+Cerdas)

**Sistem Manajemen Inventaris Cerdas berbasis AI**

[![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.22.0-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

[Demo](#-screenshot) • [Fitur](#-fitur-utama) • [Instalasi](#-instalasi) • [Tech Stack](#-tech-stack)

</div>

---

## 📖 Tentang NexusFlow

**NexusFlow** adalah sistem manajemen inventaris modern yang memanfaatkan kekuatan **Artificial Intelligence** untuk memberikan insight mendalam terhadap data procurement Anda. Dengan antarmuka yang intuitif dan fitur-fitur canggih, NexusFlow membantu bisnis Anda membuat keputusan yang lebih cerdas dan efisien.

### 🎯 Mengapa NexusFlow?

- 🤖 **AI-Powered Analytics** - Analisis procurement otomatis menggunakan Google Gemini AI
- ⚡ **Real-time Dashboard** - Pantau inventaris dan procurement secara real-time
- 📧 **Smart Notifications** - Notifikasi email otomatis untuk aktivitas penting
- 📊 **Data Management** - Import/Export data dengan mudah (Excel & PDF)
- 🎨 **Modern UI/UX** - Desain futuristik dengan glassmorphism dan animasi smooth
- 📱 **Fully Responsive** - Bekerja sempurna di desktop, tablet, dan mobile

---

## ✨ Fitur Utama

### 🧠 Analisis Procurement dengan Google Gemini AI
- Analisis otomatis terhadap data procurement
- Insight mendalam tentang pola pembelian
- Rekomendasi berbasis AI untuk optimasi inventaris
- Deteksi anomali dan tren pembelian

### 📊 Dashboard Real-time
- Visualisasi data interaktif dengan Recharts
- Monitoring stok real-time
- Statistik procurement dan inventaris
- Grafik dan chart yang informatif

### 📧 Notifikasi Email via Resend
- Notifikasi otomatis untuk low stock
- Alert untuk procurement baru
- Email summary harian/mingguan
- Konfigurasi notifikasi yang fleksibel

### 📁 Manajemen Data (Import/Export)
- **Import Excel** - Upload data inventaris dari file .xlsx/.xls
- **Export Excel** - Download laporan dalam format Excel
- **Export PDF** - Generate laporan profesional dalam PDF
- Validasi data otomatis saat import

### 🔐 Autentikasi & Keamanan
- Login page dengan desain futuristik
- Session management yang aman
- Role-based access control (RBAC) ready

---

## 🛠️ Tech Stack

### Frontend
- **[Next.js 16.1.6](https://nextjs.org/)** - React framework dengan App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development
- **[Tailwind CSS 4.0](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Lucide React](https://lucide.dev/)** - Beautiful icon library
- **[Recharts](https://recharts.org/)** - Data visualization library

### Backend & Database
- **[Prisma ORM 5.22.0](https://www.prisma.io/)** - Next-generation ORM
- **[PostgreSQL](https://www.postgresql.org/)** - Robust relational database (via Supabase)
- **Next.js Server Actions** - Server-side logic

### AI & Integrations
- **[Google Gemini API](https://ai.google.dev/)** - Advanced AI analysis
- **[Resend](https://resend.com/)** - Modern email API

### Utilities
- **[XLSX](https://www.npmjs.com/package/xlsx)** - Excel file processing
- **[jsPDF](https://github.com/parallax/jsPDF)** - PDF generation
- **[jsPDF-AutoTable](https://github.com/simonbengtsson/jsPDF-AutoTable)** - PDF table formatting

---

## 📦 Instalasi

### Prasyarat
Pastikan Anda telah menginstall:
- **Node.js** (versi 18.x atau lebih tinggi)
- **npm** atau **yarn** atau **pnpm**
- **Git**
- **PostgreSQL** database (atau akun Supabase)

### Langkah-langkah Instalasi

#### 1️⃣ Clone Repository
```bash
git clone https://github.com/shinerking/nexusflow.git
cd nexusflow
```

#### 2️⃣ Install Dependencies
```bash
npm install
# atau
yarn install
# atau
pnpm install
```

#### 3️⃣ Setup Environment Variables
Buat file `.env` di root project dan isi dengan konfigurasi berikut:

```env
# Database Configuration (Supabase)
DATABASE_URL="postgresql://user:password@host:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://user:password@host:5432/postgres"

# Google Gemini AI API Key
GEMINI_API_KEY=your_gemini_api_key_here

# Resend Email API Key
RESEND_API_KEY=your_resend_api_key_here

# Email Configuration
NOTIFICATION_EMAIL=your-email@example.com
SENDER_EMAIL=onboarding@resend.dev
```

**Cara mendapatkan API Keys:**
- **Gemini API Key**: Daftar di [Google AI Studio](https://ai.google.dev/)
- **Resend API Key**: Daftar di [Resend.com](https://resend.com/)
- **Database**: Buat project di [Supabase](https://supabase.com/) dan copy connection string

#### 4️⃣ Setup Database
```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed database dengan data dummy (opsional)
npx prisma db seed
```

#### 5️⃣ Jalankan Development Server
```bash
npm run dev
# atau
yarn dev
# atau
pnpm dev
```

Buka browser dan akses [http://localhost:3000](http://localhost:3000) 🎉

#### 6️⃣ Login ke Aplikasi
Gunakan kredensial demo:
- **Email**: `admin@democorp.com`

---

## 📸 Screenshot

### 🖥️ Dashboard View
![Dashboard Screenshot](./screenshots/dashboard.png)
> *Dashboard real-time dengan visualisasi data interaktif dan statistik procurement*

---

### 🔐 Login Page
![Login Screenshot](./screenshots/login.png)
> *Login page dengan desain futuristik, deep gradient, dan glassmorphism effect*

---

### 📱 Mobile View
![Mobile Screenshot](./screenshots/mobile.png)
> *Fully responsive design yang bekerja sempurna di semua perangkat mobile*

---

## 📁 Struktur Project

```
nexusflow/
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Database seeding
├── src/
│   ├── app/
│   │   ├── actions/       # Server actions
│   │   ├── inventory/     # Inventory page
│   │   ├── login/         # Login page
│   │   ├── procurement/   # Procurement page
│   │   └── page.tsx       # Dashboard (home)
│   ├── components/
│   │   ├── auth/          # Authentication components
│   │   ├── dashboard/     # Dashboard components
│   │   └── layout/        # Layout components
│   └── lib/
│       ├── db.ts          # Prisma client
│       └── gemini.ts      # Gemini AI client
├── public/                # Static assets
├── .env                   # Environment variables
├── package.json           # Dependencies
└── README.md             # Documentation
```

---

## 🚀 Deployment

### Deploy ke Vercel (Recommended)

1. Push code ke GitHub repository
2. Import project di [Vercel](https://vercel.com/)
3. Tambahkan environment variables di Vercel dashboard
4. Deploy! 🎉

```bash
# Atau gunakan Vercel CLI
npm i -g vercel
vercel
```

### Build untuk Production

```bash
npm run build
npm run start
```

---

## 🤝 Kontribusi

Kontribusi selalu diterima! Jika Anda ingin berkontribusi:

1. Fork repository ini
2. Buat branch baru (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

---

## 📝 License

Project ini menggunakan lisensi **MIT**. Lihat file `LICENSE` untuk detail lebih lanjut.

---

## 👨‍💻 Developer

Dibuat dengan ❤️ oleh **[Your Name]**

- 🌐 Website: (https://shinerking.github.io/)
- 📧 Email: abimanyuriantoputra@gmail.com
- 💼 LinkedIn: (https://www.linkedin.com/in/abimanyu-rianto-putra-277966318)
- 🐙 GitHub: (https://github.com/shinerking/)

---

## 🙏 Acknowledgments

- [Next.js Team](https://nextjs.org/) untuk framework yang luar biasa
- [Vercel](https://vercel.com/) untuk platform deployment
- [Google](https://ai.google.dev/) untuk Gemini AI API
- [Resend](https://resend.com/) untuk email service
- [Supabase](https://supabase.com/) untuk database hosting

---

<div align="center">

**⭐ Jangan lupa beri star jika project ini bermanfaat! ⭐**

Made with 🚀 by NexusFlow Team

</div>
