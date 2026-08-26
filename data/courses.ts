import type { Course } from "@/types/course";

export const courses: Course[] = [
  {
    id: "children-3-4-beginners",
    slug: "plavanie-3-4-roky-zaciatocnici",

    title: "Plávanie pre najmenších",
    description:
      "Hravé zoznámenie s vodou a základy plávania v bezpečnom prostredí.",

    category: "children",
    level: "beginner",

    ageMin: 3,
    ageMax: 4,

    location: {
      name: "Aquapark Delňa",
      address: "Prešov",
    },

    price: 150,
    currency: "EUR",

    lessonDurationMinutes: 45,
    numberOfLessons: 10,

    capacity: 8,
    availableSpots: 3,

    status: "available",

    features: ["Malé skupiny", "Skúsený tréner", "Hravá forma výučby"],
  },

  {
    id: "children-4-10-beginners",
    slug: "plavanie-4-10-roky-zaciatocnici",

    title: "Plávanie pre deti",
    description:
      "Základy plávania a postupné budovanie istoty vo vode pre deti od 4 rokov.",

    category: "children",
    level: "beginner",

    ageMin: 4,
    ageMax: 10,

    location: {
      name: "Aquapark Delňa",
      address: "Prešov",
    },

    price: 150,
    currency: "EUR",

    lessonDurationMinutes: 45,
    numberOfLessons: 10,

    capacity: 8,
    availableSpots: 5,

    status: "available",

    features: [
      "Malé skupiny",
      "Výučba základných techník",
      "Individuálny prístup",
    ],
  },

  {
    id: "children-10-plus-intermediate",
    slug: "plavanie-10-plus-pokrocili",

    title: "Plávanie 10+",
    description:
      "Zdokonaľovanie plaveckej techniky, kondície a sebavedomia vo vode.",

    category: "children",
    level: "intermediate",

    ageMin: 10,

    location: {
      name: "Aquapark Delňa",
      address: "Prešov",
    },

    price: 150,
    currency: "EUR",

    lessonDurationMinutes: 60,
    numberOfLessons: 10,

    capacity: 10,
    availableSpots: 0,

    status: "full",

    features: [
      "Zdokonaľovanie techniky",
      "Kondičné plávanie",
      "Skupinová výučba",
    ],
  },

  {
    id: "individual-swimming",
    slug: "individualne-plavanie",

    title: "Individuálne plávanie",
    description:
      "Individuálne lekcie prispôsobené schopnostiam a cieľom konkrétneho plavca.",

    category: "individual",
    level: "beginner",

    location: {
      name: "Aquapark Delňa",
      address: "Prešov",
    },

    price: 30,
    currency: "EUR",

    lessonDurationMinutes: 45,
    numberOfLessons: 1,

    capacity: 1,
    availableSpots: 1,

    status: "available",

    features: ["Individuálny tréning", "Flexibilný termín", "Osobný prístup"],
  },

  {
    id: "summer-camp",
    slug: "plavecky-tabor",

    title: "Plavecký tábor",
    description:
      "Letný plavecký tábor plný pohybu, zábavy a zdokonaľovania plaveckých schopností.",

    category: "camp",
    level: "beginner",

    ageMin: 6,
    ageMax: 14,

    location: {
      name: "Prešov",
    },

    price: 180,
    currency: "EUR",

    lessonDurationMinutes: 60,
    numberOfLessons: 5,

    capacity: 20,
    availableSpots: 7,

    status: "available",

    features: ["Plavecký tréning", "Denný program", "Skupinové aktivity"],
  },
];
