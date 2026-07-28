"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { Mail01Icon, LockIcon, EyeIcon, EyeOffIcon } from "@hugeicons/core-free-icons";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      if (email === "admin@hive.ng" && password === "admin123") {
        localStorage.setItem("hive-role", "admin");
        window.location.href = "/dashboard?role=admin";
      } else {
        setError("Invalid admin credentials");
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6 py-12">
      {/* Card */}
      <div className="w-full max-w-[400px] rounded-2xl border border-border bg-card p-6 sm:p-8">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <Image src="/logo.svg" alt="Hive" width={44} height={46} className="shrink-0 mb-4" />
          <h1 className="text-lg font-bold">Admin Portal</h1>
          <p className="text-sm text-muted-foreground mt-1">Sign in to manage the platform</p>
        </div>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="admin-email">Email Address</Label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                <HugeiconsIcon icon={Mail01Icon} size={15} />
              </div>
              <Input
                id="admin-email"
                type="email"
                placeholder="admin@hive.ng"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-9 rounded-full text-sm"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="admin-password">Password</Label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                <HugeiconsIcon icon={LockIcon} size={15} />
              </div>
              <Input
                id="admin-password"
                type={showPw ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-9 pr-9 rounded-full text-sm"
                required
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                tabIndex={-1}
              >
                <HugeiconsIcon icon={showPw ? EyeOffIcon : EyeIcon} size={15} />
              </button>
            </div>
          </div>

          {error && (
            <p className="text-xs text-destructive text-center" role="alert">
              {error}
            </p>
          )}

          <Button type="submit" className="rounded-full w-full mt-1" disabled={loading}>
            {loading ? "Signing in…" : "Sign In"}
          </Button>
        </form>
      </div>

      {/* Demo hint */}
      <div className="mt-6 w-full max-w-[400px] p-3 rounded-xl bg-muted/30 border border-muted-foreground/10">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-2">
          Demo Admin Credentials
        </p>
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-muted-foreground font-mono text-[10px]">
            admin@hive.ng / admin123
          </span>
        </div>
      </div>

      {/* Back link */}
      <a
        href="/auth"
        className="mt-8 text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        ← Back to main login
      </a>
    </div>
  );
}
