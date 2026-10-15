"use client";

import { CalendarDays, Hourglass, MapPin } from "lucide-react";
import { motion } from "motion/react";
import { Countdown } from "@/components/ui/countdown";
import { FrameNodes } from "@/components/ui/doodles";
import { site } from "@/lib/site";

const facts = [
  { icon: MapPin, label: "Where", value: "Online + Lagos hackathon", tint: "text-blue" },
  { icon: CalendarDays, label: "When", value: site.eventDates, tint: "text-blue" },
  { icon: Hourglass, label: "Register by", value: "October 30th", tint: "text-green" },
];

export function HeroStrip() {
  return (
    <section aria-label="Key dates" className="frame hairline-t relative">
      <FrameNodes />
      <div className="grid grid-cols-3 md:grid-cols-[1fr_1fr_1fr_1.35fr]">
        {facts.map((f, i) => (
          <motion.div
            key={f.label}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.06 }}
            className={`flex min-h-[5.5rem] flex-col justify-center gap-1.5 border-b border-line px-4 py-4 md:border-b-0 md:border-r md:px-8 ${i < 2 ? "border-r" : ""}`}
          >
            <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-faint">
              <f.icon className={`size-3.5 ${f.tint}`} /> {f.label}
            </span>
            <span className="text-[13px] font-medium leading-snug text-ink md:text-[15px]">{f.value}</span>
          </motion.div>
        ))}
        <div className="col-span-3 flex min-h-[5.5rem] items-center justify-between gap-4 px-4 py-4 md:col-span-1 md:px-8">
          <span className="font-mono text-[11px] uppercase leading-relaxed tracking-[0.14em] text-faint">
            Registration
            <br />
            closes in
          </span>
          <span className="text-[22px] font-semibold text-ink">
            <Countdown to={site.registrationDeadline} />
          </span>
        </div>
      </div>
    </section>
  );
}
