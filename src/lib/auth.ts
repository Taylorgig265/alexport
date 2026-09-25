import { connection } from "next/server";
import { redirect } from "next/navigation";
import { createClient } from "./supabase/server";

export async function getAdminSession() {
  // Admin pages must never be prerendered: the session cookie has to be read on
  // every request so unauthenticated visitors can never see a cached page.
  await connection();

  const supabase = await createClient();
  if (!supabase) return { supabase: null, user: null, role: null };

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { supabase, user: null, role: null };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  return { supabase, user, role: (profile?.role as string | null) ?? null };
}

/**
 * Guards every admin page and server action. Role checks are always performed
 * on the server so the UI alone is never the security boundary.
 */
export async function requireAdmin() {
  const { supabase, user, role } = await getAdminSession();

  if (!supabase) {
    redirect("/admin/login?error=Supabase%20is%20not%20configured%20yet.");
  }

  if (!user) {
    redirect("/admin/login");
  }

  if (role !== "admin") {
    redirect("/admin/login?error=Your%20account%20does%20not%20have%20admin%20access.");
  }

  return { supabase, user };
}
