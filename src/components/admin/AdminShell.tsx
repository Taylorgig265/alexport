import Link from "next/link";
import type { ReactNode } from "react";
import { ExternalLink, LogOut, ShieldCheck } from "lucide-react";
import { signOut } from "@/app/admin/actions";
import { AdminNav } from "./AdminNav";

export function AdminShell({
  email,
  children,
}: {
  email?: string | null;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[16.5rem_1fr]">
      <aside className="hidden border-r border-white/5 bg-ink-900/40 lg:flex lg:flex-col lg:justify-between">
        <div>
          <div className="flex h-16 items-center gap-3 border-b border-white/5 px-6">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-linear-to-br from-cyan-400 to-lime-300 text-sm font-bold text-ink-950">
              AD
            </span>
            <div>
              <p className="text-sm font-semibold text-white">Admin panel</p>
              <p className="text-xs text-slate-500">Portfolio CMS</p>
            </div>
          </div>
          <div className="px-4 py-5">
            <AdminNav />
          </div>
        </div>

        <div className="space-y-3 border-t border-white/5 p-4">
          <p className="flex items-center gap-2 truncate px-2 text-xs text-slate-500">
            <ShieldCheck size={14} className="shrink-0 text-lime-300" />
            {email}
          </p>
          <Link href="/" className="btn btn-secondary w-full">
            <ExternalLink size={15} /> View site
          </Link>
          <form action={signOut}>
            <button type="submit" className="btn btn-danger w-full">
              <LogOut size={15} /> Sign out
            </button>
          </form>
        </div>
      </aside>

      <div className="min-w-0">
        <header className="sticky top-0 z-40 border-b border-white/5 bg-ink-950/85 backdrop-blur-xl lg:hidden">
          <div className="flex h-16 items-center justify-between px-5">
            <p className="text-sm font-semibold text-white">Admin panel</p>
            <form action={signOut}>
              <button type="submit" className="btn btn-secondary px-3 py-2 text-xs">
                <LogOut size={14} /> Sign out
              </button>
            </form>
          </div>
          <div className="flex gap-2 overflow-x-auto border-t border-white/5 px-4 py-3">
            <AdminNav className="flex gap-2" />
          </div>
        </header>

        <main className="mx-auto w-full max-w-5xl px-5 py-8 lg:px-10 lg:py-10">
          {children}
        </main>
      </div>
    </div>
  );
}
