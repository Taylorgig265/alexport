import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, LockKeyhole } from "lucide-react";
import { signIn } from "@/app/admin/actions";
import { Notice } from "@/components/admin/Notice";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Admin sign in",
  robots: { index: false, follow: false },
};

type SearchParams = Promise<{
  error?: string | string[];
  message?: string | string[];
}>;

function toText(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const supabase = await createClient();
  if (supabase) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) redirect("/admin");
  }

  const params = await searchParams;

  return (
    <div className="relative flex min-h-screen items-center justify-center px-5 py-16">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-grid" />
      <div className="pointer-events-none fixed -top-32 left-1/2 -z-10 h-96 w-96 -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[120px]" />

      <div className="w-full max-w-md">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
        >
          <ArrowLeft size={15} /> Back to portfolio
        </Link>

        <div className="card p-8">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-cyan-400/10 text-cyan-300">
            <LockKeyhole size={20} />
          </div>
          <h1 className="mt-6 text-2xl font-semibold tracking-tight text-white">Admin sign in</h1>
          <p className="mt-2 text-sm text-slate-400">
            Manage your portfolio content. Only accounts with the admin role can sign in.
          </p>

          <div className="mt-6">
            <Notice message={toText(params.message)} error={toText(params.error)} />
          </div>

          <form action={signIn} className="mt-6 space-y-4">
            <div>
              <label className="field-label" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                className="input"
              />
            </div>

            <div>
              <label className="field-label" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="input"
              />
            </div>

            <SubmitButton className="btn btn-primary w-full" pendingLabel="Signing in…">
              Sign in
            </SubmitButton>
          </form>
        </div>

        <p className="mt-6 text-center text-xs leading-relaxed text-slate-600">
          Sessions are secured with Supabase Auth. Create the admin user in your Supabase
          dashboard, then run the provided schema.
        </p>
      </div>
    </div>
  );
}
