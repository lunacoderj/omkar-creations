"use client";

import Link from "next/link";
import Marquee from "./Marquee";
import styles from "./Footer.module.css";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      {/* Subtle kinetic name — compact */}
      <Marquee speed={30} className={styles.marqueeBand}>
        <div className={styles.marqueeItems}>
          {Array(6)
            .fill("OMKAR CREATIONS")
            .map((t, i) => (
              <div key={i} className={styles.marqueeItem}>
                <span className={styles.marqueeText}>{t}</span>
                <span className={styles.marqueeDot}>✦</span>
              </div>
            ))}
        </div>
      </Marquee>

      <div className={styles.content}>
        <div className={styles.grid}>
          {/* Brand */}
          <div className={styles.brand}>
            <span className={styles.brandName}>
              OMKAR<span className={styles.brandDot}>.</span>
            </span>
            <p className={styles.brandDesc}>
              Turning frames into art — PC-level edits from a smartphone.
            </p>
          </div>

          {/* Nav */}
          <div className={styles.navCol}>
            <span className={styles.colTitle}>Navigate</span>
            <div className={styles.colLinks}>
              {[
                { href: "/", label: "Home" },
                { href: "/reels", label: "Reels" },
                { href: "/contact", label: "Contact" },
              ].map((l) => (
                <Link key={l.href} href={l.href} className={styles.colLink}>
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Connect */}
          <div className={styles.connectCol}>
            <span className={styles.colTitle}>Connect</span>
            <div className={styles.colLinks}>
              <Link
                href="https://www.instagram.com/_omkar.creations_/"
                target="_blank"
                className={styles.colLink}
              >
                Instagram
              </Link>
              <Link
                href="mailto:contact@omkarcreations.com"
                className={styles.colLink}
              >
                Email
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className={styles.bottomBar}>
          <p className={styles.copyright}>
            © {year} OMKAR CREATIONS. All rights reserved.
          </p>
          <p className={styles.madeWith}>
            Crafted with ♡ for the creator community
          </p>
        </div>
      </div>
    </footer>
  );
}
