import type { Metadata } from "next";
import Link from "next/link";
import { Pencil, Plus, X } from "lucide-react";
import { deleteSkill, saveSkill } from "@/app/admin/actions";
import { DeleteForm } from "@/components/admin/DeleteForm";
import { Notice } from "@/components/admin/Notice";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { firstParam, safeRows } from "@/lib/admin-data";
import { requireAdmin } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Skills",
  robots: { index: false, follow: false },
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function toText(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function SkillsAdminPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { supabase } = await requireAdmin();
  const params = await searchParams;
  const { rows, error } = await safeRows(supabase, "skills");
  const editing = rows.find((row) => row.id === firstParam(params.edit)) ?? null;

  const categories = Array.from(new Set(rows.map((row) => row.category))).sort();

  return (
    <div className="animate-fade-up space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="page-title">Skills</h1>
          <p className="page-subtitle">Group your strengths into clear categories.</p>
        </div>
        {editing ? (
          <Link href="/admin/skills" className="btn btn-secondary text-xs">
            <X size={14} /> Cancel edit
          </Link>
        ) : null}
      </header>

      <Notice message={toText(params.message)} error={toText(params.error) ?? error} />

      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <form action={saveSkill} className="card h-fit space-y-5 p-6">
          <h2 className="text-base font-semibold text-white">
            {editing ? `Edit ${editing.name}` : "Add skill"}
          </h2>

          <input type="hidden" name="id" value={editing?.id ?? ""} />

          <div>
            <label className="field-label" htmlFor="name">
              Skill
            </label>
            <input
              id="name"
              name="name"
              required
              defaultValue={editing?.name ?? ""}
              placeholder="Customer Relationship Management (CRM)"
              className="input"
            />
          </div>

          <div>
            <label className="field-label" htmlFor="category">
              Category
            </label>
            <input
              id="category"
              name="category"
              required
              list="skill-categories"
              defaultValue={editing?.category ?? ""}
              placeholder="Business & Admin"
              className="input"
            />
            <datalist id="skill-categories">
              {categories.map((category) => (
                <option key={category} value={category} />
              ))}
            </datalist>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="field-label" htmlFor="level">
                Level (optional, 1–100)
              </label>
              <input
                id="level"
                name="level"
                type="number"
                min={1}
                max={100}
                defaultValue={editing?.level ?? ""}
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

          <div className="border-t border-white/5 pt-5">
            <SubmitButton>
              <Plus size={15} /> {editing ? "Save changes" : "Add skill"}
            </SubmitButton>
          </div>
        </form>

        <div className="space-y-5">
          {categories.length === 0 ? (
            <div className="card p-8 text-center text-sm text-slate-500">
              No skills yet — add your first one.
            </div>
          ) : (
            categories.map((category) => (
              <div key={category} className="card p-5">
                <h3 className="text-sm font-semibold text-white">{category}</h3>
                <div className="mt-4 space-y-2">
                  {rows
                    .filter((row) => row.category === category)
                    .map((row) => (
                      <div key={row.id} className="data-row">
                        <div className="min-w-0">
                          <p className="truncate text-sm text-slate-200">{row.name}</p>
                          <p className="mt-0.5 text-xs text-slate-600">
                            Order: {row.sort_order}
                            {row.level ? ` · Level ${row.level}` : ""}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/admin/skills?edit=${row.id}`}
                            className="btn btn-secondary px-3 py-2 text-xs"
                          >
                            <Pencil size={13} /> Edit
                          </Link>
                          <DeleteForm id={row.id} action={deleteSkill} />
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
