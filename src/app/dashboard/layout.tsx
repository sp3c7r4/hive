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
