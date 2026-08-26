export type UserRole = "parent" | "admin" | "trainer";

export type User = {
  id: string;

  email: string;

  firstName: string;
  lastName: string;

  phone?: string;

  role: UserRole;

  createdAt: string;
  updatedAt: string;
};
