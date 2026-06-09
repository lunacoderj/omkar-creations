"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "/", label: "Home" },
    { href: "/reels", label: "Reels" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <>
      <nav className={`${styles.navbar} ${scrolled ? styles.navbarScrolled : ""}`}>
        <div className={styles.navInner}>
          {/* Logo */}
          <Link href="/" className={styles.logo}>
            <div className={styles.logoIcon}>
              <div className={styles.logoGradient} />
              <div className={styles.logoText}>OC</div>
            </div>
            <span className={styles.logoName}>OMKAR</span>
          </Link>

          {/* Desktop Links */}
          <div className={styles.desktopLinks}>
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`${styles.navLink} ${pathname === link.href ? styles.navLinkActive : ""}`}
              >
                {link.label}
                <span className={styles.navLinkUnderline} />
              </Link>
            ))}
            <div className={styles.divider} />
            <Link
              href="https://www.instagram.com/_omkar.creations_/"
              target="_blank"
              className={styles.igLink}
            >
              <svg className={styles.igIcon} viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              IG
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={styles.mobileToggle}
            aria-label="Menu"
          >
            <span className={`${styles.toggleLine} ${menuOpen ? styles.toggleLine1Open : ""}`} />
            <span className={`${styles.toggleLine} ${menuOpen ? styles.toggleLine2Open : ""}`} />
            <span className={`${styles.toggleLine} ${menuOpen ? styles.toggleLine3Open : ""}`} />
          </button>
        </div>
      </nav>

      {/* Full-screen mobile menu */}
      <div className={`${styles.mobileMenu} ${menuOpen ? styles.mobileMenuOpen : ""}`}>
        <div className={styles.mobileLinks}>
          {links.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`${styles.mobileLink} ${menuOpen ? styles.mobileLinkVisible : ""} ${pathname === link.href ? styles.mobileLinkActive : ""}`}
              style={{ transitionDelay: menuOpen ? `${i * 100 + 200}ms` : "0ms" }}
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div
          className={`${styles.mobileIg} ${menuOpen ? styles.mobileIgVisible : ""}`}
          style={{ transitionDelay: menuOpen ? "600ms" : "0ms" }}
        >
          <Link
            href="https://www.instagram.com/_omkar.creations_/"
            target="_blank"
            onClick={() => setMenuOpen(false)}
            className={styles.mobileIgLink}
          >
            @_omkar.creations_
          </Link>
        </div>
      </div>
    </>
  );
}
