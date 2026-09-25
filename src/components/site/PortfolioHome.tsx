import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  BriefcaseBusiness,
  Code2,
  Download,
  GraduationCap,
  Mail,
  MapPin,
  Megaphone,
  Palette,
  Phone,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { PortfolioData, Skill } from "@/lib/types";
import { SectionHeading } from "./SectionHeading";
import { SiteHeader } from "./SiteHeader";

const categoryIcons: Record<string, LucideIcon> = {
  "Business & Admin": BriefcaseBusiness,
  "Web Development": Code2,
  "Digital Marketing": Megaphone,
  "Design & Production": Palette,
};

const capabilities = [
  {
    icon: TrendingUp,
    title: "Sales & relationships",
    body: "End-to-end sales, CRM, customer acquisition and retention, plus B2B relationship management.",
  },
  {
    icon: Megaphone,
    title: "Marketing & content",
    body: "SEO, content creation, social media management and campaign execution that builds a brand presence.",
  },
  {
    icon: Code2,
    title: "Web & design",
    body: "Responsive websites with HTML, CSS, JavaScript, React and Next.js, supported by graphic design and audio/video editing.",
  },
];

const stats = [
  { value: "3+", label: "Years in sales" },
  { value: "50+", label: "Clients served daily" },
  { value: "100%", label: "Inventory record accuracy" },
];

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function groupSkills(skills: Skill[]) {
  const groups = new Map<string, Skill[]>();
  for (const skill of skills) {
    const current = groups.get(skill.category) ?? [];
    current.push(skill);
    groups.set(skill.category, current);
  }
  return Array.from(groups.entries());
}

export function PortfolioHome({ data }: { data: PortfolioData }) {
  const { profile, skills, experiences, education, projects } = data;
  const skillGroups = groupSkills(skills);
  const year = new Date().getFullYear();

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-grid" />
      <div className="pointer-events-none fixed -top-40 left-1/2 -z-10 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[130px]" />
      <div className="pointer-events-none fixed bottom-0 right-0 -z-10 h-[26rem] w-[26rem] rounded-full bg-lime-400/5 blur-[130px]" />

      <SiteHeader name={profile.full_name} />

      <main>
        {/* Hero */}
        <section id="home" className="container-x flex min-h-[calc(100vh-4rem)] items-center py-20">
          <div className="grid w-full items-center gap-14 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/5 px-3 py-1.5 text-xs font-medium text-emerald-300">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                {profile.availability}
              </p>

              <h1 className="mt-6 text-5xl font-semibold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
                Alexander
                <span className="block bg-linear-to-r from-cyan-300 via-sky-300 to-lime-300 bg-clip-text text-transparent">
                  Daudi
                </span>
              </h1>

              <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-400">
                {profile.headline}
              </p>

              <p className="mt-4 max-w-xl leading-relaxed text-slate-500">{profile.bio}</p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-ink-950 transition hover:bg-cyan-300"
                >
                  Get in touch <ArrowRight size={16} />
                </a>
                <a
                  href="#work"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-white/25 hover:bg-white/10"
                >
                  View selected work
                </a>
                {profile.resume_url ? (
                  <a
                    href={profile.resume_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:border-white/25 hover:text-white"
                  >
                    <Download size={16} /> Resume
                  </a>
                ) : null}
              </div>

              <dl className="mt-12 grid max-w-xl grid-cols-3 gap-4 border-t border-white/5 pt-8">
                {stats.map((stat) => (
                  <div key={stat.label}>
                    <dt className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                      {stat.value}
                    </dt>
                    <dd className="mt-1 text-xs leading-relaxed text-slate-500 sm:text-sm">
                      {stat.label}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="relative">
              <div className="absolute -inset-6 rounded-[2.5rem] bg-linear-to-br from-cyan-400/20 via-transparent to-lime-300/20 blur-2xl" />
              <div className="card relative p-7">
                <div className="flex items-center gap-4">
                  <div className="grid h-16 w-16 place-items-center rounded-2xl bg-linear-to-br from-cyan-400 to-lime-300 text-xl font-bold text-ink-950">
                    {initials(profile.full_name)}
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-white">{profile.full_name}</p>
                    <p className="flex items-center gap-1.5 text-sm text-slate-400">
                      <MapPin size={14} /> {profile.location}
                    </p>
                  </div>
                </div>

                <div className="mt-7 space-y-3 border-t border-white/5 pt-6 text-sm">
                  <a
                    href={`mailto:${profile.email}`}
                    className="flex items-center justify-between gap-3 rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3 text-slate-300 transition hover:border-cyan-400/30 hover:text-white"
                  >
                    <span className="flex items-center gap-3">
                      <Mail size={16} className="text-cyan-300" /> {profile.email}
                    </span>
                    <ArrowUpRight size={15} className="text-slate-500" />
                  </a>
                  <a
                    href={`tel:${profile.phone.split("·")[0]?.trim() ?? ""}`}
                    className="flex items-center justify-between gap-3 rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3 text-slate-300 transition hover:border-cyan-400/30 hover:text-white"
                  >
                    <span className="flex items-center gap-3">
                      <Phone size={16} className="text-cyan-300" /> {profile.phone}
                    </span>
                    <ArrowUpRight size={15} className="text-slate-500" />
                  </a>
                </div>

                <div className="mt-6 rounded-xl border border-lime-300/15 bg-lime-300/5 p-4">
                  <p className="flex items-center gap-2 text-sm font-medium text-lime-200">
                    <Sparkles size={15} /> What I bring
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">
                    Data-driven strategies, compelling content, and hands-on execution across
                    sales, marketing and the web.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About */}
        <section id="about" className="container-x scroll-mt-20 py-24">
          <SectionHeading
            eyebrow="About"
            title="Strategy and execution, side by side"
            description="I combine commercial instinct with technical skills — from the sales floor to the browser console."
          />

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {capabilities.map((capability) => (
              <article key={capability.title} className="card group p-7 transition hover:border-cyan-400/25">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-cyan-400/10 text-cyan-300 transition group-hover:bg-cyan-400/15">
                  <capability.icon size={20} />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-white">{capability.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-slate-400">{capability.body}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Experience */}
        <section id="experience" className="container-x scroll-mt-20 py-24">
          <SectionHeading
            eyebrow="Experience"
            title="Where I have worked"
            description="Sales, administration and marketing experience across retail and broadcasting."
          />

          <div className="mt-12 space-y-6">
            {experiences.map((experience) => (
              <article key={experience.id} className="card p-7">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold text-white">{experience.company}</h3>
                    <p className="mt-1 text-sm font-medium text-cyan-300">{experience.role}</p>
                  </div>
                  <span className="badge">{experience.period}</span>
                </div>

                {experience.summary ? (
                  <p className="mt-5 text-sm leading-relaxed text-slate-400">
                    {experience.summary}
                  </p>
                ) : null}

                {experience.bullets.length > 0 ? (
                  <ul className="mt-5 space-y-2.5">
                    {experience.bullets.map((bullet) => (
                      <li key={bullet} className="flex gap-3 text-sm leading-relaxed text-slate-400">
                        <BadgeCheck size={16} className="mt-0.5 shrink-0 text-lime-300" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </article>
            ))}
          </div>
        </section>

        {/* Skills */}
        <section id="skills" className="container-x scroll-mt-20 py-24">
          <SectionHeading
            eyebrow="Skills"
            title="A practical, cross-functional toolkit"
            description="Business fundamentals on one side, digital craft on the other."
          />

          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            {skillGroups.map(([category, items]) => {
              const Icon = categoryIcons[category] ?? Sparkles;
              return (
                <article key={category} className="card p-7">
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/5 text-cyan-300">
                      <Icon size={18} />
                    </div>
                    <h3 className="text-base font-semibold text-white">{category}</h3>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {items.map((skill) => (
                      <span
                        key={skill.id}
                        className="rounded-lg border border-white/8 bg-white/[0.04] px-3 py-1.5 text-sm text-slate-300 transition hover:border-cyan-400/30 hover:text-white"
                      >
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* Work */}
        <section id="work" className="container-x scroll-mt-20 py-24">
          <SectionHeading
            eyebrow="Selected work"
            title="Projects and platforms"
            description="Add, edit and feature projects any time from the admin panel."
          />

          {projects.length > 0 ? (
            <div className="mt-12 grid gap-5 md:grid-cols-2">
              {projects.map((project) => (
                <article key={project.id} className="card flex flex-col p-7">
                  <div className="flex items-start justify-between gap-4">
                    <div className="grid h-11 w-11 place-items-center rounded-xl bg-linear-to-br from-cyan-400/20 to-lime-300/10 text-cyan-300">
                      <Code2 size={20} />
                    </div>
                    {project.featured ? <span className="badge">Featured</span> : null}
                  </div>

                  <h3 className="mt-5 text-lg font-semibold text-white">{project.title}</h3>
                  <p className="mt-2.5 flex-1 text-sm leading-relaxed text-slate-400">
                    {project.description}
                  </p>

                  {project.tech.length > 0 ? (
                    <div className="mt-5 flex flex-wrap gap-2">
                      {project.tech.map((tech) => (
                        <span key={tech} className="badge">
                          {tech}
                        </span>
                      ))}
                    </div>
                  ) : null}

                  {project.url ? (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-cyan-300 transition hover:text-cyan-200"
                    >
                      Visit project <ArrowUpRight size={15} />
                    </a>
                  ) : null}
                </article>
              ))}
            </div>
          ) : (
            <div className="card mt-12 p-10 text-center">
              <p className="text-sm text-slate-400">
                No projects published yet. Add them from the admin panel.
              </p>
            </div>
          )}
        </section>

        {/* Education */}
        <section id="education" className="container-x scroll-mt-20 py-24">
          <SectionHeading eyebrow="Education" title="Academic background" />

          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {education.map((item) => (
              <article key={item.id} className="card p-7">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-lime-300/10 text-lime-300">
                  <GraduationCap size={20} />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-white">{item.qualification}</h3>
                <p className="mt-1.5 text-sm text-slate-400">{item.institution}</p>
                {item.period ? <p className="badge mt-4 inline-flex">{item.period}</p> : null}
                {item.details ? (
                  <p className="mt-4 text-sm leading-relaxed text-slate-500">{item.details}</p>
                ) : null}
              </article>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="container-x scroll-mt-20 py-24">
          <div className="card relative overflow-hidden p-8 sm:p-12">
            <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />
            <div className="relative">
              <p className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">
                <Users size={13} /> Contact
              </p>
              <h2 className="mt-6 max-w-2xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Let&apos;s build something people actually engage with.
              </h2>
              <p className="mt-4 max-w-xl leading-relaxed text-slate-400">
                Available for opportunities in sales, digital marketing, web development and
                creative production. Based in {profile.location}.
              </p>

              <div className="mt-9 flex flex-wrap gap-3">
                <a
                  href={`mailto:${profile.email}`}
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-ink-950 transition hover:bg-cyan-300"
                >
                  <Mail size={16} /> {profile.email}
                </a>
                <a
                  href={`tel:${profile.phone.split("·")[0]?.trim() ?? ""}`}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-white/25 hover:text-white"
                >
                  <Phone size={16} /> {profile.phone}
                </a>
              </div>

              <div className="mt-9 flex flex-wrap items-center gap-5 border-t border-white/5 pt-7 text-sm">
                <span className="flex items-center gap-2 text-slate-500">
                  <ShieldCheck size={15} className="text-lime-300" /> References available upon
                  request
                </span>
                {profile.linkedin_url ? (
                  <a
                    href={profile.linkedin_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-slate-400 transition hover:text-white"
                  >
                    LinkedIn
                  </a>
                ) : null}
                {profile.github_url ? (
                  <a
                    href={profile.github_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-slate-400 transition hover:text-white"
                  >
                    GitHub
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/5 py-10">
        <div className="container-x flex flex-col items-center justify-between gap-4 text-sm text-slate-500 sm:flex-row">
          <p>
            © {year} {profile.full_name}. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <span>Built with Next.js &amp; Supabase</span>
            <Link href="/admin" className="transition hover:text-white">
              Admin
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
