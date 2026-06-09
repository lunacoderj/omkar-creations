// Normalize data from Firestore/mock into consistent format for components

const CATEGORY_MAP = {
  mass_edit: "Mass Edit",
  motion_poster: "Mass Edit",
  devotional: "Devotional",
  song_promo: "Song Promo",
  anime: "Anime",
  cinema: "Cinema",
  trending: "Trending",
};

export function normalizeReel(reel) {
  const pUrl = reel.project_file_url || reel.projectFileUrl || "";
  const projectFileUrl = pUrl === "#" ? "" : pUrl;
  
  return {
    id: reel.id,
    title: reel.title,
    description: reel.description || "",
    category: CATEGORY_MAP[reel.category] || reel.category || "Mass Edit",
    thumbnailUrl: reel.thumbnail_url || reel.thumbnailUrl || "",
    videoUrl: reel.video_url || reel.videoUrl || reel.videoUrl || "",
    instagramUrl: reel.instagram_url || reel.instagramUrl || "",
    projectFileUrl,
    projectFileType: reel.project_file_type || reel.projectFileType || "",
    hasProjectFile: !!projectFileUrl,
    isFeatured: reel.is_featured ?? reel.isFeatured ?? false,
    views: formatCount(reel.view_count || reel.views || 0),
    likes: formatCount(reel.likes_count || reel.likes || 0),
    comments: formatCount(reel.comments_count || reel.comments || 0),
    shares: formatCount(reel.shares_count || reel.shares || 0),
    downloadCount: reel.download_count || 0,
    downloads: reel.download_count || reel.downloads || 0,
    viewCount: reel.view_count || reel.views || 0,
    createdAt: reel.created_at || reel.createdAt || "",
  };
}

function formatCount(num) {
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return String(num);
}
