// Single source for copy-adjacent constants (links, dates, URLs).

function resolveSiteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  // Vercel exposes the stable production domain and the per-deploy domain.
  if (process.env.VERCEL_ENV === "production" && process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

export const site = {
  name: "Spotflow Agentic Payments & DevEx Challenge",
  shortName: "Spotflow Challenge",
  title: "Build the Future of Agentic Payments | Spotflow Agentic Payments & DevEx Challenge",
  description:
    "Build useful tools with AI and payment APIs, contribute to open source, and get an opportunity to join 30 selected builders for a two-day hackathon in Lagos.",
  url: resolveSiteUrl(),
  signupUrl: "https://forms.gle/YhewNoDt65jZLmiN9",
  // End of Oct 30 in Lagos (WAT, UTC+1).
  registrationDeadline: "2026-10-30T23:59:59+01:00",
  eventDates: "November 13th and 14th",
  eventDatesShort: "Nov 13–14",
  builders: 30,
} as const;
