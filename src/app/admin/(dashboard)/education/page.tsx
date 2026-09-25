import type { Metadata } from "next";
import Link from "next/link";
import { Pencil, Plus, X } from "lucide-react";
import { deleteEducation, saveEducation } from "@/app/admin/actions";
import { DeleteForm } from "@/components/admin/DeleteForm";
import { Notice } from "@/components/admin/Notice";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { firstParam, safeRows } from "@/lib/admin-data";
import { requireAdmin } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Education",
  robots: { index: false, follow: false },
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function toText(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function EducationAdminPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { supabase } = await requireAdmin();
  const params = await searchParams;
  const { rows, error } = await safeRows(supabase, "education");
  const editing = rows.find((row) => row.id === firstParam(params.edit)) ?? null;

  return (
    <div className="animate-fade-up space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="page-title">Education</h1>
          <p className="page-subtitle">Qualifications, institutions and study periods.</p>
        </div>
        {editing ? (
          <Link href="/admin/education" className="btn btn-secondary text-xs">
            <X size={14} /> Cancel edit
          </Link>
        ) : null}
      </header>

      <Notice message={toText(params.message)} error={toText(params.error) ?? error} />

      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <form action={saveEducation} className="card h-fit space-y-5 p-6">
          <h2 className="text-base font-semibold text-white">
            {editing ? "Edit qualification" : "Add qualification"}
          </h2>

          <input type="hidden" name="id" value={editing?.id ?? ""} />

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="field-label" htmlFor="institution">
                Institution
              </label>
              <input
                id="institution"
                name="institution"
                required
                defaultValue={editing?.institution ?? ""}
                placeholder="Malawi Assemblies of God University"
                className="input"
              />
            </div>

            <div>
              <label className="field-label" htmlFor="qualification">
                Qualification
              </label>
              <input
                id="qualification"
                name="qualification"
                required
                defaultValue={editing?.qualification ?? ""}
                placeholder="Bachelor of Commerce in Marketing"
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
                placeholder="2017 – 2022"
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
            <label className="field-label" htmlFor="details">
              Notes (optional)
            </label>
            <textarea
              id="details"
              name="details"
              defaultValue={editing?.details ?? ""}
              placeholder="Focus areas, awards or coursework."
              className="textarea"
            />
          </div>

          <div className="border-t border-white/5 pt-5">
            <SubmitButton>
              <Plus size={15} /> {editing ? "Save changes" : "Add qualification"}
            </SubmitButton>
          </div>
        </form>

        <div className="space-y-3">
          {rows.length === 0 ? (
            <div className="card p-8 text-center text-sm text-slate-500">
              No education records yet.
            </div>
          ) : (
            rows.map((row) => (
              <div key={row.id} className="data-row">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-white">{row.qualification}</p>
                  <p className="mt-0.5 truncate text-xs text-slate-500">
                    {row.institution}
                    {row.period ? ` · ${row.period}` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin/education?edit=${row.id}`}
                    className="btn btn-secondary px-3 py-2 text-xs"
                  >
                    <Pencil size={13} /> Edit
                  </Link>
                  <DeleteForm id={row.id} action={deleteEducation} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
