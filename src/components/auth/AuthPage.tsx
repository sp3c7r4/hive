"use client";

import { useState } from "react";
import {
  ForgotPasswordForm,
  LoginForm,
  ResetPasswordForm,
  SignUpForm,
  VerifyOTPForm,
} from "@/components/auth/auth-forms";
import BrandPanel from "@/components/auth/BrandPanel";

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
    message?: string,
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

      <div className="flex items-center justify-center px-6 py-12 md:px-12 lg:px-16 bg-background relative">
        <div className="w-full max-w-md">
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

          {/* Demo credentials */}
          {/*{screen === "login" && (
          <div className="mt-6 p-4 rounded-xl bg-muted/30 border border-muted-foreground/10">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-3">
              Demo Credentials
            </p>
            <div className="space-y-1.5 text-[11px]">
              {[
                { role: "Student", email: "chioma@hive.ng", pass: "student123" },
                { role: "Instructor", email: "ade@hive.ng", pass: "instructor123" },
                { role: "Parent", email: "ngozi@hive.ng", pass: "parent123" },
              ].map((c) => (
                <div key={c.role} className="flex items-center justify-between">
                  <span className="font-medium">{c.role}</span>
                  <span className="text-muted-foreground font-mono text-[10px]">
                    {c.email} / {c.pass}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-3 pt-3 border-t border-border text-[10px] text-muted-foreground leading-relaxed">
              Admin?{" "}
              <a href="/admin/login" className="text-primary font-medium hover:underline">
                Sign in on the admin portal
              </a>
            </p>
          </div>
        )}*/}
        </div>
      </div>
    </div>
  );
}
