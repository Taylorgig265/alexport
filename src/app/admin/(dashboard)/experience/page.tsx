import type { Metadata } from "next";
import Link from "next/link";
import { Pencil, Plus, X } from "lucide-react";
import { deleteExperience, saveExperience } from "@/app/admin/actions";
import { DeleteForm } from "@/components/admin/DeleteForm";
import { Notice } from "@/components/admin/Notice";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { firstParam, safeRows } from "@/lib/admin-data";
import { requireAdmin } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Experience",
  robots: { index: false, follow: false },
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function toText(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function ExperienceAdminPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { supabase } = await requireAdmin();
  const params = await searchParams;
  const { rows, error } = await safeRows(supabase, "experiences");
  const editing = rows.find((row) => row.id === firstParam(params.edit)) ?? null;

  return (
    <div className="animate-fade-up space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="page-title">Experience</h1>
          <p className="page-subtitle">Roles, internships and the work you are proud of.</p>
        </div>
        {editing ? (
          <Link href="/admin/experience" className="btn btn-secondary text-xs">
            <X size={14} /> Cancel edit
          </Link>
        ) : null}
      </header>

      <Notice message={toText(params.message)} error={toText(params.error) ?? error} />

      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <form action={saveExperience} className="card h-fit space-y-5 p-6">
          <h2 className="text-base font-semibold text-white">
            {editing ? `Edit ${editing.role}` : "Add experience"}
          </h2>

          <input type="hidden" name="id" value={editing?.id ?? ""} />

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="field-label" htmlFor="company">
                Company
              </label>
              <input
                id="company"
                name="company"
                required
                defaultValue={editing?.company ?? ""}
                placeholder="SFFRFM"
                className="input"
              />
            </div>

            <div>
              <label className="field-label" htmlFor="role">
                Role
              </label>
              <input
                id="role"
                name="role"
                required
                defaultValue={editing?.role ?? ""}
                placeholder="Sales Clerk"
                className="input"
              />
            </div>

            <div>
              <label className="field-label" htmlFor="period">
                Period
              </label>
              <input
                id="period"
                name="period"
                defaultValue={editing?.period ?? ""}
                placeholder="2023 – Present"
                className="input"
              />
            </div>

            <div>
              <label className="field-label" htmlFor="sort_order">
                Sort order
              </label>
              <input
                id="sort_order"
                name="sort_order"
                type="number"
                defaultValue={editing?.sort_order ?? rows.length + 1}
                className="input"
              />
            </div>
          </div>

          <div>
            <label className="field-label" htmlFor="summary">
              Short summary
            </label>
            <textarea
              id="summary"
              name="summary"
              defaultValue={editing?.summary ?? ""}
              placeholder="One or two sentences about the role."
              className="textarea"
            />
          </div>

          <div>
            <label className="field-label" htmlFor="bullets">
              Highlights (one per line)
            </label>
            <textarea
              id="bullets"
              name="bullets"
              defaultValue={editing ? editing.bullets.join("\n") : ""}
              placeholder={"Managed end-to-end sales…\nImproved reporting processes…"}
              className="textarea"
            />
          </div>

          <div className="border-t border-white/5 pt-5">
            <SubmitButton>
              <Plus size={15} /> {editing ? "Save changes" : "Add experience"}
            </SubmitButton>
          </div>
        </form>

        <div className="space-y-3">
          {rows.length === 0 ? (
            <div className="card p-8 text-center text-sm text-slate-500">
              No experience records yet.
            </div>
          ) : (
            rows.map((row) => (
              <div key={row.id} className="data-row">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-white">{row.role}</p>
                  <p className="mt-0.5 truncate text-xs text-slate-500">
                    {row.company}
                    {row.period ? ` · ${row.period}` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin/experience?edit=${row.id}`}
                    className="btn btn-secondary px-3 py-2 text-xs"
                  >
                    <Pencil size={13} /> Edit
                  </Link>
                  <DeleteForm id={row.id} action={deleteExperience} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
