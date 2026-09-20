import { REPORT_STATUS, SUBSCRIPTION_STATUS, formatStatus } from "../../constants/theme";

const TONES = {
  neutral: "bg-slate-100 text-slate-700 ring-slate-300",
  success: "bg-emerald-50 text-emerald-800 ring-emerald-300",
  warning: "bg-amber-50 text-amber-800 ring-amber-300",
  danger: "bg-rose-50 text-rose-800 ring-rose-300",
  info: "bg-sky-50 text-sky-800 ring-sky-300",
  brand: "bg-teal-50 text-teal-800 ring-teal-300",
};

const SIZES = {
  sm: { box: "gap-1 px-2 py-0.5 text-xs", icon: "h-3 w-3" },
  md: { box: "gap-1.5 px-2.5 py-1 text-xs", icon: "h-3.5 w-3.5" },
  lg: { box: "gap-2 px-3.5 py-1.5 text-sm", icon: "h-4 w-4" },
};

function BadgeBase({ classes, icon: Icon, size = "md", className = "", children }) {
  const s = SIZES[size] || SIZES.md;
  return (
    <span
      className={`inline-flex w-fit items-center whitespace-nowrap rounded-full font-medium ring-1 ring-inset ${s.box} ${classes} ${className}`}
    >
      {Icon && <Icon className={`${s.icon} shrink-0`} aria-hidden="true" />}
      {children}
    </span>
  );
}

function Badge({ tone = "neutral", icon, size, className, children }) {
  return (
    <BadgeBase classes={TONES[tone] || TONES.neutral} icon={icon} size={size} className={className}>
      {children}
    </BadgeBase>
  );
}

/** Report lifecycle badge: pending, sample_collected, result_entered, completed, delivered. */
export function StatusBadge({ status, size, className }) {
  const config = REPORT_STATUS[status];
  return (
    <BadgeBase
      classes={config?.badge || TONES.neutral}
      icon={config?.icon}
      size={size}
      className={className}
    >
      {config?.label || formatStatus(status)}
    </BadgeBase>
  );
}

/** Lab subscription badge: trial, active, expired. */
export function SubscriptionBadge({ status, size, className }) {
  const config = SUBSCRIPTION_STATUS[status];
  return (
    <BadgeBase
      classes={config?.badge || TONES.neutral}
      icon={config?.icon}
      size={size}
      className={className}
    >
      {config?.label || formatStatus(status)}
    </BadgeBase>
  );
}

export default Badge;
