import { connection } from "next/server";
import { createClient } from "./supabase/server";
import type {
  Education,
  Experience,
  PortfolioData,
  Profile,
  Project,
  Skill,
} from "./types";

export const fallbackProfile: Profile = {
  id: "fallback-profile",
  full_name: "Alexander Daudi",
  headline: "Marketing Graduate · Sales, Digital Marketing & Web Development",
  email: "alexdaud17@gmail.com",
  phone: "088260322 · 0993655408",
  location: "Blantyre, Malawi",
  bio: "Results-driven Marketing Graduate with expertise in sales, digital marketing, and web development. Proven ability to develop data-driven strategies, create compelling content, and build strong business relationships. Combines technical proficiency in web development, graphic design, and audio/video production with creative execution to deliver high-impact marketing solutions.",
  availability: "Available for new opportunities",
  github_url: null,
  linkedin_url: null,
  twitter_url: null,
  resume_url: "/Alexander-Daudi-Resume.pdf",
  avatar_url: null,
};

export const fallbackSkills: Skill[] = [
  // Business & Admin
  { id: "skill-1", name: "Customer Relationship Management (CRM)", category: "Business & Admin", level: null, sort_order: 1 },
  { id: "skill-2", name: "Microsoft Office Suite", category: "Business & Admin", level: null, sort_order: 2 },
  { id: "skill-3", name: "Project Management", category: "Business & Admin", level: null, sort_order: 3 },
  { id: "skill-4", name: "Bookkeeping", category: "Business & Admin", level: null, sort_order: 4 },
  { id: "skill-5", name: "Data Analysis", category: "Business & Admin", level: null, sort_order: 5 },
  { id: "skill-6", name: "Customer Service", category: "Business & Admin", level: null, sort_order: 6 },
  { id: "skill-7", name: "Strategy Development", category: "Business & Admin", level: null, sort_order: 7 },
  { id: "skill-8", name: "Campaign Execution", category: "Business & Admin", level: null, sort_order: 8 },
  { id: "skill-9", name: "Customer Acquisition", category: "Business & Admin", level: null, sort_order: 9 },
  { id: "skill-10", name: "Retention", category: "Business & Admin", level: null, sort_order: 10 },
  // Web Development
  { id: "skill-11", name: "HTML", category: "Web Development", level: null, sort_order: 11 },
  { id: "skill-12", name: "CSS", category: "Web Development", level: null, sort_order: 12 },
  { id: "skill-13", name: "JavaScript", category: "Web Development", level: null, sort_order: 13 },
  { id: "skill-14", name: "React", category: "Web Development", level: null, sort_order: 14 },
  { id: "skill-15", name: "Next.js", category: "Web Development", level: null, sort_order: 15 },
  // Digital Marketing
  { id: "skill-16", name: "SEO", category: "Digital Marketing", level: null, sort_order: 16 },
  { id: "skill-17", name: "Content Creation", category: "Digital Marketing", level: null, sort_order: 17 },
  { id: "skill-18", name: "Social Media Management", category: "Digital Marketing", level: null, sort_order: 18 },
  { id: "skill-19", name: "B2B Marketing", category: "Digital Marketing", level: null, sort_order: 19 },
  // Design & Production
  { id: "skill-20", name: "Graphic Design", category: "Design & Production", level: null, sort_order: 20 },
  { id: "skill-21", name: "Audio/Video Editing", category: "Design & Production", level: null, sort_order: 21 },
];

export const fallbackExperiences: Experience[] = [
  {
    id: "experience-1",
    company: "SFFRFM",
    role: "Sales Clerk",
    period: "3 years",
    summary:
      "Managed end-to-end sales for fertilizer while keeping high-volume cash transactions accurate and inventory records at 100% accuracy.",
    bullets: [
      "Managed end-to-end sales cycle for fertilizer, serving 50+ clients daily and ensuring accurate processing of high-volume cash transactions.",
      "Oversaw inventory management for receiving and storage, maintaining 100% accuracy in stock records.",
      "Streamlined weekly and monthly reporting processes, contributing to improved administrative efficiency.",
      "Supported administrative decision-making and coordinated team meetings to align on sales targets.",
    ],
    sort_order: 1,
  },
  {
    id: "experience-2",
    company: "Ufulu FM",
    role: "Marketing Intern",
    period: "2020",
    summary:
      "Supported audience growth and brand presence through listener strategies, multimedia content and B2B relationship management.",
    bullets: [
      "Developed strategies to attract and retain listeners, contributing to increased audience engagement.",
      "Created engaging multimedia content for promotional campaigns, strengthening brand presence.",
      "Managed sales documentation and supported B2B relationship management, identifying new opportunities for partnership and growth.",
    ],
    sort_order: 2,
  },
];

export const fallbackEducation: Education[] = [
  {
    id: "education-1",
    institution: "Malawi Assemblies of God University",
    qualification: "Bachelor of Commerce in Marketing",
    period: "2017 – 2022",
    details: "",
    sort_order: 1,
  },
  {
    id: "education-2",
    institution: "Limbe East Academy",
    qualification: "Malawi School Certificate of Education (MSCE)",
    period: "2013 – 2015",
    details: "",
    sort_order: 2,
  },
];

export const fallbackProjects: Project[] = [
  {
    id: "project-1",
    title: "Portfolio Platform",
    description:
      "This portfolio — a modern, database-backed site with an admin panel so content can be updated without touching code.",
    tech: ["Next.js", "TypeScript", "Tailwind CSS", "Supabase"],
    url: null,
    image_url: null,
    featured: true,
    sort_order: 1,
  },
];

export const fallbackData: PortfolioData = {
  profile: fallbackProfile,
  skills: fallbackSkills,
  experiences: fallbackExperiences,
  education: fallbackEducation,
  projects: fallbackProjects,
};

/**
 * Loads portfolio content from Supabase when it is configured, and otherwise
 * (or on error) falls back to the content from the resume so the site always
 * renders something useful.
 */
export async function getPortfolioData(): Promise<PortfolioData> {
  // Always render per request so database edits appear immediately, even when
  // Supabase is not configured and the bundled fallback content is used.
  await connection();

  const supabase = await createClient();
  if (!supabase) return fallbackData;

  try {
    const [profileResult, skillsResult, experiencesResult, educationResult, projectsResult] =
      await Promise.all([
        supabase.from("profiles").select("*").limit(1).maybeSingle(),
        supabase.from("skills").select("*").order("sort_order", { ascending: true }),
        supabase.from("experiences").select("*").order("sort_order", { ascending: true }),
        supabase.from("education").select("*").order("sort_order", { ascending: true }),
        supabase.from("projects").select("*").order("sort_order", { ascending: true }),
      ]);

    const failed =
      profileResult.error ||
      skillsResult.error ||
      experiencesResult.error ||
      educationResult.error ||
      projectsResult.error;

    if (failed) return fallbackData;

    return {
      profile: (profileResult.data as Profile | null) ?? fallbackProfile,
      skills: (skillsResult.data as Skill[] | null) ?? [],
      experiences: (experiencesResult.data as Experience[] | null) ?? [],
      education: (educationResult.data as Education[] | null) ?? [],
      projects: (projectsResult.data as Project[] | null) ?? [],
    };
  } catch {
    return fallbackData;
  }
}

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
  );
}
