export function ProgressRing({ value, size = "large" }: { value: number; size?: "small" | "large" }) {
  const outer = size === "large" ? "size-28" : "size-16";
  const inner = size === "large" ? "size-[5.25rem]" : "size-12";
  const text = size === "large" ? "text-2xl" : "text-sm";
  const degrees = Math.max(0, Math.min(100, value)) * 3.6;
  return (
    <div
      className={`grid ${outer} shrink-0 place-items-center rounded-full`}
      style={{ background: `conic-gradient(var(--brand-600) 0deg ${degrees}deg, var(--mint-100) ${degrees}deg 360deg)` }}
      role="img"
      aria-label={`${value} percent estimated degree progress`}
    >
      <div className={`grid ${inner} place-items-center rounded-full bg-white`}>
        <span className={`${text} font-extrabold text-[var(--brand-950)]`}>{value}%</span>
      </div>
    </div>
  );
}
