"use client";

import { useState } from "react";
import BrandPanel from "@/components/auth/BrandPanel";
import {
  LoginForm,
  SignUpForm,
  ForgotPasswordForm,
  VerifyOTPForm,
} from "@/components/auth/auth-forms";

type Screen = "login" | "signup" | "forgot-password" | "verify-otp";

export default function AuthPage() {
  const [screen, setScreen] = useState<Screen>("login");
  const [otpEmail, setOtpEmail] = useState<string>();

  const navigate = (next: string, email?: string) => {
    if (email) setOtpEmail(email);
    setScreen(next as Screen);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen">
      {/* Left: Brand panel */}
      <BrandPanel />

      {/* Right: Auth content */}
      <div className="flex items-center justify-center px-6 py-12 md:px-12 lg:px-16 bg-background">
        {screen === "login" && <LoginForm onNavigate={navigate} />}
        {screen === "signup" && <SignUpForm onNavigate={navigate} />}
        {screen === "forgot-password" && <ForgotPasswordForm onNavigate={navigate} />}
        {screen === "verify-otp" && <VerifyOTPForm email={otpEmail} onNavigate={navigate} />}
      </div>
    </div>
  );
}
