import {
  Backpack03Icon,
  CanvasIcon,
  CheckmarkCircle02Icon,
  ChevronLeftIcon,
  EyeIcon,
  EyeOffIcon,
  LockIcon,
  Mail01Icon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Image from "next/image";
import {
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { OTPInput } from "@/components/ui/otp-input";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Field error                                                       */
/* ------------------------------------------------------------------ */
function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="text-xs text-destructive mt-1" role="alert">
      {message}
    </p>
  );
}

/* ------------------------------------------------------------------ */
/*  Validation helpers                                                */
/* ------------------------------------------------------------------ */
const validators = {
  required: (v: string) => (v.trim() ? null : "This field is required"),
  email: (v: string) => {
    if (!v.trim()) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v))
      return "Enter a valid email address";
    return null;
  },
  password: (v: string) => {
    if (!v) return "Password is required";
    if (v.length < 8) return "Password must be at least 8 characters";
    return null;
  },
  name: (v: string) => {
    if (!v.trim()) return "This field is required";
    if (v.trim().length < 2) return "Must be at least 2 characters";
    return null;
  },
};

type Errors = Record<string, string | null>;

/* ------------------------------------------------------------------ */
/*  Role selector                                                     */
/* ------------------------------------------------------------------ */
type Role = "instructor" | "student" | "parent";

const roles = [
  { id: "instructor" as const, label: "Instructor", icon: CanvasIcon },
  { id: "student" as const, label: "Student", icon: Backpack03Icon },
  { id: "parent" as const, label: "Parent", icon: UserGroupIcon },
];

function RoleSelector({
  value,
  onChange,
}: {
  value: Role | null;
  onChange: (role: Role) => void;
}) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {roles.map((role) => {
        const active = value === role.id;
        return (
          <button
            key={role.id}
            type="button"
            onClick={() => onChange(role.id)}
            className={cn(
              "flex flex-col items-center justify-center gap-3 border py-5 px-3 transition-all duration-150",
              active
                ? "border-foreground/25 bg-muted shadow-sm"
                : "border-transparent bg-muted/60 hover:bg-muted hover:border-border",
            )}
          >
            <HugeiconsIcon
              icon={role.icon}
              size={22}
              className={active ? "text-foreground" : "text-muted-foreground"}
            />
            <span
              className={cn(
                "text-xs font-medium",
                active ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {role.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

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
function PasswordInput({
  className,
  ...props
}: React.ComponentProps<typeof Input>) {
  const [show, setShow] = useState(false);

  return (
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
        <HugeiconsIcon icon={LockIcon} size={16} />
      </div>
      <Input
        type={show ? "text" : "password"}
        className={cn("pl-10 pr-10", className)}
        {...props}
      />
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
function FooterLink({
  text,
  linkText,
  onClick,
}: {
  text: string;
  linkText: string;
  onClick: () => void;
}) {
  return (
    <p className="text-center text-sm text-muted-foreground">
      {text}{" "}
      <button
        type="button"
        onClick={onClick}
        className="text-primary font-medium hover:underline"
      >
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
      <div className="mb-6">
        <Image src="/logo.svg" alt="Hive" width={56} height={62} />
      </div>
      <h1 className="text-2xl font-bold text-foreground">{title}</h1>
      <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Login Form                                                        */
/* ------------------------------------------------------------------ */
function LoginForm({
  onNavigate,
  message,
}: {
  onNavigate: (
    screen: string,
    email?: string,
    role?: string,
    message?: string,
  ) => void;
  message?: string;
}) {
  const [role, setRole] = useState<Role | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const validate = () => {
    const errs: Errors = {
      role: !role ? "Please select your role" : null,
      email: validators.email(email),
      password: validators.password(password),
    };
    setErrors(errs);
    return !errs.role && !errs.email && !errs.password;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setLoginError(null);

    if (!validate()) return;

    setLoggingIn(true);

    // Simulate authentication
    setTimeout(() => {
      setLoggingIn(false);
      // Demo: reject if email is "wrong@test.com"
      if (email === "wrong@test.com") {
        setLoginError("Invalid email or password");
        return;
      }
      // Success: redirect to dashboard
      document.cookie = `hive-role=${role || "student"}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
      localStorage.setItem("hive-role", role || "student");
      window.location.href = `/dashboard?role=${role || "student"}`;
    }, 1200);
  };

  return (
    <div className="w-full max-w-[400px] mx-auto">
      <AuthHeading title="Login" subtitle="Please login to your account" />

      {message && (
        <div className="mb-6 flex items-center gap-3 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/30 px-4 py-3 shadow-sm">
          <div className="size-6 flex items-center justify-center shrink-0 rounded-full bg-emerald-100 dark:bg-emerald-900/50">
            <HugeiconsIcon
              icon={CheckmarkCircle02Icon}
              size={14}
              className="text-emerald-600 dark:text-emerald-300"
            />
          </div>
          <p className="text-sm text-emerald-700 dark:text-emerald-300">
            {message}
          </p>
        </div>
      )}

      <form className="flex flex-col gap-5" onSubmit={handleSubmit} noValidate>
        <div>
          <Label className="mb-2 block">I&apos;m signing in as a</Label>
          <RoleSelector
            value={role}
            onChange={(r) => {
              setRole(r);
              if (submitted) validate();
            }}
          />
          <FieldError
            message={submitted ? (errors.role ?? undefined) : undefined}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="login-email">Email Address</Label>
          <IconInput
            id="login-email"
            icon={<HugeiconsIcon icon={Mail01Icon} size={16} />}
            placeholder="Enter your email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (submitted) validate();
            }}
            aria-invalid={submitted && !!errors.email ? true : undefined}
          />
          <FieldError
            message={submitted ? (errors.email ?? undefined) : undefined}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="login-password">Password</Label>
          <PasswordInput
            id="login-password"
            placeholder="Enter your password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (submitted) validate();
            }}
            aria-invalid={submitted && !!errors.password ? true : undefined}
          />
          <FieldError
            message={submitted ? (errors.password ?? undefined) : undefined}
          />
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
            <Checkbox
              checked={remember}
              onCheckedChange={(c) => setRemember(!!c)}
            />
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

        {loginError && (
          <p className="text-xs text-destructive text-center" role="alert">
            {loginError}
          </p>
        )}

        <Button
          type="submit"
          className="w-full rounded-full"
          size="lg"
          disabled={loggingIn}
        >
          {loggingIn ? "Signing in..." : "Login"}
        </Button>
      </form>

      <div className="mt-8 flex flex-col gap-5">
        <OrDivider />
        <SocialButtons />
      </div>

      <div className="mt-8">
        <FooterLink
          text="Don't have an account?"
          linkText="Sign up"
          onClick={() => onNavigate("signup")}
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Sign Up Form                                                      */
/* ------------------------------------------------------------------ */
function SignUpForm({
  onNavigate,
}: {
  onNavigate: (screen: string, email?: string, role?: string) => void;
}) {
  const [role, setRole] = useState<Role | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);

  const runValidation = () => {
    const errs: Errors = {
      role: !role ? "Please select your role" : null,
      firstName: validators.name(firstName),
      lastName: validators.name(lastName),
      email: validators.email(email),
      password: validators.password(password),
      terms: !agreed ? "You must agree to the terms and conditions" : null,
    };
    setErrors(errs);
    return Object.values(errs).every((e) => !e);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (runValidation()) {
      onNavigate("verify-otp", email, role ?? undefined);
    }
  };

  return (
    <div className="w-full max-w-[400px] mx-auto">
      <AuthHeading
        title="Sign Up"
        subtitle="Let&apos;s keep it quick, just 2 steps and you&apos;re in"
      />

      <div className="h-1 w-full bg-muted rounded-full mb-8">
        <div className="h-full w-1/2 bg-primary rounded-full transition-all" />
      </div>

      <form className="flex flex-col gap-5" onSubmit={handleSubmit} noValidate>
        <div>
          <Label className="mb-2 block">I&apos;m signing up as a</Label>
          <RoleSelector
            value={role}
            onChange={(r) => {
              setRole(r);
              if (submitted) runValidation();
            }}
          />
          <FieldError
            message={submitted ? (errors.role ?? undefined) : undefined}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="signup-firstname">First Name</Label>
            <Input
              id="signup-firstname"
              placeholder="John"
              autoComplete="given-name"
              value={firstName}
              onChange={(e) => {
                setFirstName(e.target.value);
                if (submitted) runValidation();
              }}
              aria-invalid={submitted && !!errors.firstName ? true : undefined}
            />
            <FieldError
              message={submitted ? (errors.firstName ?? undefined) : undefined}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="signup-lastname">Last Name</Label>
            <Input
              id="signup-lastname"
              placeholder="Doe"
              autoComplete="family-name"
              value={lastName}
              onChange={(e) => {
                setLastName(e.target.value);
                if (submitted) runValidation();
              }}
              aria-invalid={submitted && !!errors.lastName ? true : undefined}
            />
            <FieldError
              message={submitted ? (errors.lastName ?? undefined) : undefined}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="signup-email">Email Address</Label>
          <IconInput
            id="signup-email"
            icon={<HugeiconsIcon icon={Mail01Icon} size={16} />}
            placeholder="Enter your email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (submitted) runValidation();
            }}
            aria-invalid={submitted && !!errors.email ? true : undefined}
          />
          <FieldError
            message={submitted ? (errors.email ?? undefined) : undefined}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="signup-password">Password</Label>
          <PasswordInput
            id="signup-password"
            placeholder="Create a password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (submitted) runValidation();
            }}
            aria-invalid={submitted && !!errors.password ? true : undefined}
          />
          <FieldError
            message={submitted ? (errors.password ?? undefined) : undefined}
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
            <Checkbox
              checked={agreed}
              onCheckedChange={(c) => {
                setAgreed(!!c);
                if (submitted) runValidation();
              }}
            />
            I agree with{" "}
            <button
              type="button"
              className="text-primary font-medium underline"
            >
              terms and conditions
            </button>
          </label>
          <FieldError
            message={submitted ? (errors.terms ?? undefined) : undefined}
          />
        </div>

        <Button type="submit" className="w-full rounded-full" size="lg">
          Sign Up
        </Button>
      </form>

      <div className="mt-8 flex flex-col gap-5">
        <OrDivider />
        <SocialButtons />
      </div>

      <div className="mt-8">
        <FooterLink
          text="Have an account?"
          linkText="Sign in"
          onClick={() => onNavigate("login")}
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Forgot Password Form                                              */
/* ------------------------------------------------------------------ */
function ForgotPasswordForm({
  onNavigate,
}: {
  onNavigate: (screen: string, email?: string, role?: string) => void;
}) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fieldError, setFieldError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) {
      setFieldError("Please select your role");
      return;
    }
    const err = validators.email(email);
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    setFieldError(null);
    onNavigate("verify-otp", email, role ?? undefined);
  };

  return (
    <div className="w-full max-w-[400px] mx-auto">
      <BackButton onClick={() => onNavigate("login")} />

      <div className="mb-6">
        <Image src="/logo.svg" alt="Hive" width={56} height={62} />
      </div>

      <div className="mb-8">
        <p className="text-sm text-muted-foreground font-medium uppercase tracking-wide">
          Forgot
        </p>
        <h1 className="text-2xl font-bold text-foreground mt-1">
          Forgot Password?
        </h1>
      </div>

      <p className="text-sm text-muted-foreground leading-relaxed mb-8">
        Don&apos;t worry! It happens. Select your role and enter the email
        address associated with your account.
      </p>

      <form className="flex flex-col gap-5" onSubmit={handleSubmit} noValidate>
        <div className="flex flex-col gap-2">
          <Label className="text-sm font-medium">I am a...</Label>
          <RoleSelector
            value={role}
            onChange={(r) => {
              setRole(r);
              if (fieldError) setFieldError(null);
            }}
          />
          {fieldError && (
            <p className="text-xs text-destructive">{fieldError}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="forgot-email">Email Address</Label>
          <IconInput
            id="forgot-email"
            icon={<HugeiconsIcon icon={Mail01Icon} size={16} />}
            placeholder="Enter your email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError(null);
            }}
            aria-invalid={error ? true : undefined}
          />
          <FieldError message={error ?? undefined} />
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
function VerifyOTPForm({
  email,
  source,
  role,
  onNavigate,
}: {
  email?: string;
  source: "signup" | "forgot-password";
  role?: string;
  onNavigate: (
    screen: string,
    email?: string,
    role?: string,
    message?: string,
  ) => void;
}) {
  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(60);
  const [error, setError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const displayEmail = email || "your email";

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const handleResend = () => {
    setCountdown(60);
    setError(null);
    setOtp("");
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 6) {
      setError("Please enter the full 6-digit code");
      return;
    }

    setVerifying(true);
    setError(null);

    // Simulate API verification
    setTimeout(() => {
      // For demo: accept any 6-digit code except "000000"
      if (otp === "000000") {
        setError("Invalid code. Please check and try again.");
        setVerifying(false);
      } else if (source === "forgot-password") {
        onNavigate("reset-password");
        setVerifying(false);
      } else {
        window.location.href = `/onboarding?role=${role || "student"}`;
      }
    }, 1000);
  };

  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;
  const timeStr = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  const backTo = source === "signup" ? "signup" : "forgot-password";

  return (
    <div className="w-full max-w-[400px] mx-auto">
      <BackButton onClick={() => onNavigate(backTo)} />

      <div className="mb-6">
        <Image src="/logo.svg" alt="Hive" width={56} height={62} />
      </div>

      <>
        <div className="mb-8">
          <p className="text-sm text-muted-foreground font-medium uppercase tracking-wide">
            {source === "signup" ? "Step 2 of 2" : "Verify"}
          </p>
          <h1 className="text-2xl font-bold text-foreground mt-1">Enter OTP</h1>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed mb-8">
          A 6-digit OTP has been sent to{" "}
          <span className="font-semibold text-foreground">{displayEmail}</span>
        </p>

        <form
          className="flex flex-col gap-5"
          onSubmit={handleVerify}
          noValidate
        >
          <div className="flex justify-center">
            <OTPInput
              length={6}
              value={otp}
              onChange={(val) => {
                setOtp(val);
                if (error) setError(null);
              }}
              disabled={verifying}
            />
          </div>

          {error && (
            <p className="text-xs text-destructive text-center" role="alert">
              {error}
            </p>
          )}

          <Button
            type="submit"
            className="w-full rounded-full"
            size="lg"
            disabled={verifying}
          >
            {verifying ? "Verifying..." : "Verify"}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          {countdown > 0 ? (
            <>Resend code ({timeStr})</>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              className="text-primary font-medium hover:underline"
            >
              Resend code
            </button>
          )}
        </p>
      </>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Reset Password Form                                              */
/* ------------------------------------------------------------------ */

function passwordStrength(pw: string): {
  label: string;
  score: 0 | 1 | 2 | 3 | 4;
} {
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const labels = ["Too weak", "Weak", "Fair", "Strong", "Very strong"];
  return {
    label: labels[score] ?? "Weak",
    score: Math.min(score, 4) as 0 | 1 | 2 | 3 | 4,
  };
}

function ResetPasswordForm({
  email,
  role,
  onNavigate,
}: {
  email?: string;
  role?: string;
  onNavigate: (
    screen: string,
    email?: string,
    role?: string,
    message?: string,
  ) => void;
}) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [resetting, setResetting] = useState(false);

  const strength = passwordStrength(password);
  const barWidth =
    strength.score === 0
      ? "w-0"
      : strength.score === 1
        ? "w-1/4"
        : strength.score === 2
          ? "w-2/4"
          : strength.score === 3
            ? "w-3/4"
            : "w-full";
  const barColor =
    strength.score <= 1
      ? "bg-destructive"
      : strength.score === 2
        ? "bg-amber-500"
        : "bg-emerald-500";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    setResetting(true);
    setError(null);

    // Simulate password reset
    setTimeout(() => {
      setResetting(false);
      onNavigate(
        "login",
        undefined,
        undefined,
        "Your password has been reset. Sign in below.",
      );
    }, 1200);
  };

  return (
    <div className="w-full max-w-[400px] mx-auto">
      <BackButton onClick={() => onNavigate("verify-otp")} />

      <div className="mb-6">
        <Image src="/logo.svg" alt="Hive" width={56} height={62} />
      </div>

      <div className="mb-8">
        <p className="text-sm text-muted-foreground font-medium uppercase tracking-wide">
          Reset
        </p>
        <h1 className="text-2xl font-bold text-foreground mt-1">
          Set New Password
        </h1>
      </div>

      <p className="text-sm text-muted-foreground leading-relaxed mb-8">
        {email ? (
          <>
            Create a new password for{" "}
            <span className="font-semibold text-foreground">{email}</span>
          </>
        ) : (
          "Create a new password for your account."
        )}
      </p>

      <form className="flex flex-col gap-5" onSubmit={handleSubmit} noValidate>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="reset-password">New Password</Label>
          <PasswordInput
            id="reset-password"
            placeholder="Create a strong password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (error) setError(null);
            }}
          />
          {/* Strength indicator */}
          {password.length > 0 && (
            <div className="mt-1.5">
              <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-300",
                    barWidth,
                    barColor,
                  )}
                />
              </div>
              <p
                className={cn(
                  "text-xs mt-1",
                  strength.score <= 1
                    ? "text-destructive"
                    : strength.score === 2
                      ? "text-amber-500"
                      : "text-emerald-500",
                )}
              >
                {strength.label}
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="reset-confirm">Confirm Password</Label>
          <PasswordInput
            id="reset-confirm"
            placeholder="Re-enter your password"
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => {
              setConfirm(e.target.value);
              if (error) setError(null);
            }}
          />
        </div>

        {error && (
          <p className="text-xs text-destructive text-center" role="alert">
            {error}
          </p>
        )}

        <Button
          type="submit"
          className="w-full rounded-full"
          size="lg"
          disabled={resetting}
        >
          {resetting ? "Resetting..." : "Reset Password"}
        </Button>
      </form>
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
  ResetPasswordForm,
  BackButton,
  OrDivider,
  SocialButtons,
  FooterLink,
  AuthHeading,
  IconInput,
  PasswordInput,
};
