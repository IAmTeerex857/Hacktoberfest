"use client";

import { motion } from "motion/react";
import { CalendarDays, Hourglass, MapPin, Rocket } from "lucide-react";
import { CopyButton, SlideArrowButton } from "@/components/ui/buttons";
import { Countdown } from "@/components/ui/countdown";
import { SectionHeader } from "@/components/ui/section-header";
import { Asterisk, FrameNodes, Plus, WireCube } from "@/components/ui/doodles";
import { site } from "@/lib/site";
import { BuilderPass } from "./builder-pass";

const details = [
  { icon: MapPin, text: "Online + Lagos hackathon", tint: "text-blue" },
  { icon: CalendarDays, text: site.eventDates, tint: "text-blue" },
  { icon: Hourglass, text: "Registrations end on the 30th of October", tint: "text-green" },
];

export function Register() {
  return (
    <section id="register" className="frame hairline-t relative scroll-mt-16 overflow-hidden">
      <FrameNodes />
      <Plus className="right-6 top-8 hidden md:block" />
      <WireCube className="bottom-10 left-[44%] hidden lg:block" size={44} />
      <Asterisk className="right-[8%] bottom-16 hidden lg:block" size={18} />

      <div className="grid items-center gap-12 px-5 py-20 md:grid-cols-[1.1fr_0.9fr] md:px-12 md:py-28">
        <div>
          <SectionHeader index="04" eyebrow="Register" title="Join the challenge now">
            Register now and pick your track. Registrations end on the 30th of October.
          </SectionHeader>

          <motion.ul
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-8 flex flex-col gap-3"
          >
            {details.map((d) => (
              <li key={d.text} className="flex items-center gap-3 text-[15px] text-ink-2">
                <span className="flex size-8 items-center justify-center rounded-full border border-line bg-surface">
                  <d.icon className={`size-4 ${d.tint}`} />
                </span>
                {d.text}
              </li>
            ))}
          </motion.ul>

          <div className="relative mt-9 flex flex-wrap items-center gap-3">
            <SlideArrowButton href={site.signupUrl} external size="lg" icon={<Rocket className="size-4" />} loadingLabel="Opening form…">
              Join the challenge
            </SlideArrowButton>
            <CopyButton value={site.signupUrl} label="Copy signup link" size="lg" variant="secondary" />
          </div>

          <div className="mt-8 inline-flex flex-col gap-2 rounded-2xl border border-line bg-surface px-5 py-4">
            <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-faint">Registration closes in</span>
            <span className="text-[26px] font-semibold text-ink">
              <Countdown to={site.registrationDeadline} />
            </span>
          </div>

          <p className="mt-8 max-w-[520px] border-l-2 border-blue pl-4 text-[14.5px] italic leading-relaxed text-muted">
            One signup. Choose your track and indicate your interest in the Lagos hackathon. Physical attendance is
            subject to selection. Lots of swag and prizes to be won.
          </p>
        </div>

        <BuilderPass />
      </div>
    </section>
  );
}
