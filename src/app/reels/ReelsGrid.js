"use client";

import { useEffect, useState } from "react";
import ReelCard from "@/components/public/ReelCard";
import ReelCardSkeleton from "@/components/public/ReelCardSkeleton";
import ScrollReveal from "@/components/public/ScrollReveal";
import styles from "./ReelsGrid.module.css";

const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "trending", label: "Trending" },
  { id: "tollywood", label: "Tollywood" },
  { id: "mass_edit", label: "Mass Edit" },
  { id: "sad_edit", label: "Sad & Emotional" },
  { id: "love_edit", label: "Love & Romantic" },
  { id: "melody", label: "Melody" },
  { id: "anime", label: "Anime" },
  { id: "vfx", label: "VFX & Motion" },
  { id: "devotional", label: "Devotional" },
  { id: "project_file", label: "Project Files" },
  { id: "other", label: "Other" }
];

export default function ReelsGrid() {
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState("all");

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

  const filtered = active === "all"
    ? reels
    : reels.filter((r) => r.rawCategories?.includes(active) || r.rawCategory === active);

  return (
    <div className={styles.wrapper}>
      {/* Filter tabs */}
      <ScrollReveal>
        <div className={styles.filters}>
          <div className={styles.filterRow}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActive(cat.id)}
                className={active === cat.id ? styles.filterBtnActive : styles.filterBtn}
              >
                {cat.label}
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
