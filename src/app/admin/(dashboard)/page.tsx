import type { Metadata } from "next";
import Link from "next/link";
import {
  BriefcaseBusiness,
  Database,
  ExternalLink,
  FolderKanban,
  GraduationCap,
  Pencil,
  Plus,
  Sparkles,
  TriangleAlert,
  UserRound,
} from "lucide-react";
import { adminNavItems } from "@/lib/admin-nav";
import { Notice } from "@/components/admin/Notice";
import { getPortfolioData, isSupabaseConfigured } from "@/lib/data";

export const metadata: Metadata = {
  title: "Admin dashboard",
  robots: { index: false, follow: false },
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function toText(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const data = await getPortfolioData();
  const configured = isSupabaseConfigured();

  const stats = [
    { label: "Experience", value: data.experiences.length, href: "/admin/experience", icon: BriefcaseBusiness },
    { label: "Skills", value: data.skills.length, href: "/admin/skills", icon: Sparkles },
    { label: "Projects", value: data.projects.length, href: "/admin/projects", icon: FolderKanban },
    { label: "Education", value: data.education.length, href: "/admin/education", icon: GraduationCap },
  ];

  return (
    <div className="animate-fade-up space-y-8">
      <header>
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">
          Manage everything that appears on your public portfolio.
        </p>
      </header>

      <Notice message={toText(params.message)} error={toText(params.error)} />

      {!configured ? (
        <div className="flex items-start gap-3 rounded-xl border border-amber-500/25 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
          <TriangleAlert size={17} className="mt-0.5 shrink-0" />
          <div>
            <p className="font-medium">Supabase is not connected yet.</p>
            <p className="mt-1 text-amber-200/80">
              The site is currently showing the resume content bundled with the app. Copy{" "}
              <code className="rounded bg-black/30 px-1.5 py-0.5 text-xs">.env.example</code> to{" "}
              <code className="rounded bg-black/30 px-1.5 py-0.5 text-xs">.env.local</code>, add
              your keys, then run the SQL in <code>supabase/schema.sql</code> and{" "}
              <code>supabase/seed.sql</code>.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
          <Database size={17} />
          Connected to Supabase. Changes are saved to the database immediately.
        </div>
      )}

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href} className="card group p-5 transition hover:border-cyan-400/25">
            <div className="flex items-center justify-between">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/5 text-cyan-300 transition group-hover:bg-cyan-400/10">
                <stat.icon size={18} />
              </span>
              <span className="text-2xl font-semibold tracking-tight text-white">
                {stat.value}
              </span>
            </div>
            <p className="mt-4 text-sm text-slate-400">{stat.label}</p>
          </Link>
        ))}
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <div className="card p-6">
          <h2 className="text-base font-semibold text-white">Quick actions</h2>
          <div className="mt-4 grid gap-2">
            <Link href="/admin/profile" className="btn btn-secondary justify-start">
              <UserRound size={15} /> Edit your profile and contact details
            </Link>
            <Link href="/admin/experience" className="btn btn-secondary justify-start">
              <Plus size={15} /> Add a new role or internship
            </Link>
            <Link href="/" target="_blank" className="btn btn-secondary justify-start">
              <ExternalLink size={15} /> Preview the public site
            </Link>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-base font-semibold text-white">All sections</h2>
          <div className="mt-4 grid gap-2">
            {adminNavItems.filter((item) => item.href !== "/admin").map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3 text-sm text-slate-300 transition hover:border-cyan-400/25 hover:text-white"
              >
                <span className="flex items-center gap-3">
                  <item.icon size={16} className="text-cyan-300" /> {item.label}
                </span>
                <Pencil size={14} className="text-slate-600" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
