# Spotflow Agentic Payments & DevEx Challenge

Landing page for the Spotflow hackathon: online, plus a two-day hackathon in Lagos (November 6th and 7th) for 30 selected builders.

## Stack

- Next.js (App Router) + Tailwind CSS v4
- React Three Fiber / drei for the 3D "payment rail" hero
- Motion for UI animation, CSS 3D for the isometric section scenes
- `@blobatar/react`, `generative-loaders`, `border-beam`
- `next-themes` for light/dark mode

## Develop

```bash
npm install
npm run dev
```

## Where things live

- `src/lib/site.ts`: signup link, registration deadline, dates, site URL
- `src/components/hero/`: hero copy and the WebGL payment rail scene
- `src/components/sections/`: tracks, how it works, why join, register
- `src/components/iso/`: CSS 3D isometric primitives
- `src/app/opengraph-image.tsx`: generated social card

## Site URL

Metadata uses `NEXT_PUBLIC_SITE_URL` if set, otherwise Vercel's production/deployment URL. Set `NEXT_PUBLIC_SITE_URL` once a custom domain is attached.
