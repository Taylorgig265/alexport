export type Profile = {
  id: string;
  full_name: string;
  headline: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  availability: string;
  github_url: string | null;
  linkedin_url: string | null;
  twitter_url: string | null;
  resume_url: string | null;
  avatar_url: string | null;
  role?: string;
};

export type Skill = {
  id: string;
  name: string;
  category: string;
  level: number | null;
  sort_order: number;
};

export type Experience = {
  id: string;
  company: string;
  role: string;
  period: string;
  summary: string;
  bullets: string[];
  sort_order: number;
};

export type Education = {
  id: string;
  institution: string;
  qualification: string;
  period: string;
  details: string;
  sort_order: number;
};

export type Project = {
  id: string;
  title: string;
  description: string;
  tech: string[];
  url: string | null;
  image_url: string | null;
  featured: boolean;
  sort_order: number;
};

export type PortfolioData = {
  profile: Profile;
  skills: Skill[];
  experiences: Experience[];
  education: Education[];
  projects: Project[];
};
