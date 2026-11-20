export type Role = "user" | "admin";

export interface Usuario {
  id: number;
  username: string;
  full_name: string;
  email: string;
  role: Role;
  disabled: boolean;
  created_at: string;
}

export interface RegisterData {
  username: string;
  full_name: string;
  email: string;
  password: string;
}
