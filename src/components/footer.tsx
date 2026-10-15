import { SpotflowLogo } from "@/components/brand/logo";
import { site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="frame overflow-hidden px-5 pt-17 md:px-10 md:pt-23">
      <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm">
          <SpotflowLogo className="h-[22px] w-auto text-ink" />
          <p className="mt-4 text-[14px] leading-relaxed text-muted">
            Agentic Payments &amp; DevEx Challenge. Online + Lagos hackathon, {site.eventDates}.
          </p>
        </div>
        <nav aria-label="Footer" className="grid grid-cols-2 gap-x-14 gap-y-3 text-[14px]">
          <a href="#tracks" className="text-muted hover:text-ink">Tracks</a>
          <a href={site.signupUrl} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-ink">
            Signup form ↗
          </a>
          <a href="#how-it-works" className="text-muted hover:text-ink">How it works</a>
          <a href="#register" className="text-muted hover:text-ink">Register</a>
          <a href="#why" className="text-muted hover:text-ink">Why join</a>
          <a href="#top" className="text-muted hover:text-ink">Back to top ↑</a>
        </nav>
      </div>

      <div className="mt-16 flex items-center justify-between border-t border-line pt-6 font-mono text-[12px] text-faint">
        <span>© 2026 Spotflow</span>
        <span>Registrations end October 30th</span>
      </div>

      {/* Oversized wordmark that runs off the bottom of the page, fading into the background. */}
      <div
        aria-hidden="true"
        className="mt-12 h-[0.74em] select-none overflow-hidden text-center text-[clamp(3.4rem,14.6vw,11.4rem)] font-semibold leading-none tracking-[-0.055em]"
      >
        <span
          className="inline-block bg-clip-text text-transparent"
          style={{
            backgroundImage:
              "linear-gradient(180deg, color-mix(in oklab, var(--ink) 34%, var(--bg)) 0%, color-mix(in oklab, var(--ink) 6%, var(--bg)) 75%)",
          }}
        >
          Hacktoberfest
        </span>
      </div>
    </footer>
  );
}
