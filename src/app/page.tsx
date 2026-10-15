import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero/hero";
import { HeroStrip } from "@/components/hero/hero-strip";
import { Ticker } from "@/components/sections/ticker";
import { Tracks } from "@/components/sections/tracks";
import { HowItWorks } from "@/components/sections/how-it-works";
import { Why } from "@/components/sections/why";
import { Register } from "@/components/sections/register";

export default function Home() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        <Hero />
        <HeroStrip />
        <Ticker />
        <Tracks />
        <HowItWorks />
        <Why />
        <Register />
      </main>
      <Footer />
    </>
  );
}
