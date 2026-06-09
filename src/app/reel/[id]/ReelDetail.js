"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import ScrollReveal from "@/components/public/ScrollReveal";
import styles from "./ReelDetail.module.css";

export default function ReelDetail() {
  const { id } = useParams();
  const [reel, setReel] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReel = async () => {
      try {
        const res = await fetch(`/api/reels/${id}`);
        if (res.ok) {
          const data = await res.json();
          setReel(data);
        }
      } catch (err) {
        console.error("Error fetching reel:", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchReel();
  }, [id]);

  const handleDownload = async () => {
    if (!reel?.projectFileUrl) return;
    try {
      await fetch(`/api/reels/${id}/download`, { method: "POST" });
      window.open(reel.projectFileUrl, "_blank");
    } catch (err) {
      window.open(reel.projectFileUrl, "_blank");
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingWrap}>
        <div className={styles.spinner} />
      </div>
    );
  }

  if (!reel) {
    return (
      <div className={styles.notFoundWrap}>
        <span className={styles.notFoundEmoji}>🎬</span>
        <h1 className={styles.notFoundTitle}>Reel not found</h1>
        <Link href="/reels" className={styles.notFoundLink}>
          ← Back to Reels
        </Link>
      </div>
    );
  }

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {/* Back link */}
        <ScrollReveal>
          <Link href="/reels" className={styles.backLink}>
            <svg className={styles.backIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to Reels
          </Link>
        </ScrollReveal>

        <div className={styles.grid}>
          {/* Video / Thumbnail */}
          <ScrollReveal direction="left">
            <div className={styles.mediaWrap}>
              {reel.videoUrl ? (
                <video
                  src={reel.videoUrl}
                  poster={reel.thumbnailUrl}
                  controls
                  className={styles.media}
                  playsInline
                />
              ) : reel.thumbnailUrl ? (
                <img src={reel.thumbnailUrl} alt={reel.title} className={styles.media} />
              ) : (
                <div className={styles.mediaPlaceholder}>
                  <span className={styles.mediaEmoji}>🎬</span>
                </div>
              )}
            </div>
          </ScrollReveal>

          {/* Info */}
          <div className={styles.infoCol}>
            <ScrollReveal delay={100}>
              {reel.category && (
                <span className={styles.category}>{reel.category}</span>
              )}
              <h1 className={styles.reelTitle}>
                {reel.title || "Untitled Reel"}
              </h1>
            </ScrollReveal>

            {reel.description && (
              <ScrollReveal delay={200}>
                <p className={styles.description}>{reel.description}</p>
              </ScrollReveal>
            )}

            {/* Meta */}
            <ScrollReveal delay={300}>
              <div className={styles.metaRow}>
                {reel.views != null && (
                  <div>
                    <p className={styles.metaLabel}>Views</p>
                    <p className={styles.metaValue}>{reel.views}</p>
                  </div>
                )}
                {reel.likes != null && (
                  <div>
                    <p className={styles.metaLabel}>Likes</p>
                    <p className={styles.metaValue}>{reel.likes}</p>
                  </div>
                )}
                {reel.comments != null && (
                  <div>
                    <p className={styles.metaLabel}>Comments</p>
                    <p className={styles.metaValue}>{reel.comments}</p>
                  </div>
                )}
                {reel.shares != null && (
                  <div>
                    <p className={styles.metaLabel}>Shares</p>
                    <p className={styles.metaValue}>{reel.shares}</p>
                  </div>
                )}
                {reel.downloads != null && (
                  <div>
                    <p className={styles.metaLabel}>Downloads</p>
                    <p className={styles.metaValueAccent}>{reel.downloads}</p>
                  </div>
                )}
              </div>
            </ScrollReveal>

            {/* Actions */}
            <ScrollReveal delay={400}>
              <div className={styles.actions}>
                {reel.projectFileUrl && (
                  <button onClick={handleDownload} className={styles.primaryBtn}>
                    <span className={styles.primaryBtnBg} />
                    <span className={styles.primaryBtnGlow} />
                    <span className={styles.primaryBtnLabel}>
                      <svg className={styles.primaryBtnIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                      </svg>
                      Download Project File
                    </span>
                  </button>
                )}
                {reel.instagramUrl && (
                  <a
                    href={reel.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.secondaryBtn}
                  >
                    View on Instagram
                  </a>
                )}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
