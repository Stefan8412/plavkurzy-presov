import type { Child } from "@/types/child";

export const children: Child[] = [
  {
    id: "child-001",

    parentId: "parent-001",

    firstName: "Adam",
    lastName: "Novák",

    dateOfBirth: "2018-05-12",

    gender: "male",

    notes: "Začiatočník. Má rád hry vo vode.",

    createdAt: "2026-08-20T10:05:00.000Z",
    updatedAt: "2026-08-20T10:05:00.000Z",
  },

  {
    id: "child-002",

    parentId: "parent-001",

    firstName: "Sofia",
    lastName: "Nováková",

    dateOfBirth: "2021-02-18",

    gender: "female",

    notes: "",

    createdAt: "2026-08-20T10:06:00.000Z",
    updatedAt: "2026-08-20T10:06:00.000Z",
  },
];
