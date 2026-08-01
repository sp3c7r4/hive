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
        if (err.response?.status === 401) {
          store.clear();
          window.location.replace("/auth");
        }
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
