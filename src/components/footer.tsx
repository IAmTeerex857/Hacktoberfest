import { SpotflowLogo, SpotflowMark } from "@/components/brand/logo";
import { FrameNodes } from "@/components/ui/doodles";
import { site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="frame hairline-t relative overflow-hidden">
      <FrameNodes />
      <div className="relative z-10 flex flex-col gap-10 px-5 py-14 md:flex-row md:items-start md:justify-between md:px-12">
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

      <div className="hairline-t relative z-10 flex items-center justify-between px-5 py-5 font-mono text-[12px] text-faint md:px-12">
        <span>© 2026 Spotflow</span>
        <span>Registrations end October 30th</span>
      </div>

      <SpotflowMark
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-28 left-1/2 hidden h-[280px] w-auto -translate-x-1/2 text-line lg:block"
      />
    </footer>
  );
}
