"use client";

import { useEffect, useRef, useState } from "react";

const stats = [
  { label: "Edits", value: 138, suffix: "+", color: "text-accent" },
  { label: "Quality", value: 4, suffix: "K", color: "text-accent-3" },
  { label: "Followers", value: 748, suffix: "+", color: "text-accent-2" },
  { label: "Mobile", value: 100, suffix: "%", color: "text-accent-4" },
];

export default function StatsBar() {
  const [vis, setVis] = useState(false);
  const [counts, setCounts] = useState(stats.map(() => 0));
  const ref = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !vis) {
          setVis(true);
          stats.forEach((stat, i) => {
            let cur = 0;
            const step = stat.value / 120;
            const timer = setInterval(() => {
              cur += step;
              if (cur >= stat.value) { cur = stat.value; clearInterval(timer); }
              setCounts((p) => { const n = [...p]; n[i] = Math.floor(cur); return n; });
            }, 16);
          });
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [vis]);

  return (
    <section ref={ref} className="py-14 px-5">
      <div className="max-w-3xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <div key={s.label} className={`text-center transition-all duration-700 ${vis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
              style={{ transitionDelay: `${i * 120}ms` }}>
              <div className={`font-display text-3xl sm:text-4xl ${s.color} tabular-nums`}>
                {counts[i]}<span className="text-lg">{s.suffix}</span>
              </div>
              <p className="text-text-muted text-xs tracking-wider uppercase mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
