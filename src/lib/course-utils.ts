import type { CourseReview } from "@/components/reviews/types";

/* ---------------------------------------------------------------- */
/*  Shared course catalogue — single source of truth                */
/* ---------------------------------------------------------------- */

export type CourseVisibility = "public" | "private";
export type CourseDifficulty = "beginner" | "intermediate" | "advanced";
export type LessonType = "video" | "pdf" | "live" | "quiz" | "assignment";

export type CourseLesson = {
  title: string;
  type: LessonType;
  duration: string;
  freePreview: boolean;
};

export type CourseModule = {
  title: string;
  lessons: CourseLesson[];
};

export type CourseCatalogueEntry = {
  slug: string;
  title: string;
  category: string;
  difficulty: CourseDifficulty;
  rating: number;
  reviewCount: number;
  price: string;
  instructor: {
    name: string;
    initials: string;
    bio: string;
    rank: string;
  };
  enrollmentCount: number;
  subtitle: string;
  certificate: boolean;
  communitySlug: string;
  communityName: string;
  visibility: CourseVisibility;
};

export const COURSES_DATA: CourseCatalogueEntry[] = [
  {
    slug: "react-designers",
    title: "React for Designers",
    category: "Development",
    difficulty: "beginner",
    rating: 4.8,
    reviewCount: 124,
    price: "Free",
    instructor: {
      name: "Ade Okafor",
      initials: "AO",
      bio: "Senior Frontend Engineer with 10+ years building for the web.",
      rank: "Top Instructor",
    },
    enrollmentCount: 342,
    subtitle: "Learn React fundamentals through hands-on design projects — from components to hooks, no prior JavaScript experience needed.",
    certificate: true,
    communitySlug: "frontend-devs",
    communityName: "Frontend Devs",
    visibility: "public",
  },
  {
    slug: "advanced-typescript",
    title: "Advanced TypeScript",
    category: "Development",
    difficulty: "advanced",
    rating: 4.9,
    reviewCount: 67,
    price: "₦15,000",
    instructor: {
      name: "Prof. Adeyemi",
      initials: "PA",
      bio: "Computer Science professor specializing in type theory and programming languages.",
      rank: "Top Instructor",
    },
    enrollmentCount: 128,
    subtitle: "Master generics, decorators, and conditional types for production-grade TypeScript.",
    certificate: true,
    communitySlug: "frontend-devs",
    communityName: "Frontend Devs",
    visibility: "private",
  },
  {
    slug: "uiux-research",
    title: "UI/UX Research Methods",
    category: "Design",
    difficulty: "intermediate",
    rating: 4.5,
    reviewCount: 43,
    price: "Free",
    instructor: {
      name: "Dr. Okonkwo",
      initials: "DO",
      bio: "UX researcher with 15 years in academia and industry.",
      rank: "Instructor",
    },
    enrollmentCount: 215,
    subtitle: "Complete research toolkit for designers.",
    certificate: false,
    communitySlug: "uiux-critique-circle",
    communityName: "UI/UX Critique Circle",
    visibility: "public",
  },
  {
    slug: "data-viz-d3",
    title: "Data Viz with D3",
    category: "Data Science",
    difficulty: "advanced",
    rating: 4.7,
    reviewCount: 31,
    price: "₦12,500",
    instructor: {
      name: "Kelechi Okonkwo",
      initials: "KO",
      bio: "Data visualization engineer at a leading fintech.",
      rank: "Instructor",
    },
    enrollmentCount: 89,
    subtitle: "Interactive charts and dashboards for the web.",
    certificate: true,
    communitySlug: "data-science-lab",
    communityName: "Data Science Lab",
    visibility: "private",
  },
  {
    slug: "product-strategy",
    title: "Product Strategy 101",
    category: "Product",
    difficulty: "beginner",
    rating: 4.3,
    reviewCount: 56,
    price: "Free",
    instructor: {
      name: "Amara Obi",
      initials: "AO",
      bio: "Product leader with 8+ years at fast-growing startups.",
      rank: "Instructor",
    },
    enrollmentCount: 198,
    subtitle: "Learn to define vision, set OKRs, and prioritize.",
    certificate: false,
    communitySlug: "product-hub",
    communityName: "Product Management Hub",
    visibility: "public",
  },
  {
    slug: "freelance-blueprint",
    title: "Freelance Business Blueprint",
    category: "Business",
    difficulty: "intermediate",
    rating: 4.6,
    reviewCount: 89,
    price: "₦8,000",
    instructor: {
      name: "Tunde Balogun",
      initials: "TB",
      bio: "Freelancer turned agency owner. Helped 500+ creatives launch.",
      rank: "Top Instructor",
    },
    enrollmentCount: 312,
    subtitle: "Pricing, contracts, and client management.",
    certificate: true,
    communitySlug: "freelance-creatives",
    communityName: "Freelance Creatives",
    visibility: "private",
  },
];

export function resolveCourse(slug: string) {
  return COURSES_DATA.find((c) => c.slug === slug) ?? null;
}

/* Pre-resolved full course objects for the detail page */

export type ResolvedCourse = ReturnType<typeof resolveFullCourse>;

export function resolveFullCourse(slug: string) {
  const data = resolveCourse(slug);
  if (!data) return null;

  return {
    ...data,
    enrolled: false,
    completed: false,
    certRequirements: { completion: "80%", quizScore: "70%", attendance: "60%" },
    curriculum: [
      {
        title: "Getting Started",
        lessons: [
          { title: "Welcome & Course Overview", type: "video" as const, duration: "4:32", freePreview: true },
          { title: "Setting Up Your Environment", type: "video" as const, duration: "8:15", freePreview: false },
          { title: "How the Web Works", type: "pdf" as const, duration: "12 min read", freePreview: false },
        ],
      },
      {
        title: "Core Concepts",
        lessons: [
          { title: "Components & Props", type: "video" as const, duration: "15:20", freePreview: false },
          { title: "State & Events", type: "video" as const, duration: "18:45", freePreview: false },
          { title: "Knowledge Check", type: "quiz" as const, duration: "10 questions", freePreview: false },
        ],
      },
      {
        title: "Building Projects",
        lessons: [
          { title: "Project: Hands-on Build", type: "assignment" as const, duration: "2-3 hours", freePreview: false },
          { title: "Live Code Review", type: "live" as const, duration: "60 min", freePreview: false },
        ],
      },
    ],
    reviews: [
      {
        id: "r1",
        author: { name: "Kelechi Okonkwo", initials: "KO" },
        rating: 5,
        title: "Game-changing course",
        comment: "This course completely changed how I approach the field. The instructor explains complex concepts in a way that just clicks.",
        createdAt: new Date(Date.now() - 1209600000).toISOString(),
        helpfulCount: 42,
        markedHelpful: false,
        instructorReply: {
          comment: "Thank you! Your project was one of the best I've seen. Keep building!",
          createdAt: new Date(Date.now() - 1036800000).toISOString(),
        },
      },
      {
        id: "r2",
        author: { name: "Tunde Balogun", initials: "TB" },
        rating: 4,
        title: "Great practical approach",
        comment: "Love the hands-on projects. Would love more advanced content in future updates.",
        createdAt: new Date(Date.now() - 2592000000).toISOString(),
        helpfulCount: 18,
        markedHelpful: false,
      },
    ] as CourseReview[],
  };
}
