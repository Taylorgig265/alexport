import type { Metadata } from "next";
import Link from "next/link";
import { Pencil, Plus } from "lucide-react";
import { saveProfile } from "@/app/admin/actions";
import { Notice } from "@/components/admin/Notice";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { requireAdmin } from "@/lib/auth";
import type { Profile } from "@/lib/types";

export const metadata: Metadata = {
  title: "Profile",
  robots: { index: false, follow: false },
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function toText(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function ProfileAdminPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { supabase, user } = await requireAdmin();
  const params = await searchParams;

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  const profile = (data as Profile | null) ?? null;

  return (
    <div className="animate-fade-up space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="page-title">Profile</h1>
          <p className="page-subtitle">
            These details power the hero section, contact card and page metadata.
          </p>
        </div>
        <Link href="/" target="_blank" className="btn btn-secondary text-xs">
          Preview site
        </Link>
      </header>

      <Notice message={toText(params.message)} error={toText(params.error)} />

      {!profile ? (
        <div className="rounded-xl border border-amber-500/25 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
          No profile row was found for this account. Saving the form below will create it.
        </div>
      ) : null}

      <form action={saveProfile} className="card space-y-5 p-6">
        <input type="hidden" name="id" value={profile?.id ?? user.id} />

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="field-label" htmlFor="full_name">
              Full name
            </label>
            <input
              id="full_name"
              name="full_name"
              required
              defaultValue={profile?.full_name ?? ""}
              className="input"
            />
          </div>

          <div>
            <label className="field-label" htmlFor="headline">
              Headline
            </label>
            <input
              id="headline"
              name="headline"
              defaultValue={profile?.headline ?? ""}
              placeholder="Marketing Graduate · Sales & Web Development"
              className="input"
            />
          </div>

          <div>
            <label className="field-label" htmlFor="email">
              Contact email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              defaultValue={profile?.email ?? ""}
              className="input"
            />
          </div>

          <div>
            <label className="field-label" htmlFor="phone">
              Phone
            </label>
            <input
              id="phone"
              name="phone"
              defaultValue={profile?.phone ?? ""}
              placeholder="088260322 · 0993655408"
              className="input"
            />
          </div>

          <div>
            <label className="field-label" htmlFor="location">
              Location
            </label>
            <input
              id="location"
              name="location"
              defaultValue={profile?.location ?? ""}
              placeholder="Blantyre, Malawi"
              className="input"
            />
          </div>

          <div>
            <label className="field-label" htmlFor="availability">
              Availability status
            </label>
            <input
              id="availability"
              name="availability"
              defaultValue={profile?.availability ?? "Available for new opportunities"}
              className="input"
            />
          </div>
        </div>

        <div>
          <label className="field-label" htmlFor="bio">
            Bio / professional summary
          </label>
          <textarea id="bio" name="bio" defaultValue={profile?.bio ?? ""} className="textarea" />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="field-label" htmlFor="github_url">
              GitHub URL
            </label>
            <input
              id="github_url"
              name="github_url"
              defaultValue={profile?.github_url ?? ""}
              placeholder="https://github.com/username"
              className="input"
            />
          </div>

          <div>
            <label className="field-label" htmlFor="linkedin_url">
              LinkedIn URL
            </label>
            <input
              id="linkedin_url"
              name="linkedin_url"
              defaultValue={profile?.linkedin_url ?? ""}
              placeholder="https://linkedin.com/in/username"
              className="input"
            />
          </div>

          <div>
            <label className="field-label" htmlFor="resume_url">
              Resume URL
            </label>
            <input
              id="resume_url"
              name="resume_url"
              defaultValue={profile?.resume_url ?? ""}
              placeholder="https://…/Alexander-Daudi-Resume.pdf"
              className="input"
            />
          </div>

          <div>
            <label className="field-label" htmlFor="avatar_url">
              Avatar URL
            </label>
            <input
              id="avatar_url"
              name="avatar_url"
              defaultValue={profile?.avatar_url ?? ""}
              placeholder="https://…/photo.jpg"
              className="input"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 border-t border-white/5 pt-5">
          <SubmitButton>
            <Plus size={15} /> Save profile
          </SubmitButton>
          <p className="text-xs text-slate-500">Changes appear on the homepage immediately.</p>
        </div>
      </form>

      <p className="flex items-center gap-2 text-xs text-slate-600">
        <Pencil size={13} /> Signed in as {user.email}
      </p>
    </div>
  );
}
