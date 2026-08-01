/* ---------------------------------------------------------------- */
/*  Shared community catalogue — single source of truth              */
/* ---------------------------------------------------------------- */

export type CommunityVisibility = "public" | "private" | "invite-only";

export type CommunityCatalogueEntry = {
  slug: string;
  name: string;
  category: string;
  visibility: CommunityVisibility;
  memberCount: number;
  courseCount: number;
  rating: number;
  reviewCount: number;
  description: string;
  price: string;
  requiresApproval: boolean;
  instructor: {
    name: string;
    initials: string;
    bio: string;
    specialties: string[];
  };
};

export const COMMUNITIES_DATA: CommunityCatalogueEntry[] = [
  {
    slug: "frontend-devs",
    name: "Frontend Devs",
    category: "Development",
    visibility: "public",
    memberCount: 1248,
    courseCount: 6,
    rating: 4.8,
    reviewCount: 89,
    description:
      "A community for frontend developers to share tips, tricks, and best practices. We cover React, Vue, CSS, Tailwind, TypeScript, and everything in between.",
    price: "Free",
    requiresApproval: false,
    instructor: {
      name: "Ade Okafor",
      initials: "AO",
      bio: "Senior Frontend Engineer with 10+ years building for the web. Formerly at Google and Flutterwave.",
      specialties: ["React", "TypeScript", "Design Systems"],
    },
  },
  {
    slug: "uiux-critique-circle",
    name: "UI/UX Critique Circle",
    category: "Design",
    visibility: "public",
    memberCount: 860,
    courseCount: 3,
    rating: 4.6,
    reviewCount: 52,
    description:
      "Weekly design critiques, portfolio reviews, and UX discussions. Bring your work and get honest, constructive feedback.",
    price: "Free",
    requiresApproval: false,
    instructor: {
      name: "Amara Obi",
      initials: "AO",
      bio: "UX researcher with 12 years in academia and industry.",
      specialties: ["UX Research", "Design Systems", "Accessibility"],
    },
  },
  {
    slug: "data-science-lab",
    name: "Data Science Lab",
    category: "Data Science",
    visibility: "private",
    memberCount: 342,
    courseCount: 4,
    rating: 4.5,
    reviewCount: 31,
    description:
      "Collaborative data science projects, Kaggle competitions, and peer learning.",
    price: "₦5,000/mo",
    requiresApproval: true,
    instructor: {
      name: "Kelechi Okonkwo",
      initials: "KO",
      bio: "Data scientist and ML engineer at a leading fintech.",
      specialties: ["Python", "ML", "Data Viz"],
    },
  },
  {
    slug: "freelance-creatives",
    name: "Freelance Creatives",
    category: "Business",
    visibility: "invite-only",
    memberCount: 156,
    courseCount: 2,
    rating: 4.9,
    reviewCount: 23,
    description:
      "For creatives navigating freelance life — pricing, contracts, and client management.",
    price: "Free",
    requiresApproval: true,
    instructor: {
      name: "Tunde Balogun",
      initials: "TB",
      bio: "Freelancer turned agency owner. Helped 500+ creatives launch.",
      specialties: ["Freelancing", "Business", "Contracts"],
    },
  },
  {
    slug: "backend-engineers",
    name: "Backend Engineers",
    category: "Development",
    visibility: "public",
    memberCount: 2100,
    courseCount: 8,
    rating: 4.7,
    reviewCount: 104,
    description:
      "Node.js, Python, Go — all things backend. Design patterns, databases, APIs, and system design.",
    price: "Free",
    requiresApproval: false,
    instructor: {
      name: "Prof. Adeyemi",
      initials: "PA",
      bio: "Computer Science professor and backend architect.",
      specialties: ["Node.js", "Python", "System Design"],
    },
  },
  {
    slug: "product-hub",
    name: "Product Management Hub",
    category: "Product",
    visibility: "public",
    memberCount: 480,
    courseCount: 3,
    rating: 4.4,
    reviewCount: 41,
    description:
      "PM frameworks, case studies, and mentorship. From junior PM to Head of Product.",
    price: "₦3,000/mo",
    requiresApproval: false,
    instructor: {
      name: "Dr. Okonkwo",
      initials: "DO",
      bio: "Product leader with 15+ years across fintech, healthtech, and edtech.",
      specialties: ["Product Strategy", "OKRs", "Stakeholder Management"],
    },
  },
];

export function resolveCommunity(slug: string) {
  return COMMUNITIES_DATA.find((c) => c.slug === slug) ?? null;
}
