"use client";

import Marquee from "./Marquee";
import ScrollReveal from "./ScrollReveal";

const skills = [
  { name: "Alight Motion", color: "text-accent" },
  { name: "CapCut", color: "text-accent-2" },
  { name: "4K Editing", color: "text-accent-3" },
  { name: "Color Grading", color: "text-accent-4" },
  { name: "Anime VFX", color: "text-accent" },
  { name: "Motion Graphics", color: "text-accent-2" },
  { name: "Beat Sync", color: "text-accent-3" },
  { name: "Transitions", color: "text-accent-4" },
  { name: "Typography", color: "text-accent" },
  { name: "Sound Design", color: "text-accent-2" },
];

const tools = [
  "Instagram Reels",
  "YouTube Shorts",
  "WhatsApp Status",
  "Mass Edit Templates",
  "Project Files",
  "Photo Editing",
];

export default function SkillsShowcase() {
  return (
    <section className="relative py-32 sm:py-48 overflow-hidden">
      <ScrollReveal className="mb-12 text-center">
        <span className="text-accent text-[11px] tracking-[0.3em] uppercase font-heading">
          Skills & Tools
        </span>
      </ScrollReveal>

      {/* Skills marquee */}
      <Marquee speed={35} className="py-10 sm:py-14 border-y border-border/20">
        <div className="flex items-center gap-0 shrink-0">
          {skills.map((s, i) => (
            <div key={i} className="flex items-center shrink-0">
              <span className={`${s.color} font-display font-bold text-3xl sm:text-5xl tracking-tight whitespace-nowrap px-4 sm:px-6 hover:scale-110 transition-transform duration-300 cursor-default`}>
                {s.name}
              </span>
              <span className="text-accent/30 text-lg select-none">✦</span>
            </div>
          ))}
        </div>
      </Marquee>

      {/* Tools marquee - reverse */}
      <Marquee speed={40} reverse className="py-10 sm:py-14 border-b border-border/20">
        <div className="flex items-center gap-0 shrink-0">
          {tools.map((t, i) => (
            <div key={i} className="flex items-center shrink-0">
              <span className="text-text-muted font-heading text-lg sm:text-2xl tracking-wider uppercase whitespace-nowrap px-4 sm:px-6 hover:text-text transition-colors duration-300 cursor-default">
                {t}
              </span>
              <span className="text-accent-2/30 text-sm select-none">◆</span>
            </div>
          ))}
        </div>
      </Marquee>
    </section>
  );
}
