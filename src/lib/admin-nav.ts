import {
  BriefcaseBusiness,
  FolderKanban,
  GraduationCap,
  LayoutDashboard,
  Sparkles,
  UserRound,
} from "lucide-react";

/** Shared navigation definition used by both the client nav and the server pages. */
export const adminNavItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/profile", label: "Profile", icon: UserRound },
  { href: "/admin/experience", label: "Experience", icon: BriefcaseBusiness },
  { href: "/admin/skills", label: "Skills", icon: Sparkles },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/education", label: "Education", icon: GraduationCap },
];
