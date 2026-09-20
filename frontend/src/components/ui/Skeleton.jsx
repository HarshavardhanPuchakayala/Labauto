function Skeleton({ className = "" }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-slate-200/70 motion-reduce:animate-none ${className}`}
      aria-hidden="true"
    />
  );
}

export function TableSkeleton({ rows = 5, columns = 4 }) {
  return (
    <div
      role="status"
      className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
    >
      <span className="sr-only">Loading…</span>
      <div className="border-b border-slate-200 bg-slate-50 px-4 py-3.5">
        <Skeleton className="h-3 w-1/4" />
      </div>
      {Array.from({ length: rows }).map((_, r) => (
        <div
          key={r}
          className="flex items-center gap-6 border-b border-slate-100 px-4 py-4 last:border-b-0"
        >
          {Array.from({ length: columns }).map((__, c) => (
            <Skeleton key={c} className={`h-4 ${c === 0 ? "w-20" : "flex-1"}`} />
          ))}
        </div>
      ))}
    </div>
  );
}

export function CardSkeleton({ lines = 3, className = "" }) {
  return (
    <div
      role="status"
      className={`rounded-xl border border-slate-200 bg-white p-6 shadow-sm ${className}`}
    >
      <span className="sr-only">Loading…</span>
      <Skeleton className="mb-5 h-5 w-1/3" />
      <div className="space-y-3">
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton key={i} className={`h-4 ${i % 2 === 0 ? "w-full" : "w-2/3"}`} />
        ))}
      </div>
    </div>
  );
}

export default Skeleton;
