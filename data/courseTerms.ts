import type { CourseTerm } from "@/types/course";

export const courseTerms: CourseTerm[] = [
  {
    id: "term-children-4-10-mon-1600",
    courseId: "children-4-10-beginners",

    dayOfWeek: "monday",

    startTime: "16:00",
    endTime: "16:45",

    startDate: "2026-09-07",
    endDate: "2026-11-09",

    capacity: 8,
    availableSpots: 5,

    trainerId: "trainer-001",
    trainerName: "Ján Novák",

    status: "available",
  },

  {
    id: "term-children-4-10-mon-1700",
    courseId: "children-4-10-beginners",

    dayOfWeek: "monday",

    startTime: "17:00",
    endTime: "17:45",

    startDate: "2026-09-07",
    endDate: "2026-11-09",

    capacity: 8,
    availableSpots: 2,

    trainerId: "trainer-002",
    trainerName: "Petra Nováková",

    status: "available",
  },

  {
    id: "term-children-4-10-wed-1600",
    courseId: "children-4-10-beginners",

    dayOfWeek: "wednesday",

    startTime: "16:00",
    endTime: "16:45",

    startDate: "2026-09-09",
    endDate: "2026-11-11",

    capacity: 8,
    availableSpots: 0,

    trainerId: "trainer-001",
    trainerName: "Ján Novák",

    status: "full",
  },
];
