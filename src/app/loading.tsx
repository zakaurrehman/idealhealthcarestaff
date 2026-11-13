export default function Loading() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4" role="status" aria-live="polite">
      <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-line border-t-brand-bright" />
      <p className="text-sm font-medium text-ink-3">Loading…</p>
    </div>
  );
}
