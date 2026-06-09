"use client";

import { useState } from "react";
import ScrollReveal from "@/components/public/ScrollReveal";
import styles from "./ContactContent.module.css";

const contactMethods = [
  {
    icon: (
      <svg className={styles.iconSvg} viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
    label: "Instagram",
    value: "@_omkar.creations_",
    href: "https://www.instagram.com/_omkar.creations_/",
    iconClass: styles.iconAccent4,
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="20" height="20">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
    label: "Email",
    value: "contact@omkarcreations.com",
    href: "mailto:contact@omkarcreations.com",
    iconClass: styles.iconAccent,
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="20" height="20">
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
      </svg>
    ),
    label: "Phone",
    value: "+91 XXXXX XXXXX",
    href: "tel:+91XXXXXXXXXX",
    iconClass: styles.iconAccent3,
  },
];

export default function ContactContent() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    // Simulate send
    await new Promise((r) => setTimeout(r, 1500));
    setSent(true);
    setSending(false);
  };

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <ScrollReveal>
            <div className={styles.headerLabel}>
              <span className={styles.headerLine} />
              <span className={styles.headerTag}>Get in Touch</span>
              <span className={styles.headerLine} />
            </div>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <h1 className={styles.title}>
              Let&apos;s <span className={styles.titleAccent}>Connect</span>
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <p className={styles.subtitle}>
              Have a project in mind? Want to collaborate or need custom edits?
              Drop a message or reach out directly.
            </p>
          </ScrollReveal>
        </div>

        <div className={styles.grid}>
          {/* Contact methods */}
          <div className={styles.methods}>
            {contactMethods.map((m, i) => (
              <ScrollReveal key={m.label} delay={i * 100} direction="left">
                <a
                  href={m.href}
                  target={m.href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className={styles.methodCard}
                >
                  <div className={`${styles.methodIcon} ${m.iconClass}`}>
                    {m.icon}
                  </div>
                  <div>
                    <p className={styles.methodLabel}>{m.label}</p>
                    <p className={styles.methodValue}>{m.value}</p>
                  </div>
                </a>
              </ScrollReveal>
            ))}

            {/* Quick CTA */}
            <ScrollReveal delay={400} direction="left">
              <div className={styles.proTip}>
                <p className={styles.proTipText}>
                  <span className={styles.proTipHighlight}>Pro tip:</span> Follow{" "}
                  <a
                    href="https://www.instagram.com/_omkar.creations_/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.proTipLink}
                  >
                    @_omkar.creations_
                  </a>{" "}
                  on Instagram for the latest drops and behind-the-scenes content.
                </p>
              </div>
            </ScrollReveal>
          </div>

          {/* Form */}
          <ScrollReveal delay={200} direction="right">
            {sent ? (
              <div className={styles.successWrap}>
                <div className={styles.successIcon}>
                  <svg className={styles.successIconSvg} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h3 className={styles.successTitle}>Message Sent!</h3>
                <p className={styles.successSubtitle}>
                  Thanks for reaching out. I&apos;ll get back to you soon.
                </p>
                <button
                  onClick={() => { setSent(false); setForm({ name: "", email: "", message: "" }); }}
                  className={styles.successReset}
                >
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className={styles.form}>
                <div>
                  <label className={styles.fieldLabel}>Name</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className={styles.fieldInput}
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className={styles.fieldLabel}>Email</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className={styles.fieldInput}
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className={styles.fieldLabel}>Message</label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className={styles.fieldTextarea}
                    placeholder="Tell me about your project..."
                  />
                </div>
                <button
                  type="submit"
                  disabled={sending}
                  className={styles.submitBtn}
                >
                  <span className={styles.submitBtnBg} />
                  <span className={styles.submitBtnGlow} />
                  <span className={styles.submitBtnLabel}>
                    {sending ? "Sending..." : "Send Message"}
                  </span>
                </button>
              </form>
            )}
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
