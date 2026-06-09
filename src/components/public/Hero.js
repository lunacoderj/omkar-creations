"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import styles from "./Hero.module.css";

const roles = ["Mobile Editor", "4K Visuals", "Mass Edits", "Anime Art", "Cinematic VFX"];

const stats = [
  { value: "138+", label: "Reels Created", colorClass: "colorAccent" },
  { value: "4K", label: "Quality", colorClass: "colorAccent3" },
  { value: "748+", label: "Followers", colorClass: "colorAccent2" },
  { value: "100%", label: "Mobile", colorClass: "colorAccent4" },
];

export default function Hero() {
  const [show, setShow] = useState(false);
  const [roleIdx, setRoleIdx] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const heroRef = useRef(null);

  useEffect(() => {
    setShow(true);
    const timer = setInterval(() => setRoleIdx((p) => (p + 1) % roles.length), 2500);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleMouse = (e) => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      setMousePos({ x, y });
    };
    const el = heroRef.current;
    if (el) el.addEventListener("mousemove", handleMouse);
    return () => { if (el) el.removeEventListener("mousemove", handleMouse); };
  }, []);

  return (
    <section ref={heroRef} className={styles.section}>
      {/* Parallax floating orbs */}
      <div
        className={`${styles.orb} ${styles.orb1}`}
        style={{ transform: `translate3d(${mousePos.x * -30}px, ${mousePos.y * -30}px, 0)` }}
      />
      <div
        className={`${styles.orb} ${styles.orb2}`}
        style={{ transform: `translate3d(${mousePos.x * 25}px, ${mousePos.y * 25}px, 0)` }}
      />
      <div
        className={`${styles.orb} ${styles.orb3}`}
        style={{ transform: `translate3d(${mousePos.x * 20}px, ${mousePos.y * -20}px, 0)` }}
      />

      {/* Floating icons */}
      <div
        className={styles.floatIcon}
        style={{
          top: "18%", left: "12%", fontSize: "28px", opacity: 0.15,
          transform: `translate3d(${mousePos.x * -40}px, ${mousePos.y * -40}px, 0)`,
        }}
      >🎬</div>
      <div
        className={styles.floatIcon}
        style={{
          top: "25%", right: "15%", fontSize: "24px", opacity: 0.1,
          transform: `translate3d(${mousePos.x * 35}px, ${mousePos.y * 35}px, 0)`,
        }}
      >🎵</div>
      <div
        className={styles.floatIcon}
        style={{
          bottom: "25%", left: "18%", fontSize: "28px", opacity: 0.1,
          transform: `translate3d(${mousePos.x * -25}px, ${mousePos.y * 20}px, 0)`,
        }}
      >✨</div>
      <div
        className={styles.floatIcon}
        style={{
          bottom: "30%", right: "10%", fontSize: "24px", opacity: 0.1,
          transform: `translate3d(${mousePos.x * 30}px, ${mousePos.y * -30}px, 0)`,
        }}
      >🎌</div>

      {/* Main content — everything centered */}
      <div className={styles.content}>
        {/* Status badge */}
        <div className={`${styles.badge} ${show ? styles.badgeVisible : styles.badgeHidden}`}>
          <span className={styles.badgeDot} />
          <span className={styles.badgeText}>Available for Collab</span>
        </div>

        {/* Title */}
        <div className={styles.titleWrap}>
          <div
            className={`${styles.titleLine} ${show ? styles.titleVisible : styles.titleHidden}`}
            style={{ transitionDelay: "200ms" }}
          >
            OMKAR
          </div>
        </div>
        <div className={styles.titleWrap2}>
          <div
            className={`${styles.titleGradient} ${show ? styles.titleVisible : styles.titleHidden}`}
            style={{ transitionDelay: "400ms" }}
          >
            CREATIONS
          </div>
        </div>

        {/* Rotating role */}
        <div
          className={`${styles.roleWrap} ${show ? styles.visible : styles.hidden}`}
          style={{ transitionDelay: "600ms" }}
        >
          <div className={styles.roleInner}>
            <span className={styles.roleLine} />
            <p className={styles.roleText} key={roleIdx}>
              {roles[roleIdx]}
            </p>
            <span className={styles.roleLine} />
          </div>
        </div>

        {/* Tagline */}
        <p
          className={`${styles.tagline} ${show ? styles.visible : styles.hidden}`}
          style={{ transitionDelay: "700ms" }}
        >
          Crafting PC-level cinematic edits entirely from a smartphone.
          <br className={styles.taglineBr} />
          Every frame is a canvas — from mass edits to anime art.
        </p>

        {/* CTAs */}
        <div
          className={`${styles.ctaRow} ${show ? styles.ctaVisible : styles.ctaHidden}`}
          style={{ transitionDelay: "900ms" }}
        >
          <Link href="/reels" className={styles.ctaPrimary}>
            <span className={styles.ctaPrimaryBg} />
            <span className={styles.ctaPrimaryGlow} />
            <span className={styles.ctaPrimaryLabel}>Explore Reels</span>
          </Link>
          <Link href="/contact" className={styles.ctaSecondary}>
            Get in Touch
          </Link>
        </div>

        {/* Stats row */}
        <div
          className={`${styles.statsWrap} ${show ? styles.statsVisible : styles.statsHidden}`}
          style={{ transitionDelay: "1100ms" }}
        >
          <div className={styles.statsGrid}>
            {stats.map((stat) => (
              <div key={stat.label} className={styles.statCard}>
                <div className={`${styles.statValue} ${styles[stat.colorClass]}`}>
                  {stat.value}
                </div>
                <p className={styles.statLabel}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className={styles.scrollIndicator}
        style={{ opacity: show ? 0.5 : 0, transitionDelay: "1400ms" }}
      >
        <span className={styles.scrollText}>Scroll</span>
        <div className={styles.scrollLine} />
      </div>
    </section>
  );
}
