export function FlaskIcon({ className = "h-5 w-5" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2" />
      <path d="M8.5 2h7" />
      <path d="M7 16h10" />
    </svg>
  );
}



function Logo({ onDark = false, className = "", imgClassName = "h-10" }) {
  return (
    <span
      className={`inline-flex items-center ${
        onDark ? "rounded-lg bg-white px-2.5 py-1.5" : ""
      } ${className}`}
    >
      <img
        src="/assets/Labcore.png"
        alt="LabAuto"
        className={`${imgClassName} w-auto object-contain`}
      />
    </span>
  );
}

export default Logo;