import type { SupabaseClient } from "@supabase/supabase-js";
import type { Education, Experience, Project, Skill } from "./types";

export const adminTables = ["skills", "experiences", "projects", "education"] as const;

export type AdminTable = (typeof adminTables)[number];

type RowMap = {
  skills: Skill;
  experiences: Experience;
  projects: Project;
  education: Education;
};

export async function getRows<T extends AdminTable>(
  supabase: SupabaseClient,
  table: T,
): Promise<RowMap[T][]> {
  const { data, error } = await supabase
    .from(table)
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as RowMap[T][];
}

/** Loads rows without throwing so a missing table shows a friendly notice. */
export async function safeRows<T extends AdminTable>(
  supabase: SupabaseClient,
  table: T,
): Promise<{ rows: RowMap[T][]; error: string | null }> {
  try {
    return { rows: await getRows(supabase, table), error: null };
  } catch (error) {
    return {
      rows: [],
      error: error instanceof Error ? error.message : "Could not load records.",
    };
  }
}

export function firstParam(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}
