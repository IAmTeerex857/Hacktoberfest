"use client";

import { motion } from "motion/react";
import { Rocket } from "lucide-react";
import { CopyButton, SlideArrowButton } from "@/components/ui/buttons";
import { Countdown } from "@/components/ui/countdown";
import { SectionHeader } from "@/components/ui/section-header";
import { Asterisk, Plus, WireCube } from "@/components/ui/doodles";
import { CalendarIcon, HourglassIcon, PinIcon } from "@/components/ui/flat-icons";
import { site } from "@/lib/site";
import { BuilderPass } from "./builder-pass";

const details = [
  { icon: <PinIcon />, label: "Where", text: "Online + Lagos hackathon" },
  { icon: <CalendarIcon />, label: "When", text: site.eventDates },
  { icon: <HourglassIcon />, label: "Deadline", text: "Registrations end on the 30th of October" },
];

export function Register() {
  return (
    <section id="register" className="frame relative scroll-mt-16 px-5 py-19 md:px-10 md:py-26">
      <Plus className="right-4 top-24 hidden md:block" />
      <WireCube className="bottom-16 left-[46%] hidden lg:block" size={44} />
      <Asterisk className="bottom-24 right-[6%] hidden lg:block" size={18} />

      <div className="grid items-center gap-16 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
        <div>
          <SectionHeader index="04" eyebrow="Register" title="Join the challenge now">
            Register now and pick your track. Registrations end on the 30th of October.
          </SectionHeader>

          <motion.ul
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-12 flex flex-col gap-5"
          >
            {details.map((d) => (
              <li key={d.label} className="flex items-center gap-4">
                {d.icon}
                <span className="flex flex-col">
                  <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-faint">{d.label}</span>
                  <span className="text-[15.5px] font-medium text-ink">{d.text}</span>
                </span>
              </li>
            ))}
          </motion.ul>

          <div className="mt-12 flex flex-wrap items-center gap-3">
            <SlideArrowButton href={site.signupUrl} external size="lg" icon={<Rocket className="size-4" />} loadingLabel="Opening form…">
              Join the challenge
            </SlideArrowButton>
            <CopyButton value={site.signupUrl} label="Copy signup link" size="lg" variant="secondary" />
          </div>

          <div className="mt-10 inline-flex flex-col gap-2 rounded-2xl border border-line bg-surface px-5 py-4">
            <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-faint">Registration closes in</span>
            <span className="text-[26px] font-semibold text-ink">
              <Countdown to={site.registrationDeadline} />
            </span>
          </div>

          <p className="mt-10 max-w-[520px] border-l-2 border-blue pl-4 text-[14.5px] italic leading-relaxed text-muted">
            One signup. Choose your track and indicate your interest in the Lagos hackathon. Physical attendance is
            subject to selection. Lots of swag and prizes to be won.
          </p>
        </div>

        <BuilderPass />
      </div>
    </section>
  );
}
