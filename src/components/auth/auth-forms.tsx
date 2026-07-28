"use client";

import { type ReactNode, useState, useCallback, useRef, useEffect } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Mail01Icon, LockIcon, EyeIcon, EyeOffIcon, ChevronLeftIcon } from "@hugeicons/core-free-icons";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

import Image from "next/image";

/* ------------------------------------------------------------------ */
/*  Shared: Icon Input wrapper                                        */
/* ------------------------------------------------------------------ */
function IconInput({
  icon,
  className,
  children,
  ...props
}: React.ComponentProps<typeof Input> & { icon: ReactNode }) {
  return (
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
        {icon}
      </div>
      <Input className={cn("pl-10", className)} {...props} />
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Shared: Password Input with show/hide toggle                      */
/* ------------------------------------------------------------------ */
function PasswordInput({ className, ...props }: React.ComponentProps<typeof Input>) {
  const [show, setShow] = useState(false);

  return (
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
        <HugeiconsIcon icon={LockIcon} size={16} />
      </div>
      <Input type={show ? "text" : "password"} className={cn("pl-10 pr-10", className)} {...props} />
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className="absolute right-1 top-1/2 -translate-y-1/2"
        onClick={() => setShow((s) => !s)}
        aria-label={show ? "Hide password" : "Show password"}
      >
        <HugeiconsIcon icon={show ? EyeOffIcon : EyeIcon} size={16} />
      </Button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Shared: Or divider                                                 */
/* ------------------------------------------------------------------ */
function OrDivider() {
  return (
    <div className="flex items-center gap-3">
      <Separator className="flex-1" />
      <span className="text-xs text-muted-foreground font-medium">Or</span>
      <Separator className="flex-1" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Shared: Social buttons                                            */
/* ------------------------------------------------------------------ */
function SocialButtons() {
  return (
    <div className="flex flex-col gap-3">
      <Button variant="outline" className="w-full rounded-full" size="lg">
        <Image src="/icons/google.svg" alt="Google" width={18} height={18} />
        Continue with Google
      </Button>
      <Button variant="outline" className="w-full rounded-full" size="lg">
        <Image src="/icons/apple.svg" alt="Apple" width={18} height={18} />
        Continue with Apple
      </Button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Shared: Back button                                               */
/* ------------------------------------------------------------------ */
function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <Button variant="ghost" size="icon-sm" className="mb-6" onClick={onClick}>
      <HugeiconsIcon icon={ChevronLeftIcon} size={20} />
      <span className="sr-only">Back</span>
    </Button>
  );
}

/* ------------------------------------------------------------------ */
/*  Shared: Footer switch link                                        */
/* ------------------------------------------------------------------ */
function FooterLink({ text, linkText, onClick }: { text: string; linkText: string; onClick: () => void }) {
  return (
    <p className="text-center text-sm text-muted-foreground">
      {text}{" "}
      <button type="button" onClick={onClick} className="text-primary font-medium hover:underline">
        {linkText}
      </button>
    </p>
  );
}

/* ------------------------------------------------------------------ */
/*  Shared: Auth heading                                               */
/* ------------------------------------------------------------------ */
function AuthHeading({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-8">
      <h1 className="text-2xl font-bold text-foreground">{title}</h1>
      <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Login Form                                                        */
/* ------------------------------------------------------------------ */
function LoginForm({ onNavigate }: { onNavigate: (screen: string) => void }) {
  return (
    <div className="w-full max-w-[400px] mx-auto">
      <AuthHeading title="Login" subtitle="Please login to your account" />

      <form className="flex flex-col gap-5" onSubmit={(e) => e.preventDefault()}>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="login-email">Email Address</Label>
          <IconInput
            id="login-email"
            icon={<HugeiconsIcon icon={Mail01Icon} size={16} />}
            placeholder="Enter your email"
            type="email"
            autoComplete="email"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="login-password">Password</Label>
          <PasswordInput id="login-password" placeholder="Enter your password" autoComplete="current-password" />
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
            <Checkbox />
            Remember me
          </label>
          <button
            type="button"
            onClick={() => onNavigate("forgot-password")}
            className="text-sm text-primary font-medium hover:underline"
          >
            Forgot password?
          </button>
        </div>

        <Button type="submit" className="w-full rounded-full" size="lg">
          Login
        </Button>
      </form>

      <div className="mt-8 flex flex-col gap-5">
        <OrDivider />
        <SocialButtons />
      </div>

      <div className="mt-8">
        <FooterLink text="Don't have an account?" linkText="Sign up" onClick={() => onNavigate("signup")} />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Sign Up Form                                                      */
/* ------------------------------------------------------------------ */
function SignUpForm({ onNavigate }: { onNavigate: (screen: string) => void }) {
  return (
    <div className="w-full max-w-[400px] mx-auto">
      <AuthHeading title="Sign Up" subtitle="Let&apos;s keep it quick, just 2 steps and you&apos;re in" />

      {/* Progress bar */}
      <div className="h-1 w-full bg-muted rounded-full mb-8">
        <div className="h-full w-1/2 bg-primary rounded-full transition-all" />
      </div>

      <form className="flex flex-col gap-5" onSubmit={(e) => e.preventDefault()}>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="signup-email">Email Address</Label>
          <IconInput
            id="signup-email"
            icon={<HugeiconsIcon icon={Mail01Icon} size={16} />}
            placeholder="Enter your email"
            type="email"
            autoComplete="email"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="signup-password">Password</Label>
          <PasswordInput id="signup-password" placeholder="Create a password" autoComplete="new-password" />
        </div>

        <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
          <Checkbox />
          I agree with{" "}
          <button type="button" className="text-primary font-medium underline">
            terms and conditions
          </button>
        </label>

        <Button type="submit" className="w-full rounded-full" size="lg">
          Sign Up
        </Button>
      </form>

      <div className="mt-8 flex flex-col gap-5">
        <OrDivider />
        <SocialButtons />
      </div>

      <div className="mt-8">
        <FooterLink text="Have an account?" linkText="Sign in" onClick={() => onNavigate("login")} />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Forgot Password Form                                              */
/* ------------------------------------------------------------------ */
function ForgotPasswordForm({ onNavigate }: { onNavigate: (screen: string, email?: string) => void }) {
  const [email, setEmail] = useState("");

  return (
    <div className="w-full max-w-[400px] mx-auto">
      <BackButton onClick={() => onNavigate("login")} />

      <div className="mb-8">
        <p className="text-sm text-muted-foreground font-medium uppercase tracking-wide">Forgot</p>
        <h1 className="text-2xl font-bold text-foreground mt-1">Forgot Password?</h1>
      </div>

      <p className="text-sm text-muted-foreground leading-relaxed mb-8">
        Don&apos;t worry! It happens. Please enter the email address associated with your account.
      </p>

      <form className="flex flex-col gap-5" onSubmit={(e) => { e.preventDefault(); onNavigate("verify-otp", email); }}>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="forgot-email">Email Address</Label>
          <IconInput
            id="forgot-email"
            icon={<HugeiconsIcon icon={Mail01Icon} size={16} />}
            placeholder="Enter your email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <Button type="submit" className="w-full rounded-full" size="lg">
          Get OTP
        </Button>
      </form>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Verify OTP Form                                                   */
/* ------------------------------------------------------------------ */
function VerifyOTPForm({ email, onNavigate }: { email?: string; onNavigate: (screen: string) => void }) {
  const [countdown, setCountdown] = useState(49);
  const displayEmail = email || "your email";

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;
  const timeStr = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  return (
    <div className="w-full max-w-[400px] mx-auto">
      <BackButton onClick={() => onNavigate("forgot-password")} />

      <div className="mb-8">
        <p className="text-sm text-muted-foreground font-medium uppercase tracking-wide">Verify</p>
        <h1 className="text-2xl font-bold text-foreground mt-1">Enter OTP</h1>
      </div>

      <p className="text-sm text-muted-foreground leading-relaxed mb-8">
        A 4 digit OTP has been sent to{" "}
        <span className="font-semibold text-foreground">{displayEmail}</span>
      </p>

      <form className="flex flex-col gap-5" onSubmit={(e) => e.preventDefault()}>
        <div className="flex justify-center">
          <InputOTP maxLength={4}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
            </InputOTPGroup>
          </InputOTP>
        </div>

        <Button type="submit" className="w-full rounded-full" size="lg">
          Verify
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground mt-6">
        {countdown > 0 ? (
          <>Resend OTP ({timeStr})</>
        ) : (
          <button type="button" className="text-primary font-medium hover:underline">
            Resend OTP
          </button>
        )}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Exports                                                           */
/* ------------------------------------------------------------------ */
export {
  LoginForm,
  SignUpForm,
  ForgotPasswordForm,
  VerifyOTPForm,
  BackButton,
  OrDivider,
  SocialButtons,
  FooterLink,
  AuthHeading,
  IconInput,
  PasswordInput,
};
