"use client";

import { useEffect, useState } from "react";
import ReelCard from "@/components/public/ReelCard";
import ReelCardSkeleton from "@/components/public/ReelCardSkeleton";
import ScrollReveal from "@/components/public/ScrollReveal";
import styles from "./ReelsGrid.module.css";

const categories = ["All", "Mass Edit", "4K Cinematic", "Anime", "VFX", "Project File"];

export default function ReelsGrid() {
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState("All");

  useEffect(() => {
    const fetchReels = async () => {
      try {
        const res = await fetch("/api/reels");
        const data = await res.json();
        setReels(data.reels || []);
      } catch (err) {
        console.error("Error fetching reels:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReels();
  }, []);

  const filtered = active === "All"
    ? reels
    : reels.filter((r) => r.category?.toLowerCase() === active.toLowerCase());

  return (
    <div className={styles.wrapper}>
      {/* Filter tabs */}
      <ScrollReveal>
        <div className={styles.filters}>
          <div className={styles.filterRow}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={active === cat ? styles.filterBtnActive : styles.filterBtn}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </ScrollReveal>

      {/* Grid */}
      {loading ? (
        <div className={styles.grid}>
          {Array(8)
            .fill(null)
            .map((_, i) => (
              <ReelCardSkeleton key={i} />
            ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className={styles.empty}>
          <p className={styles.emptyTitle}>No reels found</p>
          <p className={styles.emptySubtitle}>Check back soon for new content</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {filtered.map((reel, i) => (
            <ScrollReveal key={reel.id} delay={i * 60} direction="scale">
              <ReelCard reel={reel} />
            </ScrollReveal>
          ))}
        </div>
      )}
    </div>
  );
}
