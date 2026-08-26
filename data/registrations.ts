import type { Registration } from "@/types/registration";

export const registrations: Registration[] = [
  {
    id: "registration-001",

    childId: "child-001",

    courseTermId: "term-children-4-10-mon-1600",

    status: "confirmed",

    registeredAt: "2026-08-21T12:30:00.000Z",
  },

  {
    id: "registration-002",

    childId: "child-002",

    courseTermId: "term-children-4-10-mon-1700",

    status: "pending",

    registeredAt: "2026-08-22T09:15:00.000Z",

    note: "Dieťa je úplný začiatočník.",
  },
];
