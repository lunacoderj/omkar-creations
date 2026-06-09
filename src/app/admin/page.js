"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./AdminDashboard.module.css";



export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    } else if (status === "authenticated") {
      fetch("/api/admin")
        .then((res) => res.json())
        .then((data) => setDashboardData(data))
        .catch((err) => console.error("Failed to load admin data", err));
    }
  }, [status, router]);

  if (status === "loading" || (status === "authenticated" && !dashboardData)) {
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
                { label: "Total Reels", value: dashboardData.stats.totalReels, colorClass: styles.colorAccent },
                { label: "Total Views", value: dashboardData.stats.totalViews.toLocaleString(), colorClass: styles.colorCyan },
                { label: "Downloads", value: dashboardData.stats.totalDownloads.toLocaleString(), colorClass: styles.colorMagenta },
                { label: "Followers", value: dashboardData.stats.totalFollowers, colorClass: styles.colorRose },
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
                {dashboardData.interactions.map((item, i) => (
                  <div key={i} className={styles.activityRow}>
                    <div className={styles.activityLeft}>
                      <span className={styles.activityIcon}>
                        {item.action_type === "download" ? "⬇️" : "👁"}
                      </span>
                      <div>
                        <p className={styles.activityTitle}>{item.post_title}</p>
                        <p className={styles.activityType}>
                          {item.action_type === "download" ? "Downloaded" : "Visited"}
                        </p>
                      </div>
                    </div>
                    <span className={styles.activityTime}>
                      {new Date(item.timestamp).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })}
                    </span>
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
                  {dashboardData.reels.map((reel, i) => (
                    <tr key={reel.id || i} className={styles.tableRow}>
                      <td className={`${styles.tableCell} ${styles.tableCellText}`}>{reel.title}</td>
                      <td className={`${styles.tableCell} ${styles.tableCellMuted} ${styles.hideMobile}`}>{reel.category}</td>
                      <td className={`${styles.tableCell} ${styles.tableCellMuted}`}>{reel.view_count || reel.views || 0}</td>
                      <td className={`${styles.tableCell} ${styles.tableCellAccent}`}>{reel.download_count || reel.downloads || 0}</td>
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
                  {[...dashboardData.reels]
                    .sort((a, b) => (b.view_count || b.views || 0) - (a.view_count || a.views || 0))
                    .slice(0, 3)
                    .map((r, _, arr) => {
                      const maxViews = arr[0].view_count || arr[0].views || 1;
                      const views = r.view_count || r.views || 0;
                      return (
                    <div key={r.id || r.title}>
                      <div className={styles.barLabel}>
                        <span className={styles.barLabelTitle}>{r.title}</span>
                        <span className={styles.colorCyan}>{views.toLocaleString()}</span>
                      </div>
                      <div className={styles.barTrack}>
                        <div
                          className={`${styles.barFill} ${styles.barFillViews}`}
                          style={{ width: `${(views / maxViews) * 100}%` }}
                        />
                      </div>
                    </div>
                  )})}
                </div>
              </div>
              <div className={styles.sectionCard}>
                <h3 className={styles.sectionTitle}>Most Downloaded</h3>
                <div className={styles.sectionContent}>
                  {[...dashboardData.reels]
                    .sort((a, b) => (b.download_count || b.downloads || 0) - (a.download_count || a.downloads || 0))
                    .slice(0, 3)
                    .map((r, _, arr) => {
                      const maxDl = arr[0].download_count || arr[0].downloads || 1;
                      const dl = r.download_count || r.downloads || 0;
                      return (
                    <div key={r.id || r.title}>
                      <div className={styles.barLabel}>
                        <span className={styles.barLabelTitle}>{r.title}</span>
                        <span className={styles.colorMagenta}>{dl}</span>
                      </div>
                      <div className={styles.barTrack}>
                        <div
                          className={`${styles.barFill} ${styles.barFillDownloads}`}
                          style={{ width: `${(dl / maxDl) * 100}%` }}
                        />
                      </div>
                    </div>
                  )})}
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
