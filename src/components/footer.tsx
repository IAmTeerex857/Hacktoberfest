import { SpotflowLogo } from "@/components/brand/logo";
import { site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="frame px-5 pb-10 pt-19 md:px-10 md:pt-26">
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
    </footer>
  );
}
