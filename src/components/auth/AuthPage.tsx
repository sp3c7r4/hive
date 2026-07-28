"use client";

import { useState } from "react";
import BrandPanel from "@/components/auth/BrandPanel";
import {
  LoginForm,
  SignUpForm,
  ForgotPasswordForm,
  VerifyOTPForm,
  ResetPasswordForm,
} from "@/components/auth/auth-forms";

type Screen =
  | "login"
  | "signup"
  | "forgot-password"
  | "verify-otp"
  | "reset-password";
type OtpSource = "signup" | "forgot-password";
type Role = "instructor" | "student" | "parent";

export default function AuthPage() {
  const [screen, setScreen] = useState<Screen>("login");
  const [otpEmail, setOtpEmail] = useState<string>();
  const [otpSource, setOtpSource] = useState<OtpSource>("forgot-password");
  const [signupRole, setSignupRole] = useState<Role>();
  const [forgotRole, setForgotRole] = useState<Role>();
  const [loginMessage, setLoginMessage] = useState<string>();

  const navigate = (
    next: string,
    email?: string,
    role?: string,
    message?: string
  ) => {
    if (email) setOtpEmail(email);
    if (role) {
      if (screen === "signup") setSignupRole(role as Role);
      else if (screen === "forgot-password") setForgotRole(role as Role);
    }

    if (next === "verify-otp") {
      setOtpSource(screen === "signup" ? "signup" : "forgot-password");
    }

    if (next === "login" && message) {
      setLoginMessage(message);
    }

    setScreen(next as Screen);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen">
      <BrandPanel />

      <div className="flex items-center justify-center px-6 py-12 md:px-12 lg:px-16 bg-background">
        {screen === "login" && (
          <LoginForm onNavigate={navigate} message={loginMessage} />
        )}
        {screen === "signup" && <SignUpForm onNavigate={navigate} />}
        {screen === "forgot-password" && (
          <ForgotPasswordForm onNavigate={navigate} />
        )}
        {screen === "verify-otp" && (
          <VerifyOTPForm
            email={otpEmail}
            source={otpSource}
            role={signupRole || forgotRole}
            onNavigate={navigate}
          />
        )}
        {screen === "reset-password" && (
          <ResetPasswordForm
            email={otpEmail}
            role={forgotRole}
            onNavigate={navigate}
          />
        )}
      </div>
    </div>
  );
}
