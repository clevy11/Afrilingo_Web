# Afrilingo Website Frontend

A modern, responsive web frontend for Afrilingo — an African languages learning platform. Built with Vite, React, TypeScript, Tailwind CSS, and shadcn/ui components. It features an Admin/Tutor dashboard, course and lesson management, quizzes, analytics, and a public landing page with mobile app promotion.

## Features
- Admin/Tutor role-based dashboard with protected routes
- Manage languages, courses, lessons, quizzes, questions
- Certificate and proctoring event views
- Search and advanced filtering utilities
- In-memory GET request caching with TTL and write invalidation
- JWT auth with refresh token handling
- Mobile app APK download link and landing sections

## Tech Stack
- React + TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- React Router
- @tanstack/react-query (data fetching)

## Project Structure
```
afrilingo-website-frontend-68/
├─ public/
│  ├─ apk/app-release.apk            # Android APK served publicly
│  └─ lovable-uploads/...            # Images/assets
├─ src/
│  ├─ components/                    # Reusable UI & feature components
│  │  ├─ admin/                      # Admin dashboard components
│  │  ├─ auth/                       # Route guards
│  │  └─ ui/                         # shadcn/ui primitives
│  ├─ contexts/                      # Auth context
│  ├─ hooks/                         # Custom hooks (search/filter, toast)
│  ├─ pages/                         # Page-level routes (Admin, Landing, etc.)
│  ├─ services/                      # API services (httpClient-based)
│  └─ utils/                         # httpClient, role utils, helpers
├─ .env                               # Environment variables
├─ index.html
├─ tailwind.config.ts
└─ vite.config.ts
```

## Environment Variables
Create a `.env` file at the project root (already present). Key variables:
```
VITE_API_BASE_URL=http://localhost:8081/api/v1
VITE_API_BASE_URL_PROD=https://api.afrilingo.com/api/v1
VITE_HTTP_CACHE_TTL_MS=300000
```
- VITE_HTTP_CACHE_TTL_MS controls the in-memory GET cache TTL (ms) in `src/utils/httpClient.ts`.

## Getting Started
### Prerequisites
- Node.js LTS (v18+ recommended)
- npm (or bun/pnpm if preferred)

### Install dependencies
```
npm install
```

### Run development server
```
npm run dev
```
The app runs on http://localhost:5173 (default Vite port).

### Build for production
```
npm run build
```
Build output goes to `dist/`.

### Preview production build
```
npm run preview
```

## Authentication & Roles
- Authentication is handled by `src/services/authService.ts`.
- Tokens are stored in `localStorage` and refreshed automatically on 401 via `httpClient`.
- Roles supported: `ROLE_ADMIN`, `ROLE_PROCTOR`, `ROLE_USER`.
- Dashboard access is restricted to Admin/Proctor via `RoleProtectedRoute` and `roleUtils`.

## HTTP Client & Caching
- Central client: `src/utils/httpClient.ts`.
- GET requests are cached in-memory with TTL (`VITE_HTTP_CACHE_TTL_MS`).
- Concurrent identical GETs are de-duplicated.
- POST/PUT/PATCH/DELETE calls invalidate the cache to prevent stale data.
- Per-call controls (optional):
  - `httpClient.get(url, { cacheTTLMs: 60000 })`
  - `httpClient.get(url, { bypassCache: true })`

## Services
Services wrap backend endpoints and use `httpClient`:
- `languageService`, `courseService`, `lessonService`, `quizService`, `questionService`
- `userService`, `profileService`, `certificationService`, `searchService`

Return types attempt to unwrap `{ data: T }` API envelopes or raw arrays transparently.

## Admin Dashboard
Key locations:
- Layout: `src/components/admin/AdminLayout.tsx`, `AdminSidebar.tsx`, `AdminHeader.tsx`
- Home widgets: `StatsCards`, `RecentCertificates`, `RecentProctorEvents`, `QuickActions`
- Pages: `src/pages/admin/*` (Courses, Lessons, Quizzes, Users, Analytics, etc.)

## Landing & Mobile App
- Landing sections like `HeroSection`, `MobileAppSection` provide a CTA to download the Android APK.
- Place/update the APK at `public/apk/app-release.apk`.

## Common Scripts
- `npm run dev` — start development server
- `npm run build` — build for production
- `npm run preview` — preview the build
- `npm run lint` — run ESLint (if configured)

## Troubleshooting
- Merge conflict on README.md: resolve conflict, then stage and continue rebase:
  ```
  git add README.md
  git rebase --continue
  ```
- 401s after login: ensure backend URL in `.env` is correct and tokens are valid.
- CORS errors: configure the backend to allow the Vite dev origin (http://localhost:5173 by default).

## Contributing
1. Create a feature branch
2. Commit with clear messages
3. Open a PR against `main`

## License
This project is licensed under the terms of the LICENSE file included in this repository.
