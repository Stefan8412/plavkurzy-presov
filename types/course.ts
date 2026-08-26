export type CourseLevel = "beginner" | "intermediate" | "advanced";

export type CourseCategory = "children" | "adults" | "individual" | "camp";

export type CourseStatus = "available" | "full" | "closed";

export type DayOfWeek =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export type Course = {
  id: string;
  slug: string;

  title: string;
  description: string;

  category: CourseCategory;
  level: CourseLevel;

  ageMin?: number;
  ageMax?: number;

  location: {
    name: string;
    address?: string;
  };

  price: number;
  currency: "EUR";

  lessonDurationMinutes: number;
  numberOfLessons: number;

  status: CourseStatus;

  image?: string;

  features: string[];
};

export type CourseTerm = {
  id: string;
  courseId: string;

  dayOfWeek: DayOfWeek;

  startTime: string;
  endTime: string;

  startDate: string;
  endDate: string;

  capacity: number;
  availableSpots: number;

  trainerId?: string;
  trainerName?: string;

  status: "available" | "full" | "closed";
};
