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