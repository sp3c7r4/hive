# Frontend Infrastructure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the API client, auth system, Zustand stores, route guards, and wire the student dashboard to real backend data.

**Architecture:** Next.js BFF for auth cookie management, axios with interceptor-based token refresh, Zustand for client state (per-module stores + persisted auth store), middleware for server-side route gating, AuthGuard component for client-side session verification.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript 5, axios, zustand, Hono backend at `:5000/api/v1`

## Global Constraints

- Backend is not modified — zero changes to `hive-backend/`
- Refresh token: httpOnly cookie (set by BFF), never exposed to JS
- Access token: in-memory Zustand store (not localStorage), provided by BFF session endpoint
- Middleware routing hint: non-httpOnly `hive-access-token` cookie (30min TTL), for zero-latency route gating
- Auth redirect uses `window.location.replace()` (not `next/navigation` redirect — browser-only)
- Zustand auth store persists only `user` and `isAuthenticated` to localStorage (key: `hive-auth`), never `accessToken`
- Module stores are plain Zustand (no persist — data fetched fresh per session)
- Auth API calls go through Next.js BFF at `/api/auth/*` (relative URLs, bare axios)
- Data API calls go directly to `NEXT_PUBLIC_API_URL` via `apiClient` (axios instance with interceptors)
- Backend endpoints follow envelope: `{ data: ... }` for single, `{ data: [...], meta: {...} }` for lists
- Biome for lint/format, `npx biome check --write` before every commit
- TypeScript strict mode, `import type` for type-only imports

---

### Task 1: Dependencies, Environment, and Shared Types

**Files:**
- Modify: `package.json`
- Create: `.env.local`
- Create: `src/types/api.ts`
- Create: `src/types/user.ts`
- Create: `src/types/course.ts`
- Create: `src/types/community.ts`
- Create: `src/types/enrollment.ts`

**Interfaces:**
- Produces: `PaginatedResponse<T>`, `User`, `Role`, `Course`, `CreateCourseInput`, `UpdateCourseInput`, `Community`, `Enrollment`, `Module`, `Lesson` — consumed by every subsequent task

- [ ] **Step 1: Install dependencies**

```bash
cd hive && npm install axios zustand
```

- [ ] **Step 2: Verify install**

```bash
npm ls axios zustand
```

- [ ] **Step 3: Add environment variable**

Create or ensure `.env.local` contains:
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

- [ ] **Step 4: Create `src/types/api.ts`**

```ts
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiResponse<T> {
  data: T;
}
```

- [ ] **Step 5: Create `src/types/user.ts`**

```ts
export type Role = "instructor" | "student" | "parent" | "admin";

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  isAdmin: boolean;
  emailVerified: boolean;
}
```

- [ ] **Step 6: Create `src/types/course.ts`**

```ts
export type CourseStatus = "draft" | "published" | "archived";

export interface Course {
  id: number;
  title: string;
  description: string | null;
  status: CourseStatus;
  communityId: number;
  instructorId: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCourseInput {
  title: string;
  description?: string;
  communityId: number;
}

export interface UpdateCourseInput {
  title?: string;
  description?: string;
  status?: CourseStatus;
}

export interface Module {
  id: number;
  title: string;
  position: number;
  courseId: number;
}

export interface CreateModuleInput {
  title: string;
  position?: number;
}

export interface Lesson {
  id: number;
  title: string;
  type: "video" | "quiz" | "assignment" | "live" | "pdf";
  moduleId: number;
  position: number;
}
```

- [ ] **Step 7: Create `src/types/community.ts`**

```ts
export type CommunityStatus = "active" | "inactive";

export interface Community {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  status: CommunityStatus;
  instructorId: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCommunityInput {
  name: string;
  description?: string;
}

export interface UpdateCommunityInput {
  name?: string;
  description?: string;
  status?: CommunityStatus;
}
```

- [ ] **Step 8: Create `src/types/enrollment.ts`**

```ts
export type EnrollmentStatus = "active" | "completed" | "cancelled";

export interface Enrollment {
  id: number;
  studentId: number;
  courseId: number;
  status: EnrollmentStatus;
  progress: number;
  enrolledAt: string;
  completedAt: string | null;
}

export interface LessonProgress {
  lessonId: number;
  completed: boolean;
  completedAt: string | null;
}
```

- [ ] **Step 9: Verify TypeScript compilation**

```bash
npx tsc --noEmit
```

- [ ] **Step 10: Commit**

```bash
git add package.json package-lock.json .env.local src/types/
git commit -m "[INFRA]: Add axios, zustand, env config, and shared types"
```

---

### Task 2: BFF Auth Route Handlers

**Files:**
- Create: `src/app/api/auth/login/route.ts`
- Create: `src/app/api/auth/signup/route.ts`
- Create: `src/app/api/auth/logout/route.ts`
- Create: `src/app/api/auth/refresh/route.ts`
- Create: `src/app/api/auth/session/route.ts`

**Interfaces:**
- Consumes: `NEXT_PUBLIC_API_URL` env var, `User` type
- Produces: `/api/auth/login` (POST), `/api/auth/signup` (POST), `/api/auth/logout` (POST), `/api/auth/refresh` (POST), `/api/auth/session` (GET) — consumed by `auth.api.ts` (Task 5), `api-client.ts` interceptor (Task 4), `AuthGuard` (Task 6)
- Backend contract: login expects `{ email, password, loginType: "password" }`, refresh/logout expect `{ refreshToken }` in body, signup returns only verification token (no auth tokens — no cookies set), `/auth/me` returns user data under `data.data`

- [ ] **Step 1: Create shared BFF cookie helper**

Create `src/app/api/auth/cookies.ts`:

```ts
import { cookies } from "next/headers";

export const COOKIE_NAMES = {
  refreshToken: "hive-refresh-token",
  accessToken: "hive-access-token",
} as const;

export const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 7 * 24 * 60 * 60, // 7 days
};

export const ACCESS_COOKIE_OPTIONS = {
  httpOnly: false,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 30 * 60, // 30 minutes
};

export async function setAuthCookies(accessToken: string, refreshToken: string) {
  const jar = await cookies();
  jar.set(COOKIE_NAMES.refreshToken, refreshToken, REFRESH_COOKIE_OPTIONS);
  jar.set(COOKIE_NAMES.accessToken, accessToken, ACCESS_COOKIE_OPTIONS);
}

export async function getRefreshTokenCookie(): Promise<string | undefined> {
  const jar = await cookies();
  return jar.get(COOKIE_NAMES.refreshToken)?.value;
}

export async function clearAuthCookies() {
  const jar = await cookies();
  jar.delete(COOKIE_NAMES.refreshToken);
  jar.delete(COOKIE_NAMES.accessToken);
}
```

- [ ] **Step 2: Create `src/app/api/auth/login/route.ts`**

```ts
import { NextResponse } from "next/server";
import { setAuthCookies } from "../cookies";

const BACKEND = process.env.NEXT_PUBLIC_API_URL!;

export async function POST(request: Request) {
  const body = await request.json();

  // Backend requires loginType field ("password" | "otp")
  const res = await fetch(`${BACKEND}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...body, loginType: "password" }),
  });

  const json = await res.json();

  if (!res.ok) {
    return NextResponse.json(json, { status: res.status });
  }

  // Backend response: { timestamp, status, success, data: { message, user, accessToken, refreshToken } }
  const { accessToken, refreshToken, user } = json.data;
  await setAuthCookies(accessToken, refreshToken);

  return NextResponse.json({ data: { accessToken, user } });
}
```

- [ ] **Step 3: Create `src/app/api/auth/signup/route.ts`**

Note: Backend signup returns only a verification token — NOT auth tokens. The user must verify email then login. No cookies are set here.

```ts
import { NextResponse } from "next/server";

const BACKEND = process.env.NEXT_PUBLIC_API_URL!;

export async function POST(request: Request) {
  const body = await request.json();

  const res = await fetch(`${BACKEND}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const json = await res.json();

  // Pass through — no cookies set (signup returns verification token only)
  return NextResponse.json(json, { status: res.status });
}
```

- [ ] **Step 4: Create `src/app/api/auth/refresh/route.ts`**

Note: Backend expects `{ refreshToken }` in request body, NOT as a Bearer header.

```ts
import { NextResponse } from "next/server";
import { getRefreshTokenCookie, setAuthCookies, clearAuthCookies } from "../cookies";

const BACKEND = process.env.NEXT_PUBLIC_API_URL!;

export async function POST() {
  const refreshToken = await getRefreshTokenCookie();

  if (!refreshToken) {
    return NextResponse.json({ error: { message: "No refresh token" } }, { status: 401 });
  }

  // Backend expects refresh token in body: { refreshToken: "..." }
  const res = await fetch(`${BACKEND}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  const json = await res.json();

  if (!res.ok) {
    await clearAuthCookies();
    return NextResponse.json(json, { status: res.status });
  }

  // Backend response: { data: { message, accessToken, refreshToken } }
  const { accessToken, refreshToken: newRefreshToken } = json.data;
  await setAuthCookies(accessToken, newRefreshToken);

  return NextResponse.json({ data: { accessToken } });
}
```

- [ ] **Step 5: Create `src/app/api/auth/logout/route.ts`**

Note: Backend expects `{ refreshToken }` in request body, NOT as a Bearer header.

```ts
import { NextResponse } from "next/server";
import { getRefreshTokenCookie, clearAuthCookies } from "../cookies";

const BACKEND = process.env.NEXT_PUBLIC_API_URL!;

export async function POST() {
  const refreshToken = await getRefreshTokenCookie();

  if (refreshToken) {
    // Best-effort — don't block on backend response
    // Backend expects refresh token in body: { refreshToken: "..." }
    await fetch(`${BACKEND}/auth/logout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    }).catch(() => {});
  }

  await clearAuthCookies();
  return NextResponse.json({ data: { success: true } });
}
```

- [ ] **Step 6: Create `src/app/api/auth/session/route.ts`**

The session route validates the refresh token, obtains a fresh access token, then fetches user data.

```ts
import { NextResponse } from "next/server";
import { getRefreshTokenCookie, setAuthCookies, clearAuthCookies } from "../cookies";

const BACKEND = process.env.NEXT_PUBLIC_API_URL!;

export async function GET() {
  const refreshToken = await getRefreshTokenCookie();

  if (!refreshToken) {
    return NextResponse.json({ error: { message: "Not authenticated" } }, { status: 401 });
  }

  // Step 1: Refresh tokens — backend expects { refreshToken } in body
  const refreshRes = await fetch(`${BACKEND}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  const refreshJson = await refreshRes.json();

  if (!refreshRes.ok) {
    await clearAuthCookies();
    return NextResponse.json({ error: { message: "Session expired" } }, { status: 401 });
  }

  // Backend response: { data: { message, accessToken, refreshToken } }
  const { accessToken, refreshToken: newRefreshToken } = refreshJson.data;

  // Step 2: Get user data using the fresh access token
  const userRes = await fetch(`${BACKEND}/auth/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  const userJson = await userRes.json();

  // Backend response: { timestamp, status, success, data: { message, data: user } }
  // user is nested under data.data
  const user = userJson.data?.data ?? userJson.data;

  await setAuthCookies(accessToken, newRefreshToken);

  return NextResponse.json({ data: { accessToken, user } });
}
```

- [ ] **Step 7: Verify TypeScript compilation**

```bash
npx tsc --noEmit
```

- [ ] **Step 8: Commit**

```bash
git add src/app/api/auth/
git commit -m "[INFRA]: Add BFF auth route handlers (login, register, refresh, logout, session)"
```

---

### Task 3: Auth Store

**Files:**
- Create: `src/stores/auth.store.ts`

**Interfaces:**
- Consumes: `User` type
- Produces: `useAuthStore` with `accessToken`, `user`, `isAuthenticated`, `isSessionLoading`, `setAccessToken(token)`, `setUser(user)`, `setSessionLoading(bool)`, `clear()` — consumed by `api-client.ts` (Task 4), `AuthGuard` (Task 6), `LandingPageHeader` (Task 9)

- [ ] **Step 1: Create `src/stores/auth.store.ts`**

```ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types/user";

interface AuthState {
  accessToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isSessionLoading: boolean;

  setAccessToken: (token: string) => void;
  setUser: (user: User) => void;
  setSessionLoading: (loading: boolean) => void;
  clear: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      user: null,
      isAuthenticated: false,
      isSessionLoading: true,

      setAccessToken: (token) =>
        set({ accessToken: token, isAuthenticated: true }),

      setUser: (user) => set({ user }),

      setSessionLoading: (loading) => set({ isSessionLoading: loading }),

      clear: () =>
        set({
          accessToken: null,
          user: null,
          isAuthenticated: false,
          isSessionLoading: false,
        }),
    }),
    {
      name: "hive-auth",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
```

- [ ] **Step 2: Verify TypeScript compilation**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add src/stores/auth.store.ts
git commit -m "[INFRA]: Add auth store with Zustand persist"
```

---

### Task 4: API Client with Interceptors

**Files:**
- Create: `src/services/api/api-client.ts`

**Interfaces:**
- Consumes: `useAuthStore.getState()` (Task 3), BFF `/api/auth/refresh` (Task 2)
- Produces: `apiClient` (configured axios instance) — consumed by all module API services (Task 7)

- [ ] **Step 1: Create `src/services/api/api-client.ts`**

```ts
import axios from "axios";
import { useAuthStore } from "@/stores/auth.store";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 15_000,
  headers: { "Content-Type": "application/json" },
});

// ---------------------------------------------------------------------------
// Request interceptor — attach access token from in-memory store
// ---------------------------------------------------------------------------
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ---------------------------------------------------------------------------
// Response interceptor — transparent 401 refresh with request queueing
// ---------------------------------------------------------------------------
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

function processQueue(error: unknown, token: string | null) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  failedQueue = [];
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only handle 401 and avoid infinite loops
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // If a refresh is already in flight, queue this request
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((token) => {
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return apiClient(originalRequest);
      });
    }

    // First 401 — attempt a token refresh
    originalRequest._retry = true;
    isRefreshing = true;

    try {
      // Call Next.js BFF that reads the httpOnly refresh cookie
      // Uses bare axios.post() — NOT apiClient — to avoid interceptor loop
      const { data } = await axios.post("/api/auth/refresh");
      const newAccessToken: string = data.data.accessToken;

      // Update the in-memory store
      useAuthStore.getState().setAccessToken(newAccessToken);

      // Resolve queued requests with the new token
      processQueue(null, newAccessToken);

      // Retry the original request
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return apiClient(originalRequest);
    } catch (refreshError) {
      // Refresh failed — clear store and redirect
      useAuthStore.getState().clear();
      processQueue(refreshError, null);

      // Use replace() to keep broken state out of back/forward history
      // NOT next/navigation redirect() — that throws NEXT_REDIRECT which only
      // works server-side; in the browser it becomes an unhandled rejection.
      if (typeof window !== "undefined") {
        window.location.replace("/auth");
      }

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);
```

- [ ] **Step 2: Verify TypeScript compilation**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add src/services/api/api-client.ts
git commit -m "[INFRA]: Add API client with auth interceptors and refresh queue"
```

---

### Task 5: Auth API Service

**Files:**
- Create: `src/services/api/auth.api.ts`

**Interfaces:**
- Consumes: BFF routes (Task 2)
- Produces: `authApi` — consumed by auth forms (future), `AuthGuard` (Task 6)

- [ ] **Step 1: Create `src/services/api/auth.api.ts`**

```ts
import axios from "axios";

/**
 * Auth API service — calls Next.js BFF routes exclusively.
 * Uses bare axios (not apiClient) to avoid interceptor loops on refresh calls.
 * All URLs are relative — BFF routes live on the same origin.
 */
export const authApi = {
  login: (credentials: { email: string; password: string }) =>
    axios.post("/api/auth/login", credentials),

  signup: (data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: "instructor" | "student" | "parent";
  }) => axios.post("/api/auth/signup", data),

  refresh: () => axios.post("/api/auth/refresh"),

  logout: () => axios.post("/api/auth/logout"),

  getSession: () => axios.get("/api/auth/session"),
};
```

- [ ] **Step 2: Verify TypeScript compilation**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add src/services/api/auth.api.ts
git commit -m "[INFRA]: Add auth API service (BFF-proxied)"
```

---

### Task 6: Middleware + AuthGuard + Proxy Cleanup

**Files:**
- Create: `src/middleware.ts`
- Create: `src/components/auth/AuthGuard.tsx`
- Delete: `src/lib/proxy.ts`

**Interfaces:**
- Consumes: `useAuthStore` (Task 3), `authApi.getSession()` (Task 5), `hive-access-token` cookie (set by BFF, Task 2)
- Produces: Route protection for all `/dashboard/*` routes, reusable `AuthGuard` component — consumed by `dashboard/layout.tsx` (Task 10)

- [ ] **Step 1: Create `src/middleware.ts`**

```ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = ["/", "/auth", "/admin/login"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes — no check needed
  if (PUBLIC_PATHS.includes(pathname) || pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  // Dashboard routes — require access token routing hint cookie
  if (pathname.startsWith("/dashboard")) {
    const accessCookie = request.cookies.get("hive-access-token")?.value;
    if (!accessCookie) {
      return NextResponse.redirect(new URL("/auth", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
```

- [ ] **Step 2: Create `src/components/auth/AuthGuard.tsx`**

```tsx
"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores/auth.store";
import { authApi } from "@/services/api/auth.api";

function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="h-8 w-48 rounded bg-muted animate-pulse" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-40 rounded-xl bg-muted animate-pulse" />
        ))}
      </div>
    </div>
  );
}

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const isSessionLoading = useAuthStore((s) => s.isSessionLoading);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    const store = useAuthStore.getState();

    authApi
      .getSession()
      .then((res) => {
        store.setAccessToken(res.data.data.accessToken);
        store.setUser(res.data.data.user);
      })
      .catch((err) => {
        // Only redirect on explicit 401 — not on network errors or 5xx
        if (err.response?.status === 401) {
          store.clear();
          window.location.replace("/auth");
        }
        // On network/5xx errors: keep user in place, don't clear store
        console.error("Session check failed:", err);
      })
      .finally(() => {
        store.setSessionLoading(false);
      });
  }, []);

  if (isSessionLoading) {
    return <DashboardSkeleton />;
  }

  if (!isAuthenticated) {
    window.location.replace("/auth");
    return null;
  }

  return <>{children}</>;
}
```

- [ ] **Step 3: Delete `src/lib/proxy.ts`**

```bash
rm src/lib/proxy.ts
```

- [ ] **Step 4: Verify TypeScript compilation**

```bash
npx tsc --noEmit
```

- [ ] **Step 5: Commit**

```bash
git add src/middleware.ts src/components/auth/AuthGuard.tsx
git rm src/lib/proxy.ts
git commit -m "[INFRA]: Add middleware, AuthGuard, remove old proxy.ts"
```

---

### Task 7: Module API Services

**Files:**
- Create: `src/services/api/courses.api.ts`
- Create: `src/services/api/communities.api.ts`
- Create: `src/services/api/enrollments.api.ts`

**Interfaces:**
- Consumes: `apiClient` (Task 4), types from Task 1
- Produces: `coursesApi`, `communitiesApi`, `enrollmentsApi` — consumed by module stores (Task 8)

- [ ] **Step 1: Create `src/services/api/courses.api.ts`**

```ts
import { apiClient } from "./api-client";
import type { ApiResponse, PaginatedResponse } from "@/types/api";
import type { Course, CreateCourseInput, UpdateCourseInput, Module, CreateModuleInput, Lesson } from "@/types/course";

export const coursesApi = {
  list: (params?: { page?: number; limit?: number }) =>
    apiClient.get<PaginatedResponse<Course>>("/courses", { params }),

  getById: (id: number) =>
    apiClient.get<ApiResponse<Course>>(`/courses/${id}`),

  create: (input: CreateCourseInput) =>
    apiClient.post<ApiResponse<Course>>("/courses", input),

  update: (id: number, input: UpdateCourseInput) =>
    apiClient.patch<ApiResponse<Course>>(`/courses/${id}`, input),

  delete: (id: number) =>
    apiClient.delete(`/courses/${id}`),

  listModules: (courseId: number) =>
    apiClient.get<PaginatedResponse<Module>>(`/courses/${courseId}/modules`),

  createModule: (courseId: number, input: CreateModuleInput) =>
    apiClient.post<ApiResponse<Module>>(`/courses/${courseId}/modules`, input),

  updateModule: (moduleId: number, input: Partial<CreateModuleInput>) =>
    apiClient.patch<ApiResponse<Module>>(`/modules/${moduleId}`, input),

  deleteModule: (moduleId: number) =>
    apiClient.delete(`/modules/${moduleId}`),

  listLessons: (moduleId: number) =>
    apiClient.get<PaginatedResponse<Lesson>>(`/modules/${moduleId}/lessons`),

  createLesson: (moduleId: number, input: { title: string; type: Lesson["type"] }) =>
    apiClient.post<ApiResponse<Lesson>>(`/modules/${moduleId}/lessons`, input),
};
```

- [ ] **Step 2: Create `src/services/api/communities.api.ts`**

```ts
import { apiClient } from "./api-client";
import type { ApiResponse, PaginatedResponse } from "@/types/api";
import type { Community, CreateCommunityInput, UpdateCommunityInput } from "@/types/community";

export const communitiesApi = {
  list: (params?: { page?: number; limit?: number }) =>
    apiClient.get<PaginatedResponse<Community>>("/communities", { params }),

  getBySlug: (slug: string) =>
    apiClient.get<ApiResponse<Community>>(`/communities/${slug}`),

  create: (input: CreateCommunityInput) =>
    apiClient.post<ApiResponse<Community>>("/communities", input),

  update: (id: number, input: UpdateCommunityInput) =>
    apiClient.patch<ApiResponse<Community>>(`/communities/${id}`, input),

  delete: (id: number) =>
    apiClient.delete(`/communities/${id}`),
};
```

- [ ] **Step 3: Create `src/services/api/enrollments.api.ts`**

```ts
import { apiClient } from "./api-client";
import type { ApiResponse, PaginatedResponse } from "@/types/api";
import type { Enrollment, LessonProgress } from "@/types/enrollment";

interface EnrollInput {
  courseId: number;
}

export const enrollmentsApi = {
  enroll: (input: EnrollInput) =>
    apiClient.post<ApiResponse<Enrollment>>("/enrollments", input),

  list: () =>
    apiClient.get<PaginatedResponse<Enrollment>>("/enrollments"),

  getById: (id: number) =>
    apiClient.get<ApiResponse<Enrollment>>(`/enrollments/${id}`),

  markLessonComplete: (enrollmentId: number, lessonId: number) =>
    apiClient.patch<ApiResponse<void>>(`/enrollments/${enrollmentId}/progress/${lessonId}`),

  getProgress: (enrollmentId: number) =>
    apiClient.get<ApiResponse<LessonProgress[]>>(`/enrollments/${enrollmentId}/progress`),
};
```

- [ ] **Step 4: Verify TypeScript compilation**

```bash
npx tsc --noEmit
```

- [ ] **Step 5: Commit**

```bash
git add src/services/api/courses.api.ts src/services/api/communities.api.ts src/services/api/enrollments.api.ts
git commit -m "[INFRA]: Add module API services (courses, communities, enrollments)"
```

---

### Task 8: Module Zustand Stores

**Files:**
- Create: `src/stores/courses.store.ts`
- Create: `src/stores/communities.store.ts`
- Create: `src/stores/enrollments.store.ts`

**Interfaces:**
- Consumes: module API services (Task 7), types from Task 1
- Produces: `useCoursesStore`, `useCommunitiesStore`, `useEnrollmentsStore` — consumed by `dashboard/page.tsx` (Task 10), future pages

- [ ] **Step 1: Create `src/stores/courses.store.ts`**

```ts
import { create } from "zustand";
import { coursesApi } from "@/services/api/courses.api";
import type { Course, CreateCourseInput, UpdateCourseInput } from "@/types/course";

interface CoursesState {
  courses: Course[];
  currentCourse: Course | null;
  isLoading: boolean;
  error: string | null;

  fetchCourses: () => Promise<void>;
  fetchCourse: (id: number) => Promise<void>;
  createCourse: (input: CreateCourseInput) => Promise<Course | null>;
  updateCourse: (id: number, input: UpdateCourseInput) => Promise<void>;
  deleteCourse: (id: number) => Promise<void>;
  clearError: () => void;
}

export const useCoursesStore = create<CoursesState>((set, get) => ({
  courses: [],
  currentCourse: null,
  isLoading: false,
  error: null,

  fetchCourses: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await coursesApi.list();
      set({ courses: data.data, isLoading: false });
    } catch (err) {
      set({ error: "Failed to load courses", isLoading: false });
    }
  },

  fetchCourse: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await coursesApi.getById(id);
      set({ currentCourse: data.data, isLoading: false });
    } catch (err) {
      set({ error: "Failed to load course", isLoading: false });
    }
  },

  createCourse: async (input) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await coursesApi.create(input);
      set((s) => ({ courses: [...s.courses, data.data], isLoading: false }));
      return data.data;
    } catch (err) {
      set({ error: "Failed to create course", isLoading: false });
      return null;
    }
  },

  updateCourse: async (id, input) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await coursesApi.update(id, input);
      set((s) => ({
        courses: s.courses.map((c) => (c.id === id ? data.data : c)),
        currentCourse: s.currentCourse?.id === id ? data.data : s.currentCourse,
        isLoading: false,
      }));
    } catch (err) {
      set({ error: "Failed to update course", isLoading: false });
    }
  },

  deleteCourse: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await coursesApi.delete(id);
      set((s) => ({
        courses: s.courses.filter((c) => c.id !== id),
        currentCourse: s.currentCourse?.id === id ? null : s.currentCourse,
        isLoading: false,
      }));
    } catch (err) {
      set({ error: "Failed to delete course", isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
```

- [ ] **Step 2: Create `src/stores/communities.store.ts`**

```ts
import { create } from "zustand";
import { communitiesApi } from "@/services/api/communities.api";
import type { Community, CreateCommunityInput, UpdateCommunityInput } from "@/types/community";

interface CommunitiesState {
  communities: Community[];
  currentCommunity: Community | null;
  isLoading: boolean;
  error: string | null;

  fetchCommunities: () => Promise<void>;
  fetchCommunityBySlug: (slug: string) => Promise<void>;
  createCommunity: (input: CreateCommunityInput) => Promise<Community | null>;
  updateCommunity: (id: number, input: UpdateCommunityInput) => Promise<void>;
  deleteCommunity: (id: number) => Promise<void>;
  clearError: () => void;
}

export const useCommunitiesStore = create<CommunitiesState>((set) => ({
  communities: [],
  currentCommunity: null,
  isLoading: false,
  error: null,

  fetchCommunities: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await communitiesApi.list();
      set({ communities: data.data, isLoading: false });
    } catch (err) {
      set({ error: "Failed to load communities", isLoading: false });
    }
  },

  fetchCommunityBySlug: async (slug) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await communitiesApi.getBySlug(slug);
      set({ currentCommunity: data.data, isLoading: false });
    } catch (err) {
      set({ error: "Failed to load community", isLoading: false });
    }
  },

  createCommunity: async (input) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await communitiesApi.create(input);
      set((s) => ({ communities: [...s.communities, data.data], isLoading: false }));
      return data.data;
    } catch (err) {
      set({ error: "Failed to create community", isLoading: false });
      return null;
    }
  },

  updateCommunity: async (id, input) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await communitiesApi.update(id, input);
      set((s) => ({
        communities: s.communities.map((c) => (c.id === id ? data.data : c)),
        currentCommunity: s.currentCommunity?.id === id ? data.data : s.currentCommunity,
        isLoading: false,
      }));
    } catch (err) {
      set({ error: "Failed to update community", isLoading: false });
    }
  },

  deleteCommunity: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await communitiesApi.delete(id);
      set((s) => ({
        communities: s.communities.filter((c) => c.id !== id),
        currentCommunity: s.currentCommunity?.id === id ? null : s.currentCommunity,
        isLoading: false,
      }));
    } catch (err) {
      set({ error: "Failed to delete community", isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
```

- [ ] **Step 3: Create `src/stores/enrollments.store.ts`**

```ts
import { create } from "zustand";
import { enrollmentsApi } from "@/services/api/enrollments.api";
import type { Enrollment } from "@/types/enrollment";

interface EnrollmentsState {
  enrollments: Enrollment[];
  isLoading: boolean;
  error: string | null;

  fetchEnrollments: () => Promise<void>;
  enroll: (courseId: number) => Promise<Enrollment | null>;
  clearError: () => void;
}

export const useEnrollmentsStore = create<EnrollmentsState>((set) => ({
  enrollments: [],
  isLoading: false,
  error: null,

  fetchEnrollments: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await enrollmentsApi.list();
      set({ enrollments: data.data, isLoading: false });
    } catch (err) {
      set({ error: "Failed to load enrollments", isLoading: false });
    }
  },

  enroll: async (courseId) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await enrollmentsApi.enroll({ courseId });
      set((s) => ({ enrollments: [...s.enrollments, data.data], isLoading: false }));
      return data.data;
    } catch (err) {
      set({ error: "Failed to enroll", isLoading: false });
      return null;
    }
  },

  clearError: () => set({ error: null }),
}));
```

- [ ] **Step 4: Verify TypeScript compilation**

```bash
npx tsc --noEmit
```

- [ ] **Step 5: Commit**

```bash
git add src/stores/courses.store.ts src/stores/communities.store.ts src/stores/enrollments.store.ts
git commit -m "[INFRA]: Add module stores (courses, communities, enrollments)"
```

---

### Task 9: Auth-Aware LandingPageHeader

**Files:**
- Modify: `src/components/LandingPageHeader.tsx`

**Interfaces:**
- Consumes: `useAuthStore` (Task 3)
- Produces: Auth-aware "Get Started" → "Go to Dashboard" CTA

- [ ] **Step 1: Edit `src/components/LandingPageHeader.tsx`**

**Find** the imported components section (top of file) and add:
```tsx
import { useAuthStore } from "@/stores/auth.store";
```

**Find** the `export default function LandingPageHeader()` line and add after the `const router = useRouter()` line:
```tsx
  const { isAuthenticated, user } = useAuthStore();
```

**Find** the desktop "Get Started" Button:
```tsx
          <Button
            className="hidden lg:inline-flex rounded-full bg-foreground text-background hover:bg-foreground/90 font-bold"
            onClick={() => router.push("/auth")}
          >
            Get Started
          </Button>
```

**Replace with:**
```tsx
          {isAuthenticated ? (
            <Button
              className="hidden lg:inline-flex rounded-full bg-foreground text-background hover:bg-foreground/90 font-bold"
              onClick={() => router.push(`/dashboard?role=${user?.role ?? "student"}`)}
            >
              Go to Dashboard
            </Button>
          ) : (
            <Button
              className="hidden lg:inline-flex rounded-full bg-foreground text-background hover:bg-foreground/90 font-bold"
              onClick={() => router.push("/auth")}
            >
              Get Started
            </Button>
          )}
```

**Find** the mobile "Get Started" Button (in the Sheet footer):
```tsx
                  <Button
                    className="w-full rounded-full bg-foreground text-background hover:bg-foreground/90 font-bold"
                    onClick={() => router.push("/auth")}
                  >
                    Get Started
                  </Button>
```

**Replace with:**
```tsx
                  {isAuthenticated ? (
                    <Button
                      className="w-full rounded-full bg-foreground text-background hover:bg-foreground/90 font-bold"
                      onClick={() => router.push(`/dashboard?role=${user?.role ?? "student"}`)}
                    >
                      Go to Dashboard
                    </Button>
                  ) : (
                    <Button
                      className="w-full rounded-full bg-foreground text-background hover:bg-foreground/90 font-bold"
                      onClick={() => router.push("/auth")}
                    >
                      Get Started
                    </Button>
                  )}
```

- [ ] **Step 2: Verify TypeScript compilation**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add src/components/LandingPageHeader.tsx
git commit -m "[FEATURE]: Add auth-aware header CTA (Get Started / Go to Dashboard)"
```

---

### Task 10: Dashboard Integration — AuthGuard Wrap + Student Dashboard Rewire

**Files:**
- Modify: `src/app/dashboard/layout.tsx`
- Modify: `src/app/dashboard/page.tsx`

**Interfaces:**
- Consumes: `AuthGuard` (Task 6), `useCoursesStore`, `useEnrollmentsStore` (Task 8)
- Produces: Protected dashboard layout, student dashboard with real data

- [ ] **Step 1: Edit `src/app/dashboard/layout.tsx`**

**Replace the entire file** with:
```tsx
"use client";

import { ThemeProvider } from "@/components/theme-provider";
import { AuthGuard } from "@/components/auth/AuthGuard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <AuthGuard>{children}</AuthGuard>
    </ThemeProvider>
  );
}
```

- [ ] **Step 2: Edit `src/app/dashboard/page.tsx` — wire courses**

**Find** the `continueLearning` hardcoded array (approx. line 80-100) and replace with store data.

Add imports at top:
```tsx
import { useCoursesStore } from "@/stores/courses.store";
import { useEnrollmentsStore } from "@/stores/enrollments.store";
```

In the `StudentDashboard()` function, add after the `useGSAP` block:
```tsx
  const { courses, fetchCourses, isLoading: coursesLoading } = useCoursesStore();
  const { enrollments, fetchEnrollments, isLoading: enrollmentsLoading } = useEnrollmentsStore();

  useEffect(() => {
    fetchCourses();
    fetchEnrollments();
  }, [fetchCourses, fetchEnrollments]);
```

**Replace the `continueLearning` array** with store-derived data. Wrap the Continue Learning section in a conditional that uses real `courses` when available, falling back to the hardcoded array when empty:

```tsx
const derivedContinueLearning = courses.length > 0
  ? courses.map((c) => ({
      id: c.id,
      title: c.title,
      instructor: "Instructor", // TODO: join with community/instructor data
      progress: 0,              // TODO: get from enrollment progress
      cover: `/images/course-placeholder.jpg`,
    }))
  : continueLearning; // fallback to hardcoded
```

**Note:** The enrollment-based progress and instructor name require cross-referencing enrollment data with course data. For this first pass, show courses with default values. The point is proving the pipeline works — instructor names and progress percentages can be refined in a follow-up.

- [ ] **Step 3: Verify TypeScript compilation**

```bash
npx tsc --noEmit
```

- [ ] **Step 4: Commit**

```bash
git add src/app/dashboard/layout.tsx src/app/dashboard/page.tsx
git commit -m "[FEATURE]: Wrap dashboard with AuthGuard, wire student dashboard to real course data"
```

---

## Execution Order

Tasks must be executed sequentially — each builds on the last:

```
Task 1 (deps/types) → Task 2 (BFF) → Task 3 (auth store) → Task 4 (api client)
                                                                   ↓
Task 5 (auth api) ←────────────────────────────────────────────────┘
   ↓
Task 6 (middleware + guard)
   ↓
Task 7 (module api services)
   ↓
Task 8 (module stores)
   ↓
Task 9 (header)
   ↓
Task 10 (dashboard integration)
```

Tasks 5 and 6 are independent of each other but both depend on Tasks 3 and 4.

---

## Verification Checklist (Post-Implementation)

After all tasks are complete, verify the full pipeline:

1. **`npx tsc --noEmit`** exits zero
2. **`npx biome check --write`** passes with no errors
3. Start the Hono backend: `cd ../hive-backend && npm run dev` (port 5000)
4. Start the Next.js frontend: `npm run dev` (port 3000)
5. Visit `http://localhost:3000/` — header shows "Get Started"
6. Navigate to `http://localhost:3000/dashboard` — redirected to `/auth`
7. Sign up a new student account — redirected to dashboard
8. Dashboard shows real course data (or empty state if no courses exist)
9. Refresh the page — still on dashboard (session check passes)
10. Navigate to `http://localhost:3000/` — header now shows "Go to Dashboard"
11. Click "Go to Dashboard" — navigates to dashboard with stored role
12. Logout — redirected to `/auth`, header shows "Get Started"
13. Visit `http://localhost:3000/dashboard` — redirected to `/auth`
