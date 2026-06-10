"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import ParticlesBackground from "@/components/admin/ParticlesBackground";
import StatCard from "@/components/admin/StatCard";
import ActivityFeed from "@/components/admin/ActivityFeed";
import FileUpload from "@/components/admin/FileUpload";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [dashboardData, setDashboardData] = useState(null);
  const [editingReel, setEditingReel] = useState(null);
  const [isAddingReel, setIsAddingReel] = useState(false);
  const [newReel, setNewReel] = useState({});
  const [isSaving, setIsSaving] = useState(false);

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

  const handleEdit = (reel) => {
    setEditingReel({ ...reel });
  };

  const handleSaveReel = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(`/api/reels/${editingReel.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editingReel.title,
          category: editingReel.category,
          project_file_url: editingReel.project_file_url,
          project_file_type: editingReel.project_file_type,
          project_file_name: editingReel.project_file_name,
          is_visible: editingReel.is_visible,
        }),
      });
      if (res.ok) {
        setDashboardData(prev => ({
          ...prev,
          reels: prev.reels.map(r => r.id === editingReel.id ? { ...r, ...editingReel } : r)
        }));
        setEditingReel(null);
      }
    } catch (err) {
      console.error(err);
    }
    setIsSaving(false);
  };

  const handleAddReel = () => {
    setNewReel({
      title: "",
      category: "",
      project_file_url: "",
      is_visible: true,
      is_featured: false,
    });
    setIsAddingReel(true);
  };

  const handleSaveNewReel = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(`/api/reels`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newReel),
      });
      if (res.ok) {
        const data = await res.json();
        setDashboardData(prev => ({
          ...prev,
          reels: [{ id: data.id, ...newReel }, ...prev.reels],
          stats: { ...prev.stats, totalReels: prev.stats.totalReels + 1 }
        }));
        setIsAddingReel(false);
      }
    } catch (err) {
      console.error(err);
    }
    setIsSaving(false);
  };

  const handleDeleteReel = async (id) => {
    if (!confirm("Are you sure you want to delete this reel?")) return;
    try {
      const res = await fetch(`/api/reels/${id}`, { method: "DELETE" });
      if (res.ok) {
        setDashboardData(prev => ({
          ...prev,
          reels: prev.reels.filter(r => r.id !== id)
        }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (status === "loading" || (status === "authenticated" && !dashboardData)) {
    return (
      <div className="admin-loader">
        <div className="admin-loader__spinner" />
        <p className="text-white/40 text-sm mt-4 font-heading">Loading dashboard…</p>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="admin-layout">
      <ParticlesBackground />
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="admin-main">
        {/* Top bar */}
        <header className="admin-topbar">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-heading font-bold text-white capitalize tracking-wide">
              {activeTab.replace("-", " ")}
            </h1>
            <div className="hidden sm:block h-5 w-px bg-white/10" />
            <span className="hidden sm:block text-xs text-white/30 font-medium">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </span>
          </div>
          <div className="flex items-center gap-4">
            {session.provider === "instagram" && (
              <span className="admin-badge admin-badge--instagram">
                📸 Instagram Connected
              </span>
            )}
            <div className="admin-avatar-group">
              <div className="admin-avatar">
                <span className="text-amber-500 font-bold text-xs">{session.user?.name?.[0] || "A"}</span>
              </div>
              <span className="text-xs text-white/50 hidden sm:block font-medium">
                {session.user?.email}
              </span>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/admin/login" })}
              className="admin-btn-ghost text-xs"
            >
              Logout
            </button>
          </div>
        </header>

        <div className="admin-content">

        {/* ═══════════════════════════════════ */}
        {/* Overview Tab                        */}
        {/* ═══════════════════════════════════ */}
        {activeTab === "overview" && (
          <div className="admin-tab-content">
            {/* Welcome banner */}
            <div className="admin-welcome">
              <div>
                <h2 className="text-2xl font-heading font-bold text-white mb-1">
                  Welcome back, {session.user?.name?.split(' ')[0] || 'Admin'} 👋
                </h2>
                <p className="text-sm text-white/40">Here&apos;s what&apos;s happening with your portfolio today.</p>
              </div>
            </div>

            {/* Stats grid */}
            <div className="admin-stats-grid">
              <StatCard
                label="Total Reels"
                value={dashboardData.stats.totalReels}
                trend={12}
                color="#f59e0b"
                delay={0.1}
              />
              <StatCard
                label="Total Views"
                value={dashboardData.stats.totalViews}
                trend={24.5}
                color="#06b6d4"
                delay={0.2}
              />
              <StatCard
                label="Downloads"
                value={dashboardData.stats.totalDownloads}
                trend={-5.2}
                color="#d946ef"
                delay={0.3}
              />
              <StatCard
                label="Followers"
                value={dashboardData.stats.totalFollowers || 10420}
                trend={8.4}
                color="#f43f5e"
                delay={0.4}
              />
            </div>

            {/* Activity + Placeholder */}
            <div className="admin-grid-2-1">
              <div className="admin-card admin-card--empty">
                <div className="flex flex-col items-center justify-center h-full min-h-[250px] gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <span className="text-xl">📊</span>
                  </div>
                  <p className="text-white/30 text-sm font-medium">Analytics charts coming soon</p>
                  <p className="text-white/20 text-xs">Performance trends & engagement metrics</p>
                </div>
              </div>
              <ActivityFeed interactions={dashboardData.interactions} />
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════ */}
        {/* Manage Reels Tab                    */}
        {/* ═══════════════════════════════════ */}
        {activeTab === "reels" && (
          <div className="admin-tab-content">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-heading font-bold text-white">All Reels</h2>
                <p className="text-sm text-white/40 mt-1">{dashboardData.reels.length} reels in your portfolio</p>
              </div>
              <button className="admin-btn-primary" onClick={handleAddReel}>
                <span className="text-lg leading-none">+</span>
                Add Reel
              </button>
            </div>

            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th className="hidden md:table-cell">Category</th>
                    <th>Views</th>
                    <th>Downloads</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData.reels.map((reel, i) => (
                    <tr key={reel.id || i}>
                      <td className="text-white font-medium">{reel.title}</td>
                      <td className="hidden md:table-cell">
                        {reel.categories?.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {reel.categories.map((cat, idx) => (
                              <span key={idx} className="admin-category-tag">{cat}</span>
                            ))}
                          </div>
                        ) : (
                          <span className="admin-category-tag">{reel.category || "None"}</span>
                        )}
                      </td>
                      <td className="text-cyan-400 tabular-nums">{(reel.view_count || reel.views || 0).toLocaleString()}</td>
                      <td className="text-fuchsia-400 tabular-nums">{reel.download_count || reel.downloads || 0}</td>
                      <td className="text-right">
                        <div className="flex justify-end gap-2">
                          <button className="admin-action-btn admin-action-btn--edit" onClick={() => handleEdit(reel)}>Edit</button>
                          <button className="admin-action-btn admin-action-btn--delete" onClick={() => handleDeleteReel(reel.id)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Edit Modal */}
            {editingReel && (
              <div className="admin-modal-overlay" onClick={(e) => e.target === e.currentTarget && setEditingReel(null)}>
                <div className="admin-modal admin-modal--wide">
                  <div className="admin-modal__header">
                    <h3 className="text-lg font-heading font-bold text-white">Edit Reel</h3>
                    <button className="admin-modal__close" onClick={() => setEditingReel(null)}>✕</button>
                  </div>
                  <div className="admin-modal__body">
                    <div className="admin-field">
                      <label className="admin-label">Title</label>
                      <input 
                        type="text" 
                        value={editingReel.title || ""} 
                        onChange={(e) => setEditingReel({...editingReel, title: e.target.value})} 
                        className="admin-input"
                      />
                    </div>
                    <div className="admin-field">
                      <label className="admin-label">Categories (comma separated)</label>
                      <input 
                        type="text" 
                        value={editingReel.categories ? editingReel.categories.join(", ") : editingReel.category || ""} 
                        onChange={(e) => setEditingReel({
                          ...editingReel, 
                          categories: e.target.value.split(',').map(s => s.trim()).filter(Boolean),
                          category: e.target.value.split(',')[0]?.trim() || ""
                        })} 
                        className="admin-input"
                      />
                    </div>

                    {/* File Upload Section */}
                    <FileUpload
                      value={editingReel.project_file_url}
                      fileName={editingReel.project_file_name}
                      reelId={editingReel.id}
                      onUploadComplete={({ url, fileName, fileType }) => {
                        setEditingReel(prev => ({
                          ...prev,
                          project_file_url: url,
                          project_file_type: fileType,
                          project_file_name: fileName,
                        }));
                      }}
                      onClear={() => {
                        setEditingReel(prev => ({
                          ...prev,
                          project_file_url: "",
                          project_file_type: "",
                          project_file_name: "",
                        }));
                      }}
                    />

                    {/* Manual URL fallback */}
                    <div className="admin-field">
                      <label className="admin-label">Or paste URL manually</label>
                      <input 
                        type="text" 
                        placeholder="https://link-to-project-file"
                        value={editingReel.project_file_url || ""} 
                        onChange={(e) => setEditingReel({...editingReel, project_file_url: e.target.value})} 
                        className="admin-input"
                      />
                    </div>

                    <label className="admin-checkbox">
                      <input 
                        type="checkbox" 
                        checked={editingReel.is_visible !== false} 
                        onChange={(e) => setEditingReel({...editingReel, is_visible: e.target.checked})} 
                      />
                      <span>Visible to Public</span>
                    </label>
                  </div>
                  <div className="admin-modal__footer">
                    <button className="admin-btn-ghost" onClick={() => setEditingReel(null)}>Cancel</button>
                    <button className="admin-btn-primary" onClick={handleSaveReel} disabled={isSaving}>
                      {isSaving ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Add Modal */}
            {isAddingReel && (
              <div className="admin-modal-overlay" onClick={(e) => e.target === e.currentTarget && setIsAddingReel(false)}>
                <div className="admin-modal admin-modal--wide">
                  <div className="admin-modal__header">
                    <h3 className="text-lg font-heading font-bold text-white">Add New Reel</h3>
                    <button className="admin-modal__close" onClick={() => setIsAddingReel(false)}>✕</button>
                  </div>
                  <div className="admin-modal__body">
                    <div className="admin-field">
                      <label className="admin-label">Title</label>
                      <input 
                        type="text" 
                        value={newReel.title || ""} 
                        onChange={(e) => setNewReel({...newReel, title: e.target.value})} 
                        className="admin-input"
                        placeholder="Enter reel title"
                      />
                    </div>
                    <div className="admin-field">
                      <label className="admin-label">Categories (comma separated)</label>
                      <input 
                        type="text" 
                        value={newReel.categories ? newReel.categories.join(", ") : newReel.category || ""} 
                        onChange={(e) => setNewReel({
                          ...newReel, 
                          categories: e.target.value.split(',').map(s => s.trim()).filter(Boolean),
                          category: e.target.value.split(',')[0]?.trim() || ""
                        })} 
                        className="admin-input"
                        placeholder="e.g. mass_edit, anime, cinema"
                      />
                    </div>

                    {/* File Upload Section */}
                    <FileUpload
                      value={newReel.project_file_url}
                      fileName={newReel.project_file_name}
                      onUploadComplete={({ url, fileName, fileType }) => {
                        setNewReel(prev => ({
                          ...prev,
                          project_file_url: url,
                          project_file_type: fileType,
                          project_file_name: fileName,
                        }));
                      }}
                      onClear={() => {
                        setNewReel(prev => ({
                          ...prev,
                          project_file_url: "",
                          project_file_type: "",
                          project_file_name: "",
                        }));
                      }}
                    />

                    {/* Manual URL fallback */}
                    <div className="admin-field">
                      <label className="admin-label">Or paste URL manually</label>
                      <input 
                        type="text" 
                        placeholder="https://link-to-project-file"
                        value={newReel.project_file_url || ""} 
                        onChange={(e) => setNewReel({...newReel, project_file_url: e.target.value})} 
                        className="admin-input"
                      />
                    </div>

                    <div className="admin-upload__checkboxes">
                      <label className="admin-checkbox">
                        <input 
                          type="checkbox" 
                          checked={newReel.is_visible !== false} 
                          onChange={(e) => setNewReel({...newReel, is_visible: e.target.checked})} 
                        />
                        <span>Visible to Public</span>
                      </label>
                      <label className="admin-checkbox">
                        <input 
                          type="checkbox" 
                          checked={newReel.is_featured === true} 
                          onChange={(e) => setNewReel({...newReel, is_featured: e.target.checked})} 
                        />
                        <span>Featured Reel</span>
                      </label>
                    </div>
                  </div>
                  <div className="admin-modal__footer">
                    <button className="admin-btn-ghost" onClick={() => setIsAddingReel(false)}>Cancel</button>
                    <button className="admin-btn-primary" onClick={handleSaveNewReel} disabled={isSaving}>
                      {isSaving ? "Adding..." : "Add Reel"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═══════════════════════════════════ */}
        {/* Analytics Tab                       */}
        {/* ═══════════════════════════════════ */}
        {activeTab === "analytics" && (
          <div className="admin-tab-content">
            <div className="mb-2">
              <h2 className="text-xl font-heading font-bold text-white">Analytics</h2>
              <p className="text-sm text-white/40 mt-1">Performance insights for your content</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Performing */}
              <div className="admin-card">
                <h3 className="text-base font-heading font-bold text-white mb-5 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-500" />
                  Top Performing Reels
                </h3>
                <div className="space-y-4">
                  {[...dashboardData.reels]
                    .sort((a, b) => (b.view_count || b.views || 0) - (a.view_count || a.views || 0))
                    .slice(0, 5)
                    .map((r, idx, arr) => {
                      const maxViews = arr[0].view_count || arr[0].views || 1;
                      const views = r.view_count || r.views || 0;
                      return (
                    <div key={r.id || r.title} className="group">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-white/80 font-medium text-xs">{r.title}</span>
                        <span className="text-cyan-400 text-xs tabular-nums font-semibold">{views.toLocaleString()}</span>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-cyan-500/60 to-cyan-400/40 rounded-full transition-all duration-700"
                          style={{ width: `${(views / maxViews) * 100}%` }}
                        />
                      </div>
                    </div>
                  );})}
                </div>
              </div>

              {/* Most Downloaded */}
              <div className="admin-card">
                <h3 className="text-base font-heading font-bold text-white mb-5 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-fuchsia-500" />
                  Most Downloaded
                </h3>
                <div className="space-y-4">
                  {[...dashboardData.reels]
                    .sort((a, b) => (b.download_count || b.downloads || 0) - (a.download_count || a.downloads || 0))
                    .slice(0, 5)
                    .map((r, idx, arr) => {
                      const maxDl = arr[0].download_count || arr[0].downloads || 1;
                      const dl = r.download_count || r.downloads || 0;
                      return (
                    <div key={r.id || r.title} className="group">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-white/80 font-medium text-xs">{r.title}</span>
                        <span className="text-fuchsia-400 text-xs tabular-nums font-semibold">{dl}</span>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-fuchsia-500/60 to-fuchsia-400/40 rounded-full transition-all duration-700"
                          style={{ width: `${(dl / maxDl) * 100}%` }}
                        />
                      </div>
                    </div>
                  );})}
                </div>
              </div>
            </div>

            {/* Detailed table */}
            <div className="admin-card mt-6">
              <h3 className="text-base font-heading font-bold text-white mb-5 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                Detailed Analytics
              </h3>
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Reel Title</th>
                      <th>Views</th>
                      <th className="hidden sm:table-cell">Likes</th>
                      <th className="hidden sm:table-cell">Comments</th>
                      <th className="hidden md:table-cell">Shares</th>
                      <th className="text-right">Downloads</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...dashboardData.reels]
                      .sort((a, b) => (b.view_count || b.views || 0) - (a.view_count || a.views || 0))
                      .map((r, i) => (
                      <tr key={r.id || i}>
                        <td className="text-white font-medium">{r.title}</td>
                        <td className="text-cyan-400 tabular-nums">{(r.view_count || r.views || 0).toLocaleString()}</td>
                        <td className="text-white/60 tabular-nums hidden sm:table-cell">{r.likes_count || r.likes || 0}</td>
                        <td className="text-white/60 tabular-nums hidden sm:table-cell">{r.comments_count || r.comments || 0}</td>
                        <td className="text-white/60 tabular-nums hidden md:table-cell">{r.shares_count || r.shares || 0}</td>
                        <td className="text-fuchsia-400 tabular-nums text-right">{r.download_count || r.downloads || 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════ */}
        {/* Settings Tab                        */}
        {/* ═══════════════════════════════════ */}
        {activeTab === "settings" && (
          <div className="admin-tab-content max-w-2xl">
            <div className="mb-2">
              <h2 className="text-xl font-heading font-bold text-white">Settings</h2>
              <p className="text-sm text-white/40 mt-1">Manage your account and preferences</p>
            </div>

            <div className="admin-card">
              <h3 className="text-base font-heading font-bold text-white mb-6 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                Account Details
              </h3>
              <div className="space-y-6">
                <div className="admin-field">
                  <label className="admin-label">Email</label>
                  <p className="text-white text-sm">{session.user?.email}</p>
                </div>
                <div className="admin-field">
                  <label className="admin-label">Login Method</label>
                  <p className="text-white text-sm">{session.provider === "instagram" ? "Instagram" : "Email/Password"}</p>
                </div>
                {session.provider === "instagram" && (
                  <div className="pt-4 border-t border-white/5">
                    <label className="admin-label">Instagram Connection</label>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      <p className="text-emerald-400 text-sm">Connected — Instagram data syncing enabled</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        </div>
      </main>
    </div>
  );
}
