import { FiAlertCircle, FiAlertTriangle, FiCheckCircle, FiInfo } from "react-icons/fi";

const TONES = {
  error: { box: "border-rose-200 bg-rose-50 text-rose-800", icon: FiAlertCircle },
  success: { box: "border-emerald-200 bg-emerald-50 text-emerald-800", icon: FiCheckCircle },
  warning: { box: "border-amber-200 bg-amber-50 text-amber-800", icon: FiAlertTriangle },
  info: { box: "border-sky-200 bg-sky-50 text-sky-800", icon: FiInfo },
};

function Alert({ tone = "error", className = "", children }) {
  const { box, icon: Icon } = TONES[tone] || TONES.error;
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={`flex items-start gap-3 rounded-lg border px-4 py-3 text-sm ${box} ${className}`}
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <div className="min-w-0">{children}</div>
    </div>
  );
}

export default Alert;
