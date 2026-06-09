"use client";

import Link from "next/link";
import { useState, useRef } from "react";
import { Card } from "@/components/ui/Card";

export default function ReelCard({ reel }) {
  const cardRef = useRef(null);
  const [transform, setTransform] = useState("");

  const handleMove = (e) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTransform(`perspective(800px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) scale3d(1.02,1.02,1.02)`);
  };

  const handleLeave = () => setTransform("");

  return (
    <Link href={`/reel/${reel.id}`} className="block group">
      <Card
        variant="glass"
        ref={cardRef}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        className="relative aspect-[9/16] w-full rounded-2xl overflow-hidden border border-border/30 transition-transform duration-300 ease-out"
        style={{ transform }}
      >
        {reel.thumbnailUrl ? (
          <img
            src={reel.thumbnailUrl}
            alt={reel.title || "Reel"}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-surface to-bg flex items-center justify-center">
            <span className="text-5xl opacity-20">🎬</span>
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Hover overlay icons */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
          <div className="flex gap-4 items-center scale-75 group-hover:scale-100 transition-transform duration-500">
            {/* Play/Views */}
            <div className="flex flex-col items-center gap-1">
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
              <span className="text-white text-xs font-bold font-heading">{reel.views}</span>
            </div>
            {/* Likes */}
            <div className="flex flex-col items-center gap-1">
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
              <span className="text-white text-xs font-bold font-heading">{reel.likes}</span>
            </div>
            {/* Comments */}
            <div className="flex flex-col items-center gap-1">
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>
              <span className="text-white text-xs font-bold font-heading">{reel.comments}</span>
            </div>
            {/* Shares */}
            <div className="flex flex-col items-center gap-1">
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M21 3L3 10.53v.98l6.84 2.65L12.48 21h.98L21 3z"/></svg>
              <span className="text-white text-xs font-bold font-heading">{reel.shares}</span>
            </div>
          </div>
        </div>

        {/* Info bar */}
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
          <p className="text-white text-sm font-heading tracking-wide truncate mb-1">
            {reel.title || "Untitled"}
          </p>
          <div className="flex items-center gap-3">
            {reel.category && (
              <span className="text-accent text-[10px] tracking-[0.2em] uppercase font-heading">
                {reel.category}
              </span>
            )}
            {reel.downloads > 0 && (
              <span className="text-text-muted text-[10px] tracking-wider font-heading">
                {reel.downloads} DLs
              </span>
            )}
          </div>
        </div>

        {/* Category badge */}
        {reel.category && (
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-sm border border-white/10">
            <span className="text-[10px] tracking-[0.15em] uppercase font-heading text-white/80">
              {reel.category}
            </span>
          </div>
        )}
      </Card>
    </Link>
  );
}
