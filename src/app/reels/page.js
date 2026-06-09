import ReelsGrid from "./ReelsGrid";
import ScrollReveal from "@/components/public/ScrollReveal";
import styles from "./ReelsPage.module.css";

export const metadata = {
  title: "Reels | OMKAR CREATIONS",
  description: "Browse all reels by OMKAR CREATIONS — Mass edits, 4K cinematic, anime VFX, and downloadable project files.",
};

export default function ReelsPage() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <ScrollReveal>
            <div className={styles.headerLabel}>
              <span className={styles.headerLine} />
              <span className={styles.headerTag}>Portfolio</span>
              <span className={styles.headerLine} />
            </div>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <h1 className={styles.title}>
              All <span className={styles.titleAccent}>Reels</span>
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <p className={styles.subtitle}>
              Explore the full collection of cinematic edits, mass templates, and project files.
            </p>
          </ScrollReveal>
        </div>

        <ReelsGrid />
      </div>
    </section>
  );
}
