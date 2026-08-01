"use client";

const PAYSTACK_SCRIPT = "https://js.paystack.co/v1/inline.js";

let loadPromise: Promise<boolean> | null = null;

export function loadPaystack(): Promise<boolean> {
  if (loadPromise) return loadPromise;

  loadPromise = new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }

    const existing = document.querySelector(`script[src="${PAYSTACK_SCRIPT}"]`);
    if (existing) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = PAYSTACK_SCRIPT;
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      loadPromise = null;
      resolve(false);
    };
    document.head.appendChild(script);
  });

  return loadPromise;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
interface PaystackHandler {
  setup: (cfg: Record<string, unknown>) => { openIframe: () => void };
}

export interface PaystackConfig {
  key: string;
  email: string;
  amount: number;
  currency?: string;
  ref?: string;
  metadata?: Record<string, unknown>;
  onSuccess: (reference: string) => void;
  onClose: () => void;
}

export function openPaystackPopup(config: PaystackConfig) {
  const w = typeof window !== "undefined" ? (window as any) : null;
  const handler = w?.PaystackPop as PaystackHandler | undefined;

  if (!handler) {
    // Fallback: simulate Paystack popup
    setTimeout(() => {
      config.onSuccess(`sim_${Date.now()}`);
    }, 2000);
    return;
  }

  handler
    .setup({
      key: config.key,
      email: config.email,
      amount: config.amount,
      currency: config.currency ?? "NGN",
      ref: config.ref ?? `hive_${Date.now()}`,
      metadata: { custom_fields: [], ...config.metadata },
      callback: (response: { reference: string }) => {
        config.onSuccess(response.reference);
      },
      onClose: () => {
        config.onClose();
      },
    })
    .openIframe();
}
