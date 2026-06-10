"use client";

import { motion } from "framer-motion";
import { Download, Eye, UploadCloud, TrendingUp, Star } from "lucide-react";

export default function ActivityFeed({ interactions = [] }) {
  // Mock data if empty
  const activities = interactions.length > 0 ? interactions : [
    {
      id: "1",
      action_type: "upload",
      post_title: "Cyberpunk City Visuals",
      timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      details: "New reel uploaded",
    },
    {
      id: "2",
      action_type: "milestone",
      post_title: "Qalb Movie",
      timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      details: "Crossed 1M views",
    },
    {
      id: "3",
      action_type: "download",
      post_title: "Action Pack VFX",
      timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
      details: "User downloaded project file",
    },
    {
      id: "4",
      action_type: "view",
      post_title: "Neon Nights",
      timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
      details: "Spike in views detected",
    }
  ];

  const getIcon = (type) => {
    switch (type) {
      case "download": return <Download className="w-4 h-4 text-fuchsia-400" />;
      case "view": return <Eye className="w-4 h-4 text-cyan-400" />;
      case "upload": return <UploadCloud className="w-4 h-4 text-emerald-400" />;
      case "milestone": return <Star className="w-4 h-4 text-amber-400" />;
      default: return <TrendingUp className="w-4 h-4 text-blue-400" />;
    }
  };

  const getBgColor = (type) => {
    switch (type) {
      case "download": return "bg-fuchsia-500/10 border-fuchsia-500/20";
      case "view": return "bg-cyan-500/10 border-cyan-500/20";
      case "upload": return "bg-emerald-500/10 border-emerald-500/20";
      case "milestone": return "bg-amber-500/10 border-amber-500/20";
      default: return "bg-blue-500/10 border-blue-500/20";
    }
  };

  const getTimeAgo = (timestamp) => {
    const diff = Date.now() - new Date(timestamp).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  return (
    <div className="admin-card h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-base font-bold text-white font-heading">Live Activity</h3>
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
      </div>
      
      <div className="space-y-1">
        {activities.map((activity, i) => (
          <motion.div
            key={activity.id || i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1, duration: 0.3 }}
            className="activity-feed__item group"
          >
            <div className={`activity-feed__icon ${getBgColor(activity.action_type || "view")}`}>
              {getIcon(activity.action_type || "view")}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start gap-2">
                <p className="text-sm font-medium text-white/90 truncate">
                  {activity.post_title}
                </p>
                <span className="text-[10px] text-white/30 whitespace-nowrap font-medium">
                  {getTimeAgo(activity.timestamp)}
                </span>
              </div>
              <p className="text-xs text-white/40 mt-0.5">
                {activity.details || (activity.action_type === "download" ? "Downloaded project file" : "Viewed reel")}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
