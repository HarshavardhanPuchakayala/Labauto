import { FiCheck } from "react-icons/fi";
import Logo from "./Logo";

// One well per sample: fill colours match the report status palette.
const WELL_FILLS = ["#cbd5e1", "#fbbf24", "#38bdf8", "#34d399", "#5eead4"];
const LEGEND = [
  { label: "Pending", color: WELL_FILLS[0] },
  { label: "Sample collected", color: WELL_FILLS[1] },
  { label: "Result entered", color: WELL_FILLS[2] },
  { label: "Completed", color: WELL_FILLS[3] },
  { label: "Delivered", color: WELL_FILLS[4] },
];
const COLS = 12;
const ROWS = 8;
const GAP = 28;
const OX = 44;
const OY = 46;

function WellPlate() {
  const wells = [];
  for (let r = 0; r < ROWS; r += 1) {
    for (let c = 0; c < COLS; c += 1) {
      const n = (r * 7 + c * 5 + r * c) % 11;
      wells.push({ r, c, fill: n < WELL_FILLS.length ? WELL_FILLS[n] : null });
    }
  }

  return (
    <div aria-hidden="true">
      <svg viewBox="0 0 380 272" className="w-full max-w-md">
        <polygon
          points="36,4 364,4 376,16 376,256 364,268 16,268 4,256 4,36"
          fill="rgba(255,255,255,0.05)"
          stroke="rgba(255,255,255,0.25)"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        {Array.from({ length: COLS }).map((_, c) => (
          <text
            key={`c${c}`}
            x={OX + c * GAP}
            y={26}
            textAnchor="middle"
            fontSize="9"
            fill="rgba(153,246,228,0.6)"
          >
            {c + 1}
          </text>
        ))}
        {Array.from({ length: ROWS }).map((_, r) => (
          <text
            key={`r${r}`}
            x={20}
            y={OY + r * GAP + 3}
            textAnchor="middle"
            fontSize="9"
            fill="rgba(153,246,228,0.6)"
          >
            {String.fromCharCode(65 + r)}
          </text>
        ))}
        {wells.map((w) => (
          <circle
            key={`${w.r}-${w.c}`}
            cx={OX + w.c * GAP}
            cy={OY + w.r * GAP}
            r="9.5"
            fill={w.fill || "rgba(255,255,255,0.03)"}
            fillOpacity={w.fill ? 0.92 : 1}
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="1"
          />
        ))}
      </svg>
      <ul className="mt-4 flex max-w-md flex-wrap gap-x-4 gap-y-1.5 text-xs text-teal-100/80">
        {LEGEND.map((item) => (
          <li key={item.label} className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

function AuthShell({
  title,
  subtitle,
  children,
  footer,
  wide = false,
  headline,
  description,
  points,
}) {
  return (
    <div className="min-h-screen bg-white lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
      <aside className="hidden flex-col justify-between bg-teal-900 p-12 lg:flex">
        <Logo onDark />

        <div className="my-10">
          <h2 className="max-w-md text-3xl font-semibold leading-tight tracking-tight text-white">
            {headline}
          </h2>
          {description && (
            <p className="mt-3 max-w-md text-base leading-relaxed text-teal-100/80">
              {description}
            </p>
          )}
          {points && (
            <ul className="mt-6 space-y-2.5">
              {points.map((point) => (
                <li key={point} className="flex items-center gap-2.5 text-sm text-teal-50">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-400/20 text-teal-200">
                    <FiCheck className="h-3 w-3" aria-hidden="true" />
                  </span>
                  {point}
                </li>
              ))}
            </ul>
          )}
        </div>

        <WellPlate />
      </aside>

      <main className="flex min-h-screen flex-col justify-center px-4 py-10 sm:px-10 lg:min-h-0 lg:px-16">
        <div className={`mx-auto w-full ${wide ? "max-w-2xl" : "max-w-md"}`}>
          <div className="mb-8 lg:hidden">
            <Logo />
          </div>

          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{title}</h1>
          {subtitle && <p className="mt-1.5 text-sm text-slate-500">{subtitle}</p>}

          <div className="mt-8">{children}</div>

          {footer && <p className="mt-6 text-sm text-slate-500">{footer}</p>}
        </div>
      </main>
    </div>
  );
}

export default AuthShell;
