"use client";

import type { ReactNode } from "react";

export function DeleteForm({
  id,
  action,
  label = "Delete",
  confirmMessage = "Delete this item? This cannot be undone.",
  children,
}: {
  id: string;
  action: (formData: FormData) => Promise<void>;
  label?: string;
  confirmMessage?: string;
  children?: ReactNode;
}) {
  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (!window.confirm(confirmMessage)) event.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button type="submit" className="btn btn-danger px-3 py-2 text-xs">
        {children ?? label}
      </button>
    </form>
  );
}
