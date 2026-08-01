# Frontend Infrastructure Design — API Layer, Auth, State Management & Route Guards

> **Status:** Approved  
> **Date:** 2025-08-01  
> **Scope:** `hive/` (Next.js frontend), zero changes to `hive-backend/`

---

## 1. Problem Statement

The Hive backend has 60+ API endpoints at `/api/v1/*` (Hono, port 5000, JWT Bearer auth). The frontend (`hive/`) has never talked to it — all data is hardcoded mock data. There is no API client, no state management, no real auth flow, and no route protection beyond a basic cookie existence check in `proxy.ts`.

## 2. Architecture Overview

```
┌──────────────────────────────────────────────────────────┐
│  Browser                                                  │
│  ┌──────────┐  ┌───────────┐  ┌──────────────────┐      │
│  │ Header   │  │ AuthGuard │  │ Dashboard Pages   │      │
│  │ (reads   │  │ (session  │  │ (useXxxStore,     │      │
│  │  store)  │  │  check)   │  │  xxx.api.ts)      │      │
│  └────┬─────┘  └─────┬─────┘  └────┬───┬─────────┘      │
│       │              │              │   │                 │
│  ┌────▼──────────────▼──────────────▼───▼─────────────┐  │
│  │              Zustand Stores                         │  │
│  │  auth.store  courses.store  communities.store  ...  │  │
│  └────────────────────┬───────────────────────────────┘  │
│                       │                                  │
│  ┌────────────────────▼───────────────────────────────┐  │
│  │              API Services                            │  │
│  │  api-client.ts (axios + interceptors)               │  │
│  │  auth.api.ts  courses.api.ts  communities.api.ts    │  │
│  └──────┬─────────────────────────────┬───────────────┘  │
│         │ (auth calls via BFF)        │ (data calls)     │
└─────────┼─────────────────────────────┼──────────────────┘
          │                             │
    ┌─────▼──────────┐          ┌───────▼──────────────┐
    │ Next.js BFF     │          │ Hono Backend          │
    │ /api/auth/*     │          │ :5000/api/v1/*        │
    │ (cookie mgmt)   │          │ (JWT Bearer)          │
    └─────┬───────────┘          └───────────────────────┘
          │
    ┌─────▼──────────┐
    │ Hono Auth       │
    │ /api/v1/auth/*  │
    └────────────────┘
```

### Separation of Concerns

| Concern | Where | Why |
|---------|-------|-----|
| Refresh token storage | httpOnly cookie (BFF-managed) | XSS-proof, never exposed to JS |
| Access token storage | Zustand store (in-memory) | Short-lived, no localStorage surface area |
| Auth routing hint | `hive-access-token` cookie (non-httpOnly) | Middleware can read it; zero-latency route gate |
| User identity persistence | Zustand persist (localStorage) | Enables instant "Go to Dashboard" on landing page |
| API data calls | Direct to Hono backend (`localhost:5000`) | No BFF overhead for non-auth data |
| Auth calls | Through Next.js BFF (`/api/auth/*`) | Cookie management requires server-side context |

---

## 3. File Inventory

| # | File | Action | Purpose |
|---|---|---|---|
| 1 | `package.json` | EDIT | Add `axios`, `zustand` |
| 2 | `.env.local` | EDIT | Add `NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1` |
| 3 | `src/middleware.ts` | NEW | Route protection (replaces proxy.ts) |
| 4 | `src/lib/proxy.ts` | DELETE | Replaced by middleware.ts |
| 5 | `src/types/api.ts` | NEW | `PaginatedResponse<T>` |
| 6 | `src/types/user.ts` | NEW | `User`, `Role` |
| 7 | `src/types/course.ts` | NEW | `Course`, `CreateCourseInput`, `UpdateCourseInput` |
| 8 | `src/types/community.ts` | NEW | `Community` types |
| 9 | `src/types/enrollment.ts` | NEW | `Enrollment` types |
| 10 | `src/services/api/api-client.ts` | NEW | Axios instance + auth interceptors |
| 11 | `src/services/api/auth.api.ts` | NEW | BFF-proxied auth calls |
| 12 | `src/services/api/courses.api.ts` | NEW | Course CRUD + modules + lessons |
| 13 | `src/services/api/communities.api.ts` | NEW | Community CRUD + analytics |
| 14 | `src/services/api/enrollments.api.ts` | NEW | Enroll, progress, list |
| 15 | `src/stores/auth.store.ts` | NEW | Auth state + persistent user identity |
| 16 | `src/stores/courses.store.ts` | NEW | Course state + async actions |
| 17 | `src/stores/communities.store.ts` | NEW | Community state + async actions |
| 18 | `src/stores/enrollments.store.ts` | NEW | Enrollment state + async actions |
| 19 | `src/app/api/auth/login/route.ts` | NEW | BFF: login proxy |
| 20 | `src/app/api/auth/register/route.ts` | NEW | BFF: register proxy |
| 21 | `src/app/api/auth/logout/route.ts` | NEW | BFF: logout proxy |
| 22 | `src/app/api/auth/refresh/route.ts` | NEW | BFF: token rotation |
| 23 | `src/app/api/auth/session/route.ts` | NEW | BFF: validate + return user |
| 24 | `src/components/auth/AuthGuard.tsx` | NEW | Client auth wrapper + session init |
| 25 | `src/components/LandingPageHeader.tsx` | EDIT | Auth-aware CTA button |
| 26 | `src/app/dashboard/layout.tsx` | EDIT | Wrap with AuthGuard |
| 27 | `src/app/dashboard/page.tsx` | EDIT | Wire student dashboard to real data |

**Total: 27 files** (18 new, 5 edits, 1 delete, 1 package, 1 env var, 1 rename)

---

## 4. Detailed Component Design

### 4.1 API Client (`src/services/api/api-client.ts`)

The bedrock. Every module API service imports this.

**Pattern:** Singleton axios instance with request interceptor (attach access token) and response interceptor (transparent 401 refresh with request queueing).

```
Key behaviors:
- Reads accessToken from Zustand getState() (not hook — interceptors run outside React)
- On 401: queues concurrent requests, fires one BFF refresh, retries all on success
- On refresh failure: clears store, redirects via `window.location.replace('/auth')` (NOT `next/navigation`'s `redirect()` — that throws `NEXT_REDIRECT` which only works server-side; in the browser it becomes an unhandled rejection). Uses `replace()` over `href=` to keep the broken state out of back/forward history.
- Refresh call uses bare axios.post() to /api/auth/refresh (NOT apiClient — avoids infinite loop)
- _retry flag prevents single-request infinite 401 loops
```

**Dependencies:** `axios`, `useAuthStore` (via `getState()`)

### 4.2 Auth API Service (`src/services/api/auth.api.ts`)

**Calls the BFF only** (relative URLs). Not an apiClient instance — explicit bare axios calls to avoid interceptor loops on refresh.

```ts
export const authApi = {
  login:     (credentials) => axios.post('/api/auth/login', credentials),
  register:  (data) => axios.post('/api/auth/register', data),
  refresh:   () => axios.post('/api/auth/refresh'),
  logout:    () => axios.post('/api/auth/logout'),
  getSession: () => axios.get('/api/auth/session'),
};
```

### 4.3 Module API Services

Pattern for every module (`courses.api.ts`, `communities.api.ts`, `enrollments.api.ts`):

- Import `apiClient` from `./api-client`
- Export named object with methods: `list`, `getById`, `create`, `update`, `delete`
- Return raw axios responses (stores unwrap `.data`)
- Nested resources: `listModules(courseId)`, `createModule(courseId, input)`, etc.

**Backend module → frontend API service mapping:**

| Backend Router | Frontend API Service | Endpoints Covered |
|---|---|---|
| `/courses` | `courses.api.ts` | CRUD + modules + lessons |
| `/communities` | `communities.api.ts` | CRUD + analytics + members |
| `/enrollments` | `enrollments.api.ts` | Enroll, progress, list |
| `/auth` | `auth.api.ts` | All auth (via BFF) |
| (future) | `quiz.api.ts`, `certificates.api.ts`, etc. | On demand |

### 4.4 Auth Store (`src/stores/auth.store.ts`)

**State:** `accessToken`, `user`, `isAuthenticated`, `isSessionLoading`  
**Actions:** `setAccessToken`, `setUser`, `setSessionLoading`, `clear`

**Persistence (Zustand persist):** Only `user` and `isAuthenticated` go to localStorage (key: `hive-auth`). `accessToken` is NEVER persisted — it lives in-memory only.

**Why persist user but not token:** The landing page header reads `isAuthenticated` for the "Go to Dashboard" CTA. The session check provides the actual token on dashboard entry. A stale `isAuthenticated: true` with an expired token results in a brief skeleton → redirect, which is acceptable.

### 4.5 Module Stores

Pattern for every module (`courses.store.ts`, `communities.store.ts`, `enrollments.store.ts`):

- Plain Zustand (no persist — data is fetched fresh per session)
- State: `items[]`, `currentItem`, `isLoading`, `error`
- Async actions: `fetchXxx`, `fetchXxxById`, `createXxx`, `updateXxx`, `deleteXxx`
- Each action: set loading → call API → set data / set error

### 4.6 BFF Route Handlers (`src/app/api/auth/*/route.ts`)

Five Next.js App Router route handlers. Each follows the same pattern:

1. Receive client request (with or without body)
2. Forward to Hono backend at `NEXT_PUBLIC_API_URL` using server-side fetch
3. Read/Set httpOnly cookies for the refresh token
4. Read/Set non-httpOnly `hive-access-token` cookie for middleware routing
5. Return access token + user data in JSON response body

**Cookie configuration:**
```ts
const COOKIE_OPTIONS = {
  httpOnly: true,                                // refresh token only — never JS-accessible
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 7 * 24 * 60 * 60,                     // 7 days (refresh token)
};

const ACCESS_COOKIE_OPTIONS = {
  httpOnly: false,                               // middleware-readable routing hint
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 30 * 60,                               // 30 minutes (matches access token TTL)
};
```

**Route summary:**

| Route | Method | Purpose | Reads Cookie | Sets Cookie |
|---|---|---|---|---|
| `/api/auth/session` | GET | Validate existing token, return user | refresh (httpOnly) | access (non-httpOnly) |
| `/api/auth/login` | POST | Forward credentials, establish session | — | refresh + access |
| `/api/auth/register` | POST | Forward registration, establish session | — | refresh + access |
| `/api/auth/refresh` | POST | Rotate tokens | refresh (httpOnly) | refresh + access |
| `/api/auth/logout` | POST | Invalidate session | refresh (httpOnly) | clear both |

### 4.7 Middleware (`src/middleware.ts`)

Replaces the existing `src/lib/proxy.ts`.

**Logic:**
1. Public routes (`/`, `/auth`, `/admin/login`) → pass through
2. `/dashboard/*` routes → check for `hive-access-token` cookie
3. Cookie missing → redirect to `/auth`
4. Cookie present → pass through (the AuthGuard client component handles deeper validation)

**The `hive-access-token` cookie is a routing hint, not the source of truth.** The real auth enforcement happens client-side in AuthGuard. Middleware only prevents the initial SSR flash of protected content for unauthenticated users.

**Matcher:** `["/dashboard/:path*"]`

### 4.8 AuthGuard (`src/components/auth/AuthGuard.tsx`)

Client component. Wraps all dashboard layouts.

**Lifecycle:**
1. **Mount / route change:** Call `GET /api/auth/session`
2. **While loading:** Render `<DashboardSkeleton />`
3. **On success:** Populate auth store (`setAccessToken`, `setUser`), render children
4. **On 401:** Clear store, redirect to `/auth`
5. **On network/5xx error:** Log, show non-blocking toast, retry once. Do NOT clear the store or redirect. Only 401 means "you are not authenticated."

**Important:** Use `useAuthStore.getState()` for the session response handling (not the hook's setter) to avoid stale closures in the `useEffect` callback.

### 4.9 LandingPageHeader Change

One conditional change:
```tsx
// Read from store — instant after hydration
const { isAuthenticated, user } = useAuthStore();

// If authenticated: "Go to Dashboard" with role-aware link
// If not: "Get Started" → /auth
```

The persisted `isAuthenticated` flag makes this instant. If the token is expired, clicking "Go to Dashboard" triggers AuthGuard's session check which will redirect to `/auth` — a brief skeleton flash, acceptable UX.

### 4.10 Student Dashboard Rewire

Replace hardcoded `dueSoon`, `continueLearning`, `recentActivity` arrays with data from Zustand stores. The page is already `"use client"` so it consumes stores directly:

```tsx
const { courses, fetchCourses, isLoading } = useCoursesStore();
const { enrollments, fetchEnrollments } = useEnrollmentsStore();

useEffect(() => { fetchCourses(); fetchEnrollments(); }, []);
```

Purpose: end-to-end proof that login → token → middleware → guard → store → API call → rendered data works.

---

## 5. Data Flow: Login (End-to-End)

```
1. User clicks "Get Started" → /auth page → fills LoginForm
2. LoginForm calls authApi.login({ email, password })
3. BFF /api/auth/login receives request
4. BFF forwards to Hono POST /api/v1/auth/login
5. Hono validates, returns { accessToken, refreshToken, user }
6. BFF sets httpOnly cookie (refresh token) + non-httpOnly cookie (access hint)
7. BFF returns { accessToken, user } to client
8. Auth store: setAccessToken(), setUser()
9. Router.push('/dashboard?role=student')
10. Middleware sees hive-access-token cookie → passes
11. AuthGuard mounts, calls /api/auth/session → confirms → renders children
12. Dashboard page: useEffect fires fetchCourses(), fetchEnrollments()
13. apiClient attaches Bearer token → Hono validates → returns real data
14. Store populates → React re-renders with real content
```

## 5.1 Data Flow: Token Refresh (Transparent)

```
1. Three widgets fire apiClient.get('/courses'), apiClient.get('/enrollments'),
   apiClient.get('/communities') simultaneously
2. All three fail with 401 (access token expired)
3. First 401: interceptor sets isRefreshing=true, calls BFF /api/auth/refresh
4. 2nd and 3rd 401s: interceptor sees isRefreshing → pushes to failedQueue (Promise)
5. BFF reads httpOnly refresh cookie → forwards to Hono /api/v1/auth/refresh
6. Hono returns new { accessToken, refreshToken }
7. BFF rotates both cookies, returns new accessToken
8. Interceptor: processQueue(null, newAccessToken) → resolves all 3 queued Promises
9. All 3 original requests retry with new Bearer token → succeed
10. User sees none of this — their widgets loaded a few ms slower
```

---

## 6. Security Properties

| Property | How |
|---|---|
| Refresh token XSS exfiltration | httpOnly cookie — never exposed to JS |
| Access token XSS exfiltration | In-memory only (Zustand), short TTL (30m) |
| CSRF on refresh | SameSite=lax cookie, no GET-based state changes |
| Route flash protection | Middleware cookie check prevents SSR of protected content |
| Stale auth detection | AuthGuard session check on every route entry |
| Token reuse detection | Backend JWT with expiry; refresh tokens are single-use (handled by Hono) |
| Concurrent 401s | Singleton refresh queue — one BFF call, N retries |

---

## 7. Testing Strategy

| Layer | What to test | How |
|---|---|---|
| `api-client.ts` | Interceptor attaches token, queues on 401, retries on refresh, redirects on failure | Unit tests with mocked axios adapter |
| `auth.store.ts` | `clear()` resets state, `setAccessToken` sets `isAuthenticated`, persist partialize | Plain Zustand tests (no React) |
| `courses.store.ts` | `fetchCourses` populates on success, sets error on failure, sets isLoading | Mock `coursesApi` |
| `middleware.ts` | Redirects to /auth when no cookie, passes through with cookie | Next.js middleware unit test |
| `AuthGuard` | Renders skeleton while loading, renders children after session, redirects on 401 | React Testing Library |
| BFF routes | Login sets cookies, refresh reads cookie, session validates token | Integration test with test Hono instance |
| E2E: Dashboard | Full login → dashboard render with real data | Playwright (future phase) |

---

## 8. Out of Scope (Deferred)

- Remaining module API services (quiz, certificates, submissions, payments, etc.) — built on demand
- Remaining Zustand stores — built on demand
- Non-student dashboard pages (instructor, parent, admin)
- Playwright E2E tests
- Loading/error/empty state polish beyond the skeleton
- Backend CORS changes (assumed already configured for `localhost:3000`)
- Social OAuth (Google, Facebook) — BFF routes needed but deferred to separate phase

---

## 9. Review Checklist (Self-Review)

- [ ] No placeholders or TODOs
- [ ] All sections internally consistent (cookie strategy matches middleware, store persistence matches header behavior)
- [ ] Single coherent scope — infrastructure foundation only, one wired dashboard page
- [ ] No ambiguous requirements: every file's purpose and behavior is specified
- [ ] Error states covered: 401 (redirect), network error (retain session), refresh failure (clear + redirect)
- [ ] All design decisions traceable to security or UX trade-offs documented above
