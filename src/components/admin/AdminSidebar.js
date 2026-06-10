"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { 
  LayoutDashboard, 
  Film, 
  BarChart3, 
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Sparkles
} from "lucide-react";

const NAV_ITEMS = [
  { id: "overview", label: "Dashboard", icon: LayoutDashboard },
  { id: "reels", label: "Reels", icon: Film },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "settings", label: "Settings", icon: Settings },
];

export default function AdminSidebar({ activeTab, setActiveTab }) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <motion.aside
      initial={{ width: 260 }}
      animate={{ width: isExpanded ? 260 : 80 }}
      transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
      className="admin-sidebar"
    >
      {/* Brand header */}
      <div className="admin-sidebar__header">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="admin-sidebar__logo">
            <Sparkles size={16} className="text-white" />
          </div>
          <AnimatePresence>
            {isExpanded && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="font-display text-sm tracking-[0.2em] text-white/90 group-hover:text-white transition-colors"
              >
                OMKAR
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="admin-sidebar__toggle"
          title={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
        >
          {isExpanded ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="admin-sidebar__nav">
        {isExpanded && (
          <p className="text-[10px] uppercase tracking-[0.15em] text-white/30 font-medium px-4 mb-3">
            Navigation
          </p>
        )}
        <div className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`admin-sidebar__item ${isActive ? "admin-sidebar__item--active" : ""}`}
                title={!isExpanded ? item.label : undefined}
              >
                {/* Active indicator bar */}
                {isActive && (
                  <motion.div
                    layoutId="sidebarActiveIndicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-r-full bg-amber-500"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <Icon size={18} className={isActive ? "text-amber-500" : "text-white/50 group-hover:text-amber-400 transition-colors"} />
                <AnimatePresence>
                  {isExpanded && (
                    <motion.span
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -5 }}
                      className="font-heading text-sm font-medium"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Bottom area */}
      <div className="admin-sidebar__footer">
        <div className={`admin-sidebar__footer-content ${isExpanded ? '' : 'items-center justify-center'}`}>
          {isExpanded ? (
            <div className="flex items-center gap-2 text-xs text-white/30">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>System Online</span>
            </div>
          ) : (
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          )}
        </div>
      </div>
    </motion.aside>
  );
}
