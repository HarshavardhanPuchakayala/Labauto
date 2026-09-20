import { FiChevronDown } from "react-icons/fi";

const structure =
  "block w-full rounded-lg border bg-white text-sm text-slate-900 shadow-sm transition-all duration-200 motion-reduce:transition-none placeholder:text-slate-400 focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500";

const STATES = {
  default:
    "border-slate-300 hover:border-slate-400 focus:border-teal-500 focus:ring-teal-500/25",
  warning:
    "border-amber-400 hover:border-amber-500 focus:border-amber-500 focus:ring-amber-500/25",
};

const control = (state) => `${structure} ${STATES[state] || STATES.default}`;

/** Raw class string for anything that isn't one of the components below (e.g. custom inputs). */
export const controlClasses = `${control()} h-10 px-3`;

/** Wraps a control in a <label> so the label text is programmatically tied to the input. */
export function Field({ label, hint, className = "", children }) {
  return (
    <label className={`block ${className}`}>
      {label && <span className="mb-1.5 block text-sm font-medium text-slate-700">{label}</span>}
      {children}
      {hint && <span className="mt-1.5 block text-xs text-slate-500">{hint}</span>}
    </label>
  );
}

/**
 * icon:   leading icon component
 * suffix: short text (e.g. a unit) shown inside the right edge of the input
 * state:  "warning" swaps the border to amber (used for out-of-range values)
 */
export function Input({ icon: Icon, suffix, state, className = "", ...props }) {
  const left = Icon ? "pl-9" : "pl-3";
  const right = suffix ? (String(suffix).length > 6 ? "pr-24" : "pr-16") : "pr-3";
  const input = (
    <input className={`${control(state)} h-10 ${left} ${right} ${className}`} {...props} />
  );

  if (!Icon && !suffix) return input;

  return (
    <span className="relative block">
      {Icon && (
        <Icon
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
          aria-hidden="true"
        />
      )}
      {input}
      {suffix && (
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500">
          {suffix}
        </span>
      )}
    </span>
  );
}

export function Select({ className = "", children, ...props }) {
  return (
    <span className="relative block">
      <select className={`${control()} h-10 appearance-none pl-3 pr-9 ${className}`} {...props}>
        {children}
      </select>
      <FiChevronDown
        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
        aria-hidden="true"
      />
    </span>
  );
}

export function Textarea({ className = "", ...props }) {
  return <textarea className={`${control()} px-3 py-2 ${className}`} {...props} />;
}
