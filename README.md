# Leonis — AI Pet Care App

Leonis (formerly PawPal) is a full-stack SaaS application that helps pet owners track their pet's health, log daily activities, set reminders, and get personalized AI-powered advice — all in one place.

**Live app:** [pawpal.umairiqbal.tech](https://pawpal.umairiqbal.tech)
**Backend repo:** [leonis-backend](https://github.com/umair-iqbal-61/leonis-backend)

---

## Screenshots

![Landing page](https://github.com/user-attachments/assets/6363e471-2d35-46e9-bd29-5ecd04df2ca5)

![Dashboard](https://github.com/user-attachments/assets/8aeec1a4-91b2-40cc-b3d7-8779c5cbff88)

![AI Chat](https://github.com/user-attachments/assets/1cfacd4f-743f-4078-9b63-39c822af4a53)

---

## Features

- **AI Chat** — Context-aware pet advisor powered by Groq. Knows your pet's breed, age, weight history, meals, and vet visits before you even ask
- **Health Tracking** — Log meals, weight, and vet visits with full history per pet
- **Weight Chart** — Interactive line chart with range selector (2W / 1M / 3M / All) and trend indicators
- **Smart Reminders** — Browser notifications for feeding, medication, grooming, and vet visits on custom schedules
- **Photo Gallery** — Upload and manage pet photos with full-screen preview, stored on Cloudinary
- **Pet avatars** — Per-pet profile photo
- **Multi-pet support** — Manage unlimited pets from one account
- **Dark mode** — Full dark mode support across every screen
- **Responsive** — Works on mobile, tablet, and desktop

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, React Router v6 |
| Styling | Tailwind CSS v4 |
| Backend | Node.js, Express 5, Prisma 7 ([leonis-backend](https://github.com/umair-iqbal-61/leonis-backend)) |
| Database | PostgreSQL via Neon |
| Auth | JWT + bcrypt |
| File storage | Cloudinary |
| AI | Groq (`openai/gpt-oss-20b`), proxied through the backend |
| Charts | Recharts |
| Deployment | Vercel (frontend), Render (backend) |

---

## Architecture

```
src/
├── components/
│   ├── tracking/        # MealLog, WeightLog, VetVisits, Reminders, PhotoGallery, WeightChart
│   ├── Chat.jsx          # AI chatbot UI
│   ├── DarkModeToggle.jsx
│   ├── ErrorBoundary.jsx
│   └── PetCard.jsx
├── hooks/
│   ├── useChat.js        # AI chat state, talks to backend /chat route
│   ├── useDarkMode.js    # Theme persistence
│   └── useReminders.js   # Background reminder polling + browser notifications
├── lib/
│   └── api.js            # apiFetch — shared fetch wrapper, attaches JWT, handles FormData
├── pages/
│   ├── Landing.jsx
│   ├── Login.jsx
│   ├── Signup.jsx
│   ├── Dashboard.jsx
│   └── pets/
│       ├── PetList.jsx
│       ├── PetDetail.jsx
│       ├── AddPet.jsx
│       └── EditPet.jsx
```

This repo is the frontend only. All data lives behind the [leonis-backend](https://github.com/umair-iqbal-61/leonis-backend) REST API — nothing talks to a database or Cloudinary directly from the browser.

---

## Local Development

**Prerequisites:** Node.js 18+, Git, a running instance of [leonis-backend](https://github.com/umair-iqbal-61/leonis-backend) (local or deployed)

```bash
git clone https://github.com/umair-iqbal-61/leonis-frontend.git
cd leonis-frontend
npm install
```

**Environment variables:**

```env
VITE_API_URL=http://localhost:7461
```

Point this at your local backend, or the deployed one (`https://pawpal-backend-ekyt.onrender.com`).

```bash
npm run dev
```

---

## Key Technical Decisions

**Why a custom Express/Prisma backend instead of Supabase?**
The project started on Supabase (auth, Postgres, storage, Edge Functions) and was migrated to a self-built Node/Express/Prisma API as a deliberate portfolio decision — demonstrates backend ownership end to end (auth, ownership-scoped REST routes, migrations, deployment) rather than relying on a BaaS.

**Why a server-side AI proxy?**
The Groq API key never touches the browser. Chat requests hit the backend's `/pets/:petId/chat` route, which injects the key and forwards to Groq.

**Why Cloudinary over Supabase Storage?**
Decoupling storage from the database provider kept the migration clean — Cloudinary handles photo gallery uploads and pet avatars independently of the Postgres/Prisma layer.

---

## Roadmap

- [ ] Render AI chat Markdown with readable paragraphs, lists, and tables, including mobile and dark-mode support.

- [ ] PWA support for true background notifications
- [ ] Weight chart export as PNG/CSV
- [ ] Vet visit calendar view
- [ ] Edit UI for meals/weights/vet visits/reminders (backend PATCH routes already exist)
- [ ] Pet avatar removal UI (backend DELETE route already exists)
- [ ] Email digests for weekly health summaries

---

## Evolution

| | v1 | v2 (current) |
|---|---|---|
| Backend | Supabase (BaaS) | Custom Express + Prisma REST API |
| Auth | Supabase Auth | JWT + bcrypt |
| Storage | Supabase Storage | Cloudinary |
| AI proxy | Supabase Edge Function | Self-hosted Express route |

---

Built by [Umair Iqbal](https://github.com/umair-iqbal-61) · BS Information Technology student
