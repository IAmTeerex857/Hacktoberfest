// Fills use currentColor so the logo follows the theme.
import type { SVGProps } from "react";
import { LOGO_PATHS, MARK_PATH } from "./paths";

export function SpotflowLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 118 24" fill="currentColor" role="img" aria-label="Spotflow" {...props}>
      {LOGO_PATHS.map((d) => (
        <path key={d.slice(0, 24)} d={d} />
      ))}
    </svg>
  );
}

export function SpotflowMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 26 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d={MARK_PATH} />
    </svg>
  );
}
