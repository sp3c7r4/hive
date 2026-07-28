const KEYS = {
  onboarding: (role: string) => `hive_onboarding_${role}`,
};

export function saveOnboarding(role: string, data: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEYS.onboarding(role), JSON.stringify(data));
}

export function loadOnboarding(role: string): Record<string, unknown> | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(KEYS.onboarding(role));
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function clearOnboarding(role: string) {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEYS.onboarding(role));
}
