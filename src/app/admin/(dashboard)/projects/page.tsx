import type { Metadata } from "next";
import Link from "next/link";
import { Pencil, Plus, X } from "lucide-react";
import { deleteProject, saveProject } from "@/app/admin/actions";
import { DeleteForm } from "@/components/admin/DeleteForm";
import { Notice } from "@/components/admin/Notice";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { firstParam, safeRows } from "@/lib/admin-data";
import { requireAdmin } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Projects",
  robots: { index: false, follow: false },
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function toText(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function ProjectsAdminPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { supabase } = await requireAdmin();
  const params = await searchParams;
  const { rows, error } = await safeRows(supabase, "projects");
  const editing = rows.find((row) => row.id === firstParam(params.edit)) ?? null;

  return (
    <div className="animate-fade-up space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="page-title">Projects</h1>
          <p className="page-subtitle">Showcase work, case studies and side projects.</p>
        </div>
        {editing ? (
          <Link href="/admin/projects" className="btn btn-secondary text-xs">
            <X size={14} /> Cancel edit
          </Link>
        ) : null}
      </header>

      <Notice message={toText(params.message)} error={toText(params.error) ?? error} />

      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <form action={saveProject} className="card h-fit space-y-5 p-6">
          <h2 className="text-base font-semibold text-white">
            {editing ? `Edit ${editing.title}` : "Add project"}
          </h2>

          <input type="hidden" name="id" value={editing?.id ?? ""} />

          <div>
            <label className="field-label" htmlFor="title">
              Title
            </label>
            <input
              id="title"
              name="title"
              required
              defaultValue={editing?.title ?? ""}
              placeholder="Marketing campaign landing page"
              className="input"
            />
          </div>

          <div>
            <label className="field-label" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              defaultValue={editing?.description ?? ""}
              placeholder="What was the goal, and what did you build?"
              className="textarea"
            />
          </div>

          <div>
            <label className="field-label" htmlFor="tech">
              Tech / tags (comma separated)
            </label>
            <input
              id="tech"
              name="tech"
              defaultValue={editing ? editing.tech.join(", ") : ""}
              placeholder="Next.js, Supabase, Tailwind CSS"
              className="input"
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="field-label" htmlFor="url">
              Live URL
              </label>
              <input
                id="url"
                name="url"
                type="url"
                defaultValue={editing?.url ?? ""}
                placeholder="https://example.com"
                className="input"
              />
            </div>

            <div>
              <label className="field-label" htmlFor="image_url">
                Image URL
              </label>
              <input
                id="image_url"
                name="image_url"
                type="url"
                defaultValue={editing?.image_url ?? ""}
                placeholder="https://…/cover.png"
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

            <div className="flex items-end pb-2">
              <label className="flex items-center gap-2.5 text-sm text-slate-300">
                <input
                  id="featured"
                  name="featured"
                  type="checkbox"
                  defaultChecked={editing?.featured ?? false}
                  className="checkbox"
                />
                Feature on homepage
              </label>
            </div>
          </div>

          <div className="border-t border-white/5 pt-5">
            <SubmitButton>
              <Plus size={15} /> {editing ? "Save changes" : "Add project"}
            </SubmitButton>
          </div>
        </form>

        <div className="space-y-3">
          {rows.length === 0 ? (
            <div className="card p-8 text-center text-sm text-slate-500">
              No projects yet. Add your first one.
            </div>
          ) : (
            rows.map((row) => (
              <div key={row.id} className="data-row">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-white">{row.title}</p>
                  <p className="mt-0.5 line-clamp-2 text-xs text-slate-500">
                    {row.description || "No description"}
                  </p>
                  <p className="mt-1.5 text-xs text-slate-600">
                    {row.tech.join(" · ") || "No tags"}
                    {row.featured ? " · Featured" : ""}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin/projects?edit=${row.id}`}
                    className="btn btn-secondary px-3 py-2 text-xs"
                  >
                    <Pencil size={13} /> Edit
                  </Link>
                  <DeleteForm id={row.id} action={deleteProject} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
