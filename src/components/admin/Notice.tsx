import { CheckCircle2, TriangleAlert } from "lucide-react";

export function Notice({
  message,
  error,
}: {
  message?: string | null | undefined;
  error?: string | null | undefined;
}) {
  if (!message && !error) return null;

  const isError = Boolean(error);

  return (
    <div
      role="status"
      className={`mb-6 flex items-start gap-3 rounded-xl border px-4 py-3 text-sm ${
        isError
          ? "border-red-500/25 bg-red-500/10 text-red-200"
          : "border-emerald-500/25 bg-emerald-500/10 text-emerald-200"
      }`}
    >
      {isError ? (
        <TriangleAlert size={17} className="mt-0.5 shrink-0" />
      ) : (
        <CheckCircle2 size={17} className="mt-0.5 shrink-0" />
      )}
      <span>{isError ? error : message}</span>
    </div>
  );
}
