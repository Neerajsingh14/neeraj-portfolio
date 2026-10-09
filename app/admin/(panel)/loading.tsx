export default function Loading() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-4 w-24 rounded bg-white/10" />
      <div className="h-10 w-72 max-w-full rounded bg-white/10" />
      <div className="h-4 w-[28rem] max-w-full rounded bg-white/5" />
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-32 rounded-2xl border border-white/10 bg-surface"
          />
        ))}
      </div>
    </div>
  );
}