"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminNavItems } from "@/lib/admin-nav";

export function AdminNav({ className = "grid gap-1" }: { className?: string }) {
  const pathname = usePathname();

  return (
    <nav className={className}>
      {adminNavItems.map((item) => {
        const active =
          item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex shrink-0 items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm transition ${
              active
                ? "bg-white/10 font-medium text-white"
                : "text-slate-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Icon size={17} className={active ? "text-cyan-300" : "text-slate-500"} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
