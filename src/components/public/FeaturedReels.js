"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import ScrollReveal from "./ScrollReveal";
import ReelCard from "./ReelCard";
import ReelCardSkeleton from "./ReelCardSkeleton";
import styles from "./FeaturedReels.module.css";

export default function FeaturedReels() {
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchReels = async () => {
      try {
        const res = await fetch("/api/reels?limit=6");
        const data = await res.json();
        setReels(data.reels || []);
      } catch (err) {
        console.error("Error fetching featured reels:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReels();
  }, []);

  // Horizontal drag scroll
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let isDown = false, startX, scrollLeft;
    const onDown = (e) => { isDown = true; startX = e.pageX - el.offsetLeft; scrollLeft = el.scrollLeft; el.style.cursor = "grabbing"; };
    const onUp = () => { isDown = false; el.style.cursor = "grab"; };
    const onMove = (e) => { if (!isDown) return; e.preventDefault(); el.scrollLeft = scrollLeft - (e.pageX - el.offsetLeft - startX) * 1.2; };
    el.addEventListener("mousedown", onDown);
    el.addEventListener("mouseleave", onUp);
    el.addEventListener("mouseup", onUp);
    el.addEventListener("mousemove", onMove);
    return () => {
      el.removeEventListener("mousedown", onDown);
      el.removeEventListener("mouseleave", onUp);
      el.removeEventListener("mouseup", onUp);
      el.removeEventListener("mousemove", onMove);
    };
  }, [reels]);

  const placeholders = Array(6).fill(null);

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {/* Header — centered */}
        <div className={styles.header}>
          <ScrollReveal>
            <div className={styles.labelRow}>
              <span className={styles.labelLine} />
              <span className={styles.labelText}>Featured Work</span>
              <span className={styles.labelLine} />
            </div>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <h2 className={styles.heading}>
              Latest <span className={styles.headingGradient}>Reels</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <Link href="/reels" className={styles.viewAllLink}>
              View All
              <svg className={styles.viewAllArrow} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </ScrollReveal>
        </div>

        {/* Horizontal scroll gallery — smaller cards */}
        <div ref={scrollRef} className={styles.scrollGallery}>
          {(loading ? placeholders : reels).map((reel, i) => (
            <div key={reel?.id || i} className={styles.reelSlot}>
              <ScrollReveal delay={i * 80}>
                {loading || !reel ? (
                  <ReelCardSkeleton />
                ) : (
                  <ReelCard reel={reel} />
                )}
              </ScrollReveal>
            </div>
          ))}
        </div>

        {/* View all on mobile */}
        <div className={styles.mobileViewAll}>
          <Link href="/reels" className={styles.mobileViewAllLink}>
            View All Reels
            <svg className={styles.mobileViewAllIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
