import { Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

export function BackLink({ to, children }) {
  return (
    <Link
      to={to}
      className="group mb-5 inline-flex items-center gap-1.5 rounded text-sm font-medium text-slate-500 transition-colors hover:text-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
    >
      <FiArrowLeft
        className="h-4 w-4 transition-transform group-hover:-translate-x-0.5 motion-reduce:transition-none"
        aria-hidden="true"
      />
      {children}
    </Link>
  );
}

function PageHeader({ title, description, actions }) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{title}</h1>
        {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export default PageHeader;
