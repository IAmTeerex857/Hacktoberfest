/* Flat, structured two-tone icons: solid fills on a soft tile, no outlines. */

const tile = "flex size-11 shrink-0 items-center justify-center rounded-xl";

export function PinIcon() {
  return (
    <span className={`${tile} bg-blue-soft`} aria-hidden="true">
      <svg viewBox="0 0 24 24" width={24} height={24}>
        <ellipse cx="12" cy="20.5" rx="5" ry="1.5" fill="var(--blue)" opacity={0.25} />
        <path d="M12 2a7 7 0 0 0-7 7c0 5 7 11 7 11s7-6 7-11a7 7 0 0 0-7-7z" fill="var(--blue)" />
        <circle cx="12" cy="9" r="2.6" fill="#fff" />
      </svg>
    </span>
  );
}

export function CalendarIcon() {
  return (
    <span className={`${tile} bg-blue-soft`} aria-hidden="true">
      <svg viewBox="0 0 24 24" width={24} height={24}>
        <rect x="3" y="5" width="18" height="16" rx="3" fill="#fff" />
        <path d="M3 8a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v2H3z" fill="var(--blue)" />
        <rect x="7" y="2.5" width="2" height="5" rx="1" fill="var(--ink)" />
        <rect x="15" y="2.5" width="2" height="5" rx="1" fill="var(--ink)" />
        <rect x="6" y="13" width="3" height="3" rx="0.8" fill="#d4d4da" />
        <rect x="10.5" y="13" width="3" height="3" rx="0.8" fill="var(--green)" />
        <rect x="15" y="13" width="3" height="3" rx="0.8" fill="var(--green)" />
        <rect x="6" y="17" width="3" height="2" rx="0.8" fill="#d4d4da" />
      </svg>
    </span>
  );
}

export function HourglassIcon() {
  return (
    <span className={`${tile} bg-green-soft`} aria-hidden="true">
      <svg viewBox="0 0 24 24" width={24} height={24}>
        <rect x="5" y="2.5" width="14" height="3" rx="1.2" fill="var(--ink)" />
        <rect x="5" y="18.5" width="14" height="3" rx="1.2" fill="var(--ink)" />
        <path d="M7 5.5h10c0 3.5-3 5-5 6.5-2-1.5-5-3-5-6.5z" fill="#fff" />
        <path d="M7 18.5h10c0-3.5-3-5-5-6.5-2 1.5-5 3-5 6.5z" fill="#fff" />
        <path d="M9.5 8h5c-.6 1.3-1.6 2-2.5 2.7-.9-.7-1.9-1.4-2.5-2.7z" fill="var(--green)" />
        <path d="M8.5 18.5h7c-.5-1.8-2-2.8-3.5-3.6-1.5.8-3 1.8-3.5 3.6z" fill="var(--green)" />
      </svg>
    </span>
  );
}
