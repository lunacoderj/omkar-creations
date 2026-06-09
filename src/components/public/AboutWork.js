"use client";

import ScrollReveal from "./ScrollReveal";
import styles from "./AboutWork.module.css";

const services = [
  {
    num: "01",
    title: "Mass Edits",
    desc: "Custom video templates that let you swap images and create personalized reels for Instagram Stories and WhatsApp Status in minutes.",
    colorClass: "colorAccent",
  },
  {
    num: "02",
    title: "4K Cinematic",
    desc: "Full cinematic-grade editing with color grading, smooth transitions, and beat-synced visuals — all from a smartphone.",
    colorClass: "colorAccent2",
  },
  {
    num: "03",
    title: "Anime × VFX",
    desc: "Blending anime aesthetics with real-world footage using advanced compositing, glow effects, and kinetic typography.",
    colorClass: "colorAccent3",
  },
  {
    num: "04",
    title: "Project Files",
    desc: "Downloadable source files for Alight Motion and CapCut — letting creators remix and customize the templates.",
    colorClass: "colorAccent4",
  },
];

export default function AboutWork() {
  return (
    <section className={styles.section}>
      <div className={styles.bgGradient} />

      <div className={styles.container}>
        {/* Section header — all centered */}
        <div className={styles.header}>
          <ScrollReveal>
            <div className={styles.labelRow}>
              <span className={styles.labelLine} />
              <span className={styles.labelText}>What I Do</span>
              <span className={styles.labelLine} />
            </div>
          </ScrollReveal>

          <ScrollReveal delay={100}>
            <h2 className={styles.heading}>
              Turning Frames
              <br />
              <span className={styles.headingGradient}>into Art</span>
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={200}>
            <p className={styles.description}>
              OMKAR CREATIONS specializes in mobile-first video editing that rivals
              desktop quality. From 4K cinematic reels to mass-edit templates — every
              piece is crafted with precision and passion.
            </p>
          </ScrollReveal>
        </div>

        {/* Services grid — centered */}
        <div className={styles.grid}>
          {services.map((s, i) => (
            <ScrollReveal key={s.num} delay={i * 80}>
              <div className={styles.card}>
                <div className={styles.cardGlow} />
                <div className={styles.cardContent}>
                  <span className={`${styles.cardNum} ${styles[s.colorClass]}`}>
                    {s.num}
                  </span>
                  <h3 className={styles.cardTitle}>{s.title}</h3>
                  <p className={styles.cardDesc}>{s.desc}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
