import type { ActionState } from "@/types/domain";

export function FormMessage({ state }: { state: ActionState }) {
  if (!state.message) return null;
  return (
    <p
      className={`rounded-xl px-3 py-2 text-sm font-medium ${
        state.ok
          ? "bg-[color-mix(in_srgb,var(--success)_12%,transparent)] text-[var(--success)]"
          : "bg-[color-mix(in_srgb,var(--danger)_12%,transparent)] text-[var(--danger)]"
      }`}
      role="status"
    >
      {state.message}
    </p>
  );
}
