import Skeleton from "./Skeleton";

const DOTS = {
  teal: "bg-teal-500",
  emerald: "bg-emerald-500",
  amber: "bg-amber-500",
  sky: "bg-sky-500",
  rose: "bg-rose-500",
  slate: "bg-slate-400",
};

/**
 * One quiet card split into segments, rather than a row of separate KPI tiles.
 * items: [{ label, value, tone, hint }]
 */
function StatStrip({ items, loading = false, className = "" }) {
  return (
    <dl
      className={`flex flex-col divide-y divide-slate-200 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm sm:flex-row sm:divide-x sm:divide-y-0 ${className}`}
    >
      {items.map((item) => (
        <div key={item.label} className="flex-1 px-5 py-4">
          <dt className="flex items-center gap-2 text-sm text-slate-500">
            <span
              className={`h-2 w-2 rounded-full ${DOTS[item.tone] || DOTS.slate}`}
              aria-hidden="true"
            />
            {item.label}
          </dt>
          <dd className="mt-1.5 text-2xl font-semibold tabular-nums text-slate-900">
            {loading ? <Skeleton className="h-7 w-12" /> : item.value}
          </dd>
          {item.hint && <dd className="mt-0.5 text-xs text-slate-500">{item.hint}</dd>}
        </div>
      ))}
    </dl>
  );
}

export default StatStrip;
