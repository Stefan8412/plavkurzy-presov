export type CourseLevel = "beginner" | "intermediate" | "advanced";

export type CourseCategory = "children" | "adults" | "individual" | "camp";

export type CourseStatus = "available" | "full" | "closed";

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

  capacity: number;
  availableSpots: number;

  status: CourseStatus;

  image?: string;

  features: string[];
};
