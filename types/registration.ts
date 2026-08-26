export type RegistrationStatus =
  | "pending"
  | "confirmed"
  | "cancelled"
  | "completed";

export type Registration = {
  id: string;

  childId: string;
  courseTermId: string;

  status: RegistrationStatus;

  registeredAt: string;

  note?: string;
};
