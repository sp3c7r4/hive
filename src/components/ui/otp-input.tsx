"use client";

import { useRef, useState, type KeyboardEvent, type ClipboardEvent } from "react";
import { cn } from "@/lib/utils";

function OTPInput({
  value,
  onChange,
  length = 6,
  disabled = false,
}: {
  value: string;
  onChange: (val: string) => void;
  length?: number;
  disabled?: boolean;
}) {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const [focused, setFocused] = useState<number | null>(null);

  const digits = value.replace(/\D/g, "").slice(0, length);

  const handleChange = (index: number, char: string) => {
    if (!/^\d?$/.test(char)) return;

    const chars = digits.split("");
    if (char) {
      chars[index] = char;
    } else {
      chars.splice(index, 1);
    }

    const next = chars.join("").slice(0, length);
    onChange(next);

    // Auto-focus next
    if (char && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
    if (e.key === "ArrowRight" && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    onChange(pasted);
    if (pasted.length < length) {
      inputsRef.current[pasted.length]?.focus();
    } else {
      inputsRef.current[length - 1]?.focus();
    }
  };

  return (
    <div className="flex items-center gap-2.5 justify-center" dir="ltr">
      {Array.from({ length }).map((_, i) => {
        const active = i === focused;
        const filled = !!digits[i];
        return (
          <input
            key={i}
            ref={(el) => { inputsRef.current[i] = el; }}
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={1}
            disabled={disabled}
            value={digits[i] || ""}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={handlePaste}
            onFocus={() => setFocused(i)}
            onBlur={() => setFocused(null)}
            className={cn(
              "w-12 h-12 shrink-0 text-center text-lg font-semibold outline-none transition-colors",
              "border-2 rounded-lg",
              active
                ? "border-foreground bg-transparent"
                : filled
                  ? "border-border bg-muted/50"
                  : "border-border bg-transparent",
              disabled && "opacity-50 cursor-not-allowed"
            )}
          />
        );
      })}
    </div>
  );
}

export { OTPInput };
