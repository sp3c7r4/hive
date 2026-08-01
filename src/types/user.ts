export type Role = "instructor" | "student" | "parent" | "admin";

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  isAdmin: boolean;
  emailVerified: boolean;
}
