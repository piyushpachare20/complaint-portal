# ComplaintPortal

**A production-ready grievance redressal platform built with Next.js 15, Supabase, and TypeScript**

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm 9+
- Supabase account

### Installation

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local

# Add your Supabase credentials to .env.local

# Run development server
npm run dev

# Open http://localhost:3000
```

### Build for Production

```bash
npm run build
npm run start
```

## 📁 Project Structure

```
complaint-portal/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication routes
│   ├── (citizen)/                # Citizen portal
│   ├── (dashboard)/              # Nagarasevaka dashboard
│   └── api/                      # API routes
├── components/                   # React components
│   ├── auth/                     # Login/Signup forms
│   ├── forms/                    # Complaint forms
│   ├── layouts/                  # Navbar, Sidebar
│   ├── grievance/                # Complaint components
│   └── common/                   # Shared UI components
├── lib/                          # Utilities & logic
│   ├── supabase/                 # Database clients
│   ├── auth/                     # Authentication
│   ├── validation/               # Zod schemas
│   ├── types/                    # TypeScript types
│   └── utils/                    # Helper functions
└── public/                       # Static assets
```

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Database:** PostgreSQL (Supabase)
- **Auth:** Supabase Auth (JWT)
- **Storage:** Supabase Storage
- **Styling:** Tailwind CSS
- **Forms:** React Hook Form + Zod
- **State:** Zustand
- **Hosting:** Vercel

## 📚 Documentation

- **Project Overview:** See `Project-Overview` file
- **Implementation Plan:** See `Implementation-Plan` file
- **Technical Architecture:** See `Technical-Architecture` file
- **Deployment Checklist:** See `Deployment-Checklist` file
- **Executive Summary:** See `Executive-Summary` file

## 🔐 Environment Variables

Create a `.env.local` file with:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_APP_NAME=ComplaintPortal
NEXT_PUBLIC_APP_VERSION=1.0.0
```

## 📦 Features

### ✅ Citizen Features
- Submit grievances with photo upload
- Track complaint status
- View complaint history
- Bilingual support (English/Marathi)

### ✅ Nagarasevaka Features  
- View ward-specific complaints
- Update complaint status
- Add resolution remarks
- Dashboard with statistics

### ✅ System Features
- JWT-based authentication
- Row-Level Security (RLS)
- Role-based access control
- Mobile responsive design
- Image optimization
- Type-safe with TypeScript

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

See `Deployment-Checklist` file for detailed steps.

## 📝 License

Private - Ambarnath Municipal Corporation

## 👤 Author

Developed for Ambarnath, Maharashtra Pilot Program

---

**Status:** ✅ Production Ready  
**Version:** 1.0.0  
**Last Updated:** January 2026
