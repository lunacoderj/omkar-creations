"use client";

import { motion } from "framer-motion";
import CountUp from "react-countup";
import { useEffect, useRef, useState } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip } from "recharts";

export default function StatCard({ label, value, trend, color, data, delay = 0 }) {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef(null);

  // Generate random data if not provided
  const chartData = data || Array.from({ length: 7 }, (_, i) => ({
    name: `Day ${i + 1}`,
    value: Math.floor(Math.random() * (value * 0.1)) + value * 0.9,
  }));

  const isPositive = trend >= 0;

  // Delay render of chart to ensure DOM is ready with proper dimensions
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300 + delay * 1000);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="stat-card group"
      style={{ '--stat-accent': color }}
    >
      {/* Top accent line */}
      <div 
        className="absolute top-0 left-0 right-0 h-[2px] opacity-60 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }}
      />

      <div className="flex justify-between items-start mb-4 relative z-10">
        <div>
          <p className="text-white/50 text-xs font-medium uppercase tracking-wider mb-2">{label}</p>
          <div className="text-3xl font-heading font-bold text-white flex items-baseline gap-2">
            <CountUp 
              end={value} 
              duration={2.5} 
              separator="," 
              useEasing={true}
            />
          </div>
        </div>
        {trend !== undefined && (
          <div className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
            isPositive 
              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
              : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
          }`}>
            <span className="text-[10px]">{isPositive ? "▲" : "▼"}</span>
            {isPositive ? "+" : ""}{trend}%
          </div>
        )}
      </div>

      {/* Chart area with proper sizing */}
      <div className="stat-card__chart">
        {isVisible && (
          <ResponsiveContainer width="100%" height={64}>
            <AreaChart data={chartData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id={`gradient-${label?.replace(/\s+/g, '-')}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-black/90 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-lg text-xs font-medium text-white shadow-xl">
                        {payload[0].value.toLocaleString()}
                      </div>
                    );
                  }
                  return null;
                }}
                cursor={{ stroke: "rgba(255,255,255,0.1)", strokeWidth: 1, strokeDasharray: "3 3" }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke={color}
                strokeWidth={2}
                fillOpacity={1}
                fill={`url(#gradient-${label?.replace(/\s+/g, '-')})`}
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Decorative gradient orb */}
      <div 
        className="absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-15 blur-3xl pointer-events-none group-hover:opacity-30 transition-opacity duration-700"
        style={{ backgroundColor: color }}
      />
    </motion.div>
  );
}
