"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./AdminDashboard.module.css";

// Mock stats for dashboard
const mockStats = {
  totalReels: 12,
  totalViews: 24320,
  totalDownloads: 1544,
  followers: 748,
};

const recentActivity = [
  { type: "download", title: "QALB — Mass Edit", time: "2 hours ago" },
  { type: "visit", title: "GOD MODE — NTR", time: "3 hours ago" },
  { type: "download", title: "Ni Dhyaanam — Song Promo", time: "5 hours ago" },
  { type: "visit", title: "DC Motion Poster", time: "6 hours ago" },
  { type: "download", title: "MIRAI — Anime Edit", time: "8 hours ago" },
];

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (status === "unauthenticated") router.push("/admin/login");
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className={styles.loadingWrapper}>
        <div className={styles.spinner} />
      </div>
    );
  }

  if (!session) return null;

  const navItems = [
    { id: "overview", label: "Overview", icon: "📊" },
    { id: "reels", label: "Manage Reels", icon: "🎬" },
    { id: "analytics", label: "Analytics", icon: "📈" },
    { id: "settings", label: "Settings", icon: "⚙️" },
  ];

  return (
    <div className={styles.dashboard}>
      {/* Top bar */}
      <header className={styles.topBar}>
        <div className={styles.topBarInner}>
          <div className={styles.topBarLeft}>
            <Link href="/" className={styles.topBarLogo}>
              <div className={styles.topBarLogoIcon}>
                <span>O</span>
              </div>
              <span className={styles.topBarTitle}>ADMIN</span>
            </Link>
          </div>
          <div className={styles.topBarRight}>
            {session.provider === "instagram" && (
              <span className={styles.igBadge}>📸 Instagram Connected</span>
            )}
            <div className={styles.userInfo}>
              <div className={styles.userAvatar}>
                <span>{session.user?.name?.[0] || "A"}</span>
              </div>
              <span className={`${styles.userEmail} ${styles.hideMobile}`}>
                {session.user?.email}
              </span>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/admin/login" })}
              className={styles.logoutButton}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className={styles.content}>
        {/* Tab nav */}
        <div className={styles.tabNav}>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`${styles.tabButton} ${activeTab === item.id ? styles.tabButtonActive : ""}`}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className={`${styles.spaceY6} ${styles.fadeIn}`}>
            {/* Stats grid */}
            <div className={styles.statsGrid}>
              {[
                { label: "Total Reels", value: mockStats.totalReels, colorClass: styles.colorAccent },
                { label: "Total Views", value: mockStats.totalViews.toLocaleString(), colorClass: styles.colorCyan },
                { label: "Downloads", value: mockStats.totalDownloads.toLocaleString(), colorClass: styles.colorMagenta },
                { label: "Followers", value: mockStats.followers, colorClass: styles.colorRose },
              ].map((stat) => (
                <div key={stat.label} className={styles.statCard}>
                  <p className={styles.statLabel}>{stat.label}</p>
                  <p className={`${styles.statValue} ${stat.colorClass}`}>{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Recent activity */}
            <div className={styles.sectionCard}>
              <h3 className={styles.sectionTitle}>Recent Activity</h3>
              <div className={styles.sectionContent}>
                {recentActivity.map((item, i) => (
                  <div key={i} className={styles.activityRow}>
                    <div className={styles.activityLeft}>
                      <span className={styles.activityIcon}>
                        {item.type === "download" ? "⬇️" : "👁"}
                      </span>
                      <div>
                        <p className={styles.activityTitle}>{item.title}</p>
                        <p className={styles.activityType}>
                          {item.type === "download" ? "Downloaded" : "Visited"}
                        </p>
                      </div>
                    </div>
                    <span className={styles.activityTime}>{item.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Manage Reels Tab */}
        {activeTab === "reels" && (
          <div className={styles.fadeIn}>
            <div className={styles.reelsHeader}>
              <h2 className={styles.reelsTitle}>All Reels</h2>
              <button className={styles.addReelButton}>+ Add Reel</button>
            </div>
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead className={styles.tableHead}>
                  <tr>
                    <th className={styles.tableHeadCell}>Title</th>
                    <th className={`${styles.tableHeadCell} ${styles.hideMobile}`}>Category</th>
                    <th className={styles.tableHeadCell}>Views</th>
                    <th className={styles.tableHeadCell}>Downloads</th>
                    <th className={styles.tableHeadCell} style={{ textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { title: "QALB — Mass Edit", cat: "Mass Edit", views: "1.8K", dl: 245 },
                    { title: "DC Motion Poster", cat: "Mass Edit", views: "2.1K", dl: 189 },
                    { title: "GOD MODE — NTR", cat: "Mass Edit", views: "3.4K", dl: 312 },
                    { title: "MIRAI — Anime Edit", cat: "Anime", views: "2.4K", dl: 198 },
                    { title: "HANUMAN — Cinematic", cat: "Devotional", views: "2.8K", dl: 0 },
                  ].map((reel, i) => (
                    <tr key={i} className={styles.tableRow}>
                      <td className={`${styles.tableCell} ${styles.tableCellText}`}>{reel.title}</td>
                      <td className={`${styles.tableCell} ${styles.tableCellMuted} ${styles.hideMobile}`}>{reel.cat}</td>
                      <td className={`${styles.tableCell} ${styles.tableCellMuted}`}>{reel.views}</td>
                      <td className={`${styles.tableCell} ${styles.tableCellAccent}`}>{reel.dl}</td>
                      <td className={styles.tableCellActions}>
                        <button className={styles.actionEdit}>Edit</button>
                        <button className={styles.actionDelete}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === "analytics" && (
          <div className={`${styles.fadeIn} ${styles.spaceY6}`}>
            <div className={styles.analyticsGrid}>
              <div className={styles.sectionCard}>
                <h3 className={styles.sectionTitle}>Top Performing Reels</h3>
                <div className={styles.sectionContent}>
                  {[
                    { title: "GOD MODE — NTR", views: 3400, pct: 100 },
                    { title: "Vaana Chinukulu", views: 3100, pct: 91 },
                    { title: "HANUMAN — Cinematic", views: 2800, pct: 82 },
                  ].map((r) => (
                    <div key={r.title}>
                      <div className={styles.barLabel}>
                        <span className={styles.barLabelTitle}>{r.title}</span>
                        <span className={styles.colorCyan}>{r.views.toLocaleString()}</span>
                      </div>
                      <div className={styles.barTrack}>
                        <div
                          className={`${styles.barFill} ${styles.barFillViews}`}
                          style={{ width: `${r.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className={styles.sectionCard}>
                <h3 className={styles.sectionTitle}>Most Downloaded</h3>
                <div className={styles.sectionContent}>
                  {[
                    { title: "GOD MODE — NTR", dl: 312, pct: 100 },
                    { title: "QALB — Mass Edit", dl: 245, pct: 78 },
                    { title: "Vaana Chinukulu", dl: 223, pct: 71 },
                  ].map((r) => (
                    <div key={r.title}>
                      <div className={styles.barLabel}>
                        <span className={styles.barLabelTitle}>{r.title}</span>
                        <span className={styles.colorMagenta}>{r.dl}</span>
                      </div>
                      <div className={styles.barTrack}>
                        <div
                          className={`${styles.barFill} ${styles.barFillDownloads}`}
                          style={{ width: `${r.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div className={`${styles.fadeIn} ${styles.settingsContainer}`}>
            <div className={styles.sectionCard}>
              <h3 className={styles.sectionTitle}>Account</h3>
              <div className={styles.settingsContent}>
                <div className={styles.settingField}>
                  <label>Email</label>
                  <p>{session.user?.email}</p>
                </div>
                <div className={styles.settingField}>
                  <label>Login Method</label>
                  <p>{session.provider === "instagram" ? "Instagram" : "Email/Password"}</p>
                </div>
                {session.provider === "instagram" && (
                  <div className={styles.settingsDivider}>
                    <label>Instagram Connection</label>
                    <p>✓ Connected — Instagram data syncing enabled</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
