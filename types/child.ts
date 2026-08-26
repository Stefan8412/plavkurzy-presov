export type Gender = "male" | "female" | "other";

export type Child = {
  id: string;

  parentId: string;

  firstName: string;
  lastName: string;

  dateOfBirth: string;

  gender?: Gender;

  notes?: string;

  createdAt: string;
  updatedAt: string;
};
