"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

function readString(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function readNumber(formData: FormData, key: string): number {
  const parsed = Number.parseInt(readString(formData, key), 10);
  return Number.isFinite(parsed) ? parsed : 0;
}

function readLines(formData: FormData, key: string): string[] {
  return readString(formData, key)
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function readTags(formData: FormData, key: string): string[] {
  return readString(formData, key)
    .split(/[,\n]/)
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function readNullable(formData: FormData, key: string): string | null {
  const value = readString(formData, key);
  return value.length > 0 ? value : null;
}

function fail(path: string, message: string): never {
  redirect(`${path}?error=${encodeURIComponent(message)}`);
}

function finish(path: string, message: string): never {
  revalidatePath("/");
  revalidatePath(path);
  redirect(`${path}?message=${encodeURIComponent(message)}`);
}

/* -------------------------------------------------------------------------- */
/*                                   Auth                                     */
/* -------------------------------------------------------------------------- */

export async function signIn(formData: FormData) {
  const email = readString(formData, "email");
  const passwordValue = formData.get("password");
  const password = typeof passwordValue === "string" ? passwordValue : "";

  const supabase = await createClient();
  if (!supabase) {
    redirect(
      "/admin/login?error=Supabase%20is%20not%20configured.%20Add%20your%20keys%20to%20.env.local.",
    );
  }

  if (!email || !password) {
    redirect("/admin/login?error=Enter%20both%20your%20email%20and%20password.");
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(`/admin/login?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/admin");
}

export async function signOut() {
  const supabase = await createClient();
  if (supabase) {
    await supabase.auth.signOut();
  }
  redirect("/admin/login");
}

/* -------------------------------------------------------------------------- */
/*                                  Profile                                    */
/* -------------------------------------------------------------------------- */

export async function saveProfile(formData: FormData) {
  const path = "/admin/profile";
  const { supabase, user } = await requireAdmin();

  const fullName = readString(formData, "full_name");
  if (!fullName) fail(path, "Name is required.");

  const payload = {
    id: user.id,
    full_name: fullName,
    headline: readString(formData, "headline"),
    email: readString(formData, "email"),
    phone: readString(formData, "phone"),
    location: readString(formData, "location"),
    bio: readString(formData, "bio"),
    availability: readString(formData, "availability"),
    github_url: readNullable(formData, "github_url"),
    linkedin_url: readNullable(formData, "linkedin_url"),
    twitter_url: readNullable(formData, "twitter_url"),
    resume_url: readNullable(formData, "resume_url"),
    avatar_url: readNullable(formData, "avatar_url"),
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase.from("profiles").upsert(payload, { onConflict: "id" });
  if (error) fail(path, error.message);

  finish(path, "Profile saved.");
}

/* -------------------------------------------------------------------------- */
/*                                Experience                                   */
/* -------------------------------------------------------------------------- */

export async function saveExperience(formData: FormData) {
  const path = "/admin/experience";
  const { supabase } = await requireAdmin();

  const id = readNullable(formData, "id");
  const company = readString(formData, "company");
  const role = readString(formData, "role");
  if (!company || !role) fail(path, "Company and role are required.");

  const payload = {
    company,
    role,
    period: readString(formData, "period"),
    summary: readString(formData, "summary"),
    bullets: readLines(formData, "bullets"),
    sort_order: readNumber(formData, "sort_order"),
  };

  const { error } = id
    ? await supabase.from("experiences").update(payload).eq("id", id)
    : await supabase.from("experiences").insert(payload);

  if (error) fail(path, error.message);
  finish(path, id ? "Experience updated." : "Experience added.");
}

export async function deleteExperience(formData: FormData) {
  const path = "/admin/experience";
  const { supabase } = await requireAdmin();
  const id = readString(formData, "id");
  if (!id) fail(path, "Missing record id.");

  const { error } = await supabase.from("experiences").delete().eq("id", id);
  if (error) fail(path, error.message);
  finish(path, "Experience deleted.");
}

/* -------------------------------------------------------------------------- */
/*                                  Skills                                     */
/* -------------------------------------------------------------------------- */

export async function saveSkill(formData: FormData) {
  const path = "/admin/skills";
  const { supabase } = await requireAdmin();

  const id = readNullable(formData, "id");
  const name = readString(formData, "name");
  const category = readString(formData, "category");
  if (!name || !category) fail(path, "Skill name and category are required.");

  const levelValue = readString(formData, "level");
  const level = levelValue ? Number.parseInt(levelValue, 10) : null;

  const payload = {
    name,
    category,
    level: level !== null && Number.isFinite(level) ? level : null,
    sort_order: readNumber(formData, "sort_order"),
  };

  const { error } = id
    ? await supabase.from("skills").update(payload).eq("id", id)
    : await supabase.from("skills").insert(payload);

  if (error) fail(path, error.message);
  finish(path, id ? "Skill updated." : "Skill added.");
}

export async function deleteSkill(formData: FormData) {
  const path = "/admin/skills";
  const { supabase } = await requireAdmin();
  const id = readString(formData, "id");
  if (!id) fail(path, "Missing record id.");

  const { error } = await supabase.from("skills").delete().eq("id", id);
  if (error) fail(path, error.message);
  finish(path, "Skill deleted.");
}

/* -------------------------------------------------------------------------- */
/*                                  Projects                                   */
/* -------------------------------------------------------------------------- */

export async function saveProject(formData: FormData) {
  const path = "/admin/projects";
  const { supabase } = await requireAdmin();

  const id = readNullable(formData, "id");
  const title = readString(formData, "title");
  if (!title) fail(path, "Project title is required.");

  const payload = {
    title,
    description: readString(formData, "description"),
    tech: readTags(formData, "tech"),
    url: readNullable(formData, "url"),
    image_url: readNullable(formData, "image_url"),
    featured: formData.get("featured") === "on",
    sort_order: readNumber(formData, "sort_order"),
  };

  const { error } = id
    ? await supabase.from("projects").update(payload).eq("id", id)
    : await supabase.from("projects").insert(payload);

  if (error) fail(path, error.message);
  finish(path, id ? "Project updated." : "Project added.");
}

export async function deleteProject(formData: FormData) {
  const path = "/admin/projects";
  const { supabase } = await requireAdmin();
  const id = readString(formData, "id");
  if (!id) fail(path, "Missing record id.");

  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) fail(path, error.message);
  finish(path, "Project deleted.");
}

/* -------------------------------------------------------------------------- */
/*                                 Education                                   */
/* -------------------------------------------------------------------------- */

export async function saveEducation(formData: FormData) {
  const path = "/admin/education";
  const { supabase } = await requireAdmin();

  const id = readNullable(formData, "id");
  const institution = readString(formData, "institution");
  const qualification = readString(formData, "qualification");
  if (!institution || !qualification) {
    fail(path, "Institution and qualification are required.");
  }

  const payload = {
    institution,
    qualification,
    period: readString(formData, "period"),
    details: readString(formData, "details"),
    sort_order: readNumber(formData, "sort_order"),
  };

  const { error } = id
    ? await supabase.from("education").update(payload).eq("id", id)
    : await supabase.from("education").insert(payload);

  if (error) fail(path, error.message);
  finish(path, id ? "Education updated." : "Education added.");
}

export async function deleteEducation(formData: FormData) {
  const path = "/admin/education";
  const { supabase } = await requireAdmin();
  const id = readString(formData, "id");
  if (!id) fail(path, "Missing record id.");

  const { error } = await supabase.from("education").delete().eq("id", id);
  if (error) fail(path, error.message);
  finish(path, "Education deleted.");
}
