const ROLE_KEY = "hive-role";

type Role = "instructor" | "student" | "parent" | "admin";

export function getStoredRole(): Role | null {
  if (typeof window === "undefined") return null;
  const v = localStorage.getItem(ROLE_KEY);
  return v === "instructor" ||
    v === "student" ||
    v === "parent" ||
    v === "admin"
    ? v
    : null;
}

export function setStoredRole(role: Role) {
  if (typeof window === "undefined") return;
  localStorage.setItem(ROLE_KEY, role);
}

export function getDashboardRole(searchParamsRole: string | null): Role {
  const fromUrl = searchParamsRole;
  if (
    fromUrl === "instructor" ||
    fromUrl === "student" ||
    fromUrl === "parent" ||
    fromUrl === "admin"
  ) {
    setStoredRole(fromUrl);
    return fromUrl;
  }
  const stored = getStoredRole();
  if (stored) return stored;
  return "student";
}
