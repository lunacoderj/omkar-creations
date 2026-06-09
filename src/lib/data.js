import { adminDb } from "./firebaseAdmin";

// Mock data matching Omkar's actual Instagram content
const MOCK_REELS = [
  {
    id: "1",
    title: "QALB — Mass Edit",
    category: "mass_edit",
    description: "High-energy mass edit with stunning VFX transitions and color grading.",
    instagram_url: "https://www.instagram.com/reel/example1/",
    thumbnail_url: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=500&fit=crop",
    project_file_url: "",
    project_file_type: "xml",
    is_featured: true,
    is_visible: true,
    download_count: 245,
    view_count: 1820,
    created_at: "2026-05-20T00:00:00Z",
  },
  {
    id: "2",
    title: "DC Motion Poster",
    category: "motion_poster",
    description: "Cinematic DC-style motion poster with dynamic particle effects.",
    instagram_url: "https://www.instagram.com/reel/example2/",
    thumbnail_url: "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=400&h=500&fit=crop",
    project_file_url: "#",
    project_file_type: "xml",
    is_featured: true,
    is_visible: true,
    download_count: 189,
    view_count: 2100,
    created_at: "2026-05-18T00:00:00Z",
  },
  {
    id: "3",
    title: "GOD MODE — NTR",
    category: "mass_edit",
    description: "Epic NTR mass edit with heavy bass sync and fire transitions.",
    instagram_url: "https://www.instagram.com/reel/example3/",
    thumbnail_url: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&h=500&fit=crop",
    project_file_url: "#",
    project_file_type: "xml",
    is_featured: true,
    is_visible: true,
    download_count: 312,
    view_count: 3400,
    created_at: "2026-05-15T00:00:00Z",
  },
  {
    id: "4",
    title: "HANUMAN — Cinematic Edit",
    category: "devotional",
    description: "Devotional cinematic edit of Lord Hanuman with epic music sync.",
    instagram_url: "https://www.instagram.com/reel/example4/",
    thumbnail_url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&h=500&fit=crop",
    project_file_url: "",
    project_file_type: "",
    is_featured: true,
    is_visible: true,
    download_count: 0,
    view_count: 2800,
    created_at: "2026-05-12T00:00:00Z",
  },
  {
    id: "5",
    title: "Ni Dhyaanam — Song Promo",
    category: "song_promo",
    description: "Music promotion with smooth transitions and aesthetic visuals.",
    instagram_url: "https://www.instagram.com/reel/example5/",
    thumbnail_url: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=500&fit=crop",
    project_file_url: "#",
    project_file_type: "xml",
    is_featured: true,
    is_visible: true,
    download_count: 156,
    view_count: 1950,
    created_at: "2026-05-10T00:00:00Z",
  },
  {
    id: "6",
    title: "MIRAI — Anime Edit",
    category: "anime",
    description: "Clean anime-style edit with cinematic color grading and smooth transitions.",
    instagram_url: "https://www.instagram.com/reel/example6/",
    thumbnail_url: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&h=500&fit=crop",
    project_file_url: "#",
    project_file_type: "xml",
    is_featured: true,
    is_visible: true,
    download_count: 198,
    view_count: 2400,
    created_at: "2026-05-08T00:00:00Z",
  },
  {
    id: "7",
    title: "Karuppu Title Card",
    category: "cinema",
    description: "Title card recreation with heavy mass effects and typography.",
    instagram_url: "https://www.instagram.com/reel/example7/",
    thumbnail_url: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=500&fit=crop",
    project_file_url: "",
    project_file_type: "",
    is_featured: false,
    is_visible: true,
    download_count: 0,
    view_count: 1200,
    created_at: "2026-05-05T00:00:00Z",
  },
  {
    id: "8",
    title: "BIN — Visual Effects",
    category: "mass_edit",
    description: "Quick-cut visual effects with beat sync and neon color palette.",
    instagram_url: "https://www.instagram.com/reel/example8/",
    thumbnail_url: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400&h=500&fit=crop",
    project_file_url: "#",
    project_file_type: "xml",
    is_featured: false,
    is_visible: true,
    download_count: 87,
    view_count: 980,
    created_at: "2026-05-02T00:00:00Z",
  },
  {
    id: "9",
    title: "SPIRIT — Prabhas Edit",
    category: "mass_edit",
    description: "Prabhas mass tribute edit with dramatic slow-motion and bass effects.",
    instagram_url: "https://www.instagram.com/reel/example9/",
    thumbnail_url: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&h=500&fit=crop",
    project_file_url: "",
    project_file_type: "",
    is_featured: false,
    is_visible: true,
    download_count: 0,
    view_count: 1650,
    created_at: "2026-04-28T00:00:00Z",
  },
  {
    id: "10",
    title: "OG SALAAR — Mass Edit",
    category: "mass_edit",
    description: "Salaar-themed cinematic mass edit with fire and smoke overlays.",
    instagram_url: "https://www.instagram.com/reel/example10/",
    thumbnail_url: "https://images.unsplash.com/photo-1595769816263-9b910be24d5f?w=400&h=500&fit=crop",
    project_file_url: "#",
    project_file_type: "zip",
    is_featured: false,
    is_visible: true,
    download_count: 134,
    view_count: 2100,
    created_at: "2026-04-25T00:00:00Z",
  },
  {
    id: "11",
    title: "LORD HANUMAN — Art Edit",
    category: "devotional",
    description: "Artistic devotional edit of Lord Hanuman with golden tones and particles.",
    instagram_url: "https://www.instagram.com/reel/example11/",
    thumbnail_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop",
    project_file_url: "",
    project_file_type: "",
    is_featured: false,
    is_visible: true,
    download_count: 0,
    view_count: 1890,
    created_at: "2026-04-22T00:00:00Z",
  },
  {
    id: "12",
    title: "Vaana Chinukulu ft Bahubali",
    category: "cinema",
    description: "Bahubali-themed cinematic edit with rain effects and emotional music.",
    instagram_url: "https://www.instagram.com/reel/example12/",
    thumbnail_url: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=500&fit=crop",
    project_file_url: "#",
    project_file_type: "xml",
    is_featured: false,
    is_visible: true,
    download_count: 223,
    view_count: 3100,
    created_at: "2026-04-18T00:00:00Z",
  },
];

const MOCK_INTERACTIONS = [
  { id: "1", post_id: "1", post_title: "QALB — Mass Edit", action_type: "download", timestamp: "2026-05-31T14:30:00Z", user_agent: "Mobile Safari", referrer: "instagram.com" },
  { id: "2", post_id: "3", post_title: "GOD MODE — NTR", action_type: "visit", timestamp: "2026-05-31T13:20:00Z", user_agent: "Chrome Android", referrer: "direct" },
  { id: "3", post_id: "5", post_title: "Ni Dhyaanam — Song Promo", action_type: "download", timestamp: "2026-05-31T12:15:00Z", user_agent: "Firefox", referrer: "google.com" },
  { id: "4", post_id: "2", post_title: "DC Motion Poster", action_type: "visit", timestamp: "2026-05-31T11:00:00Z", user_agent: "Chrome", referrer: "instagram.com" },
  { id: "5", post_id: "6", post_title: "MIRAI — Anime Edit", action_type: "download", timestamp: "2026-05-30T22:30:00Z", user_agent: "Mobile Safari", referrer: "whatsapp" },
  { id: "6", post_id: "1", post_title: "QALB — Mass Edit", action_type: "download", timestamp: "2026-05-30T18:45:00Z", user_agent: "Samsung Browser", referrer: "instagram.com" },
  { id: "7", post_id: "10", post_title: "OG SALAAR — Mass Edit", action_type: "visit", timestamp: "2026-05-30T15:10:00Z", user_agent: "Chrome", referrer: "direct" },
  { id: "8", post_id: "3", post_title: "GOD MODE — NTR", action_type: "download", timestamp: "2026-05-30T10:00:00Z", user_agent: "Edge", referrer: "bing.com" },
];

export async function getReels(limit = null) {
  try {
    if (adminDb) {
      let query = adminDb.collection("posts").orderBy("created_at", "desc");
      const snapshot = await query.get();
      let docs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      docs = docs.filter(doc => doc.is_visible === true);
      if (limit) docs = docs.slice(0, limit);
      return docs;
    }
  } catch (e) {
    console.warn("Firestore fetch failed, using mock data:", e.message);
  }
  const visibleReels = MOCK_REELS.filter((r) => r.is_visible);
  return limit ? visibleReels.slice(0, limit) : visibleReels;
}

export async function getFeaturedReels() {
  try {
    if (adminDb) {
      const snapshot = await adminDb
        .collection("posts")
        .orderBy("created_at", "desc")
        .get();
        
      let docs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      return docs.filter(doc => doc.is_featured === true && doc.is_visible === true).slice(0, 6);
    }
  } catch (e) {
    console.warn("Firestore fetch failed, using mock data:", e.message);
  }
  return MOCK_REELS.filter((r) => r.is_featured && r.is_visible).slice(0, 6);
}

export async function getReel(id) {
  try {
    if (adminDb) {
      const doc = await adminDb.collection("posts").doc(id).get();
      if (doc.exists) return { id: doc.id, ...doc.data() };
    }
  } catch (e) {
    console.warn("Firestore fetch failed, using mock data:", e.message);
  }
  return MOCK_REELS.find((r) => r.id === id) || null;
}

export async function getAllReels() {
  try {
    if (adminDb) {
      const snapshot = await adminDb.collection("posts").orderBy("created_at", "desc").get();
      return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    }
  } catch (e) {
    console.warn("Firestore fetch failed, using mock data:", e.message);
  }
  return MOCK_REELS;
}

export async function getInteractions(limit = 10) {
  try {
    if (adminDb) {
      const snapshot = await adminDb
        .collection("interactions")
        .orderBy("timestamp", "desc")
        .limit(limit)
        .get();
      return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    }
  } catch (e) {
    console.warn("Firestore fetch failed, using mock data:", e.message);
  }
  return MOCK_INTERACTIONS.slice(0, limit);
}

export async function getStats() {
  const reels = await getAllReels();
  const totalDownloads = reels.reduce((sum, r) => sum + (r.download_count || 0), 0);
  const totalViews = reels.reduce((sum, r) => sum + (r.view_count || 0), 0);

  return {
    totalReels: reels.length,
    totalDownloads,
    totalViews,
    totalFollowers: 748,
  };
}

export async function updateReel(id, updates) {
  try {
    if (adminDb) {
      await adminDb.collection("posts").doc(id).update(updates);
      return { success: true };
    }
  } catch (e) {
    console.error("Failed to update reel:", e.message);
    return { success: false, error: e.message };
  }
  // Mock fallback
  const index = MOCK_REELS.findIndex((r) => r.id === id);
  if (index !== -1) {
    MOCK_REELS[index] = { ...MOCK_REELS[index], ...updates };
    return { success: true };
  }
  return { success: false, error: "Not found" };
}

export async function deleteReel(id) {
  try {
    if (adminDb) {
      await adminDb.collection("posts").doc(id).delete();
      return { success: true };
    }
  } catch (e) {
    console.error("Failed to delete reel:", e.message);
    return { success: false, error: e.message };
  }
  return { success: true };
}

export async function createReel(reelData) {
  try {
    if (adminDb) {
      const docRef = await adminDb.collection("posts").add({
        ...reelData,
        created_at: new Date().toISOString(),
        view_count: reelData.view_count || 0,
        download_count: reelData.download_count || 0,
        is_visible: reelData.is_visible !== false,
        is_featured: reelData.is_featured || false,
      });
      return { success: true, id: docRef.id };
    }
  } catch (e) {
    console.error("Failed to create reel:", e.message);
    return { success: false, error: e.message };
  }
  // Mock fallback
  const newReel = {
    id: String(Date.now()),
    ...reelData,
    created_at: new Date().toISOString(),
    view_count: reelData.view_count || 0,
    download_count: reelData.download_count || 0,
    is_visible: reelData.is_visible !== false,
    is_featured: reelData.is_featured || false,
  };
  MOCK_REELS.unshift(newReel);
  return { success: true, id: newReel.id };
}

