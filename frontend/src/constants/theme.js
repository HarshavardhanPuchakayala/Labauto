
import {
  FiAlertOctagon,
  FiCheckCircle,
  FiClock,
  FiDroplet,
  FiEdit3,
  FiSend,
  FiZap,
} from "react-icons/fi";

/**
 * Report lifecycle: pending -> sample_collected -> result_entered -> completed -> delivered.
 * "delivered" is not a stored status: it's derived from `deliveredAt` in the UI.
 */
export const REPORT_STATUS = {
  pending: {
    label: "Pending",
    icon: FiClock,
    badge: "bg-slate-100 text-slate-700 ring-slate-300",
    tile: "bg-slate-100 text-slate-600",
    dot: "bg-slate-400",
  },

  sample_collected: {
    label: "Sample collected",
    icon: FiDroplet,
    badge: "bg-amber-50 text-amber-800 ring-amber-300",
    tile: "bg-amber-100 text-amber-700",
    dot: "bg-amber-500",
  },

  result_entered: {
    label: "Result entered",
    icon: FiEdit3,
    badge: "bg-sky-50 text-sky-800 ring-sky-300",
    tile: "bg-sky-100 text-sky-700",
    dot: "bg-sky-500",
  },

  completed: {
    label: "Completed",
    icon: FiCheckCircle,
    badge: "bg-emerald-50 text-emerald-800 ring-emerald-300",
    tile: "bg-emerald-100 text-emerald-700",
    dot: "bg-emerald-500",
  },

  delivered: {
    label: "Delivered",
    icon: FiSend,
    badge: "bg-teal-700 text-white ring-teal-700",
    tile: "bg-teal-100 text-teal-700",
    dot: "bg-teal-600",
  },
};

export const REPORT_STATUS_ORDER = [
  "pending",
  "sample_collected",
  "result_entered",
  "completed",
  "delivered",
];

export const SUBSCRIPTION_STATUS = {
  trial: {
    label: "Trial",
    icon: FiZap,
    badge: "bg-sky-50 text-sky-800 ring-sky-300",
  },

  active: {
    label: "Active",
    icon: FiCheckCircle,
    badge: "bg-emerald-50 text-emerald-800 ring-emerald-300",
  },

  expired: {
    label: "Expired",
    icon: FiAlertOctagon,
    badge: "bg-rose-50 text-rose-800 ring-rose-300",
  },
};

export const formatStatus = (status) => {
  if (!status) return "";

  const text = status.replace(/_/g, " ");

  return text.charAt(0).toUpperCase() + text.slice(1);
};

/**
 * Shared table styling so every list in the app looks the same.
 */
export const tableStyles = {
  wrapper:
    "max-h-[70vh] overflow-auto rounded-xl border border-slate-200 bg-white shadow-sm",

  table:
    "w-full border-separate border-spacing-0 text-left text-sm",

  th:
    "sticky top-0 z-10 whitespace-nowrap border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs font-medium text-slate-500",

  tbody:
    "[&>tr:last-child>td]:border-b-0",

  row:
    "transition-colors duration-150 hover:bg-teal-50/50",

  td:
    "border-b border-slate-100 px-4 py-3.5 align-middle text-slate-700",
};