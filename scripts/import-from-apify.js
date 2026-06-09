/**
 * ========================================================
 * OMKAR CREATIONS — Bulk Reel Import Script
 * ========================================================
 * 
 * This script reads an Apify JSON export and bulk-writes
 * all reels into Firebase Firestore's "posts" collection.
 * 
 * USAGE:
 *   node scripts/import-from-apify.js <path-to-apify-json>
 * 
 * SETUP:
 *   1. Go to https://console.firebase.google.com
 *   2. Project Settings → Service Accounts → Generate New Private Key
 *   3. Save the JSON file as: scripts/serviceAccountKey.json
 *   4. Run the Apify Instagram Reel Scraper on your profile
 *   5. Download the JSON output
 *   6. Run: node scripts/import-from-apify.js ./apify-export.json
 * 
 * WHAT IT DOES:
 *   - Reads each reel from the Apify JSON
 *   - Extracts: shortcode, caption, timestamp, view count, thumbnail
 *   - Maps to the Firestore schema used by the portfolio site
 *   - Uses Instagram embeds for playback (no CDN expiry issues)
 *   - Batch-writes to Firestore (500 docs per batch, Firestore limit)
 *   - Auto-categorizes based on hashtags and caption keywords
 * ========================================================
 */

const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

// ─── Configuration ──────────────────────────────────────
const SERVICE_ACCOUNT_PATH = path.join(__dirname, "serviceAccountKey.json");
const COLLECTION_NAME = "posts";
const BATCH_SIZE = 450; // Stay under Firestore's 500-write batch limit

// ─── Category Detection ─────────────────────────────────
// Maps keywords in captions/hashtags to portfolio categories
const CATEGORY_RULES = [
  { keywords: ["mass", "mass edit", "massedit", "beast", "god mode", "ogmode", "masstelugusongs", "massbgm", "elevation", "attitude", "kalki", "kgf"], category: "mass_edit" },
  { keywords: ["anime", "amv", "manga", "mirai", "naruto", "one piece", "jujutsu", "otaku", "gojo", "sukuna"], category: "anime" },
  { keywords: ["vfx", "aftereffects", "motion poster", "motionposter", "poster", "motion", "cgi", "blender", "edit"], category: "vfx" },
  { keywords: ["devotional", "god", "hanuman", "shiva", "krishna", "temple", "parvati", "shivaji", "shiv", "ram", "bhakti", "hindu"], category: "devotional" },
  { keywords: ["cinema", "cinematic", "movie", "film", "bahubali", "rrr", "pushpa", "tollywood", "salaar", "prabhas", "telugucinema", "ntr", "ramcharan", "alluarjun"], category: "cinema" },
  { keywords: ["tutorial", "howto", "how to", "learn", "tips", "breakdown", "project file", "projectfile", "giveaway", "preset"], category: "project_file" },
  { keywords: ["love failure", "broken heart", "brokenheart", "lovefailure", "sadtelugusongs", "heartbreakstory", "broken", "emotional", "lovehurts", "lovefailed", "sad", "pain", "heartbreak"], category: "sad_edit" },
  { keywords: ["love", "romantictelugusongs", "lovesongs", "romantic", "couple", "feelgoodsongs", "lalithaedits", "wedding", "prewedding"], category: "love_edit" },
  { keywords: ["song", "promo", "lyrical", "music", "melody", "lyrics", "telugusongs", "teluguhits", "teluguplaylist", "telugubeats", "telugualbum", "retrotelugusongs", "audio", "bgm", "trendingaudio"], category: "song_promo" },
];

function detectCategory(caption, hashtags) {
  // Apify hashtags include '#' prefix — strip them for matching
  const cleanTags = (hashtags || []).map((h) => h.replace(/^#/, ""));
  const text = `${caption} ${cleanTags.join(" ")}`.toLowerCase();
  for (const rule of CATEGORY_RULES) {
    if (rule.keywords.some((kw) => text.includes(kw))) {
      return rule.category;
    }
  }
  return "other";
}

// ─── Title Extraction ────────────────────────────────────
// Extracts a clean title from Instagram captions
function extractTitle(caption) {
  if (!caption) return "Untitled Reel";
  
  // Take the first line or first sentence
  let title = caption.split("\n")[0].trim();
  
  // Remove hashtags from the title
  title = title.replace(/#\w+/g, "").trim();
  
  // Remove emojis (keep letters, numbers, common punctuation)
  title = title.replace(/[^\w\s\-—–''"".,!?:;()&@/]/g, "").trim();
  
  // Truncate if too long
  if (title.length > 80) {
    title = title.substring(0, 77) + "...";
  }
  
  return title || "Untitled Reel";
}

// ─── Description Extraction ──────────────────────────────
function extractDescription(caption) {
  if (!caption) return "";
  
  // Remove hashtags
  let desc = caption.replace(/#\w+/g, "").trim();
  
  // Take first 200 chars
  if (desc.length > 200) {
    desc = desc.substring(0, 197) + "...";
  }
  
  return desc;
}

// ─── Transform Apify Data → Firestore Schema ────────────
// Field mapping for Apify ig-reels-scraper:
//   code         → instagram_shortcode
//   post_url     → instagram_url  
//   caption      → title + description
//   play_count   → view_count
//   like_count   → likes_count
//   comment_count→ comments_count
//   thumbnail_url→ thumbnail_url (CDN, may expire)
//   taken_at_formatted → created_at
//   hashtags     → hashtags (includes # prefix)
function transformReel(apifyItem, index) {
  const shortCode = apifyItem.code || apifyItem.shortCode || apifyItem.shortcode || "";
  const caption = apifyItem.caption || apifyItem.alt || "";
  const rawHashtags = apifyItem.hashtags || [];
  // Strip '#' prefix from hashtags for clean storage
  const cleanHashtags = rawHashtags.map((h) => h.replace(/^#/, ""));
  
  return {
    title: extractTitle(caption),
    category: detectCategory(caption, rawHashtags),
    description: extractDescription(caption),
    instagram_url: apifyItem.post_url || apifyItem.url || `https://www.instagram.com/reel/${shortCode}/`,
    instagram_shortcode: shortCode,
    video_url: apifyItem.video_url || apifyItem.videoUrl || "",
    // Use Instagram embed for playback — CDN URLs expire, embeds don't
    embed_url: `https://www.instagram.com/reel/${shortCode}/embed`,
    // Store the CDN thumbnail — may expire after ~48h
    thumbnail_url: apifyItem.thumbnail_url || apifyItem.displayUrl || apifyItem.display_url || "",
    project_file_url: "",
    project_file_type: "",
    is_featured: false,
    is_visible: true,
    download_count: 0,
    view_count: apifyItem.play_count || apifyItem.videoViewCount || apifyItem.viewCount || 0,
    likes_count: apifyItem.like_count || apifyItem.likesCount || apifyItem.likes || 0,
    comments_count: apifyItem.comment_count || apifyItem.commentsCount || apifyItem.comments || 0,
    hashtags: cleanHashtags,
    owner_username: apifyItem.owner_id || apifyItem.ownerUsername || "",
    created_at: apifyItem.taken_at_formatted || apifyItem.timestamp || new Date().toISOString(),
    imported_at: new Date().toISOString(),
    source: "apify_import",
    original_apify_id: apifyItem.id || "",
  };
}

// ─── Main Import Function ────────────────────────────────
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log(`
╔══════════════════════════════════════════════════════════╗
║          OMKAR CREATIONS — Bulk Reel Importer           ║
╠══════════════════════════════════════════════════════════╣
║                                                          ║
║  Usage:                                                  ║
║    node scripts/import-from-apify.js <json-file>         ║
║                                                          ║
║  Options:                                                ║
║    --dry-run    Preview without writing to Firestore     ║
║    --clear      Delete all existing posts first          ║
║    --featured N Mark the top N reels as featured         ║
║                                                          ║
║  Example:                                                ║
║    node scripts/import-from-apify.js reels.json          ║
║    node scripts/import-from-apify.js reels.json --dry-run║
║    node scripts/import-from-apify.js reels.json          ║
║         --clear --featured 6                             ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
    `);
    process.exit(0);
  }

  // Parse arguments
  const jsonFile = args[0];
  const isDryRun = args.includes("--dry-run");
  const shouldClear = args.includes("--clear");
  const featuredIdx = args.indexOf("--featured");
  const featuredCount = featuredIdx !== -1 ? parseInt(args[featuredIdx + 1], 10) || 6 : 0;

  // ─── Validate JSON file ────────────────────────────────
  const jsonPath = path.resolve(jsonFile);
  if (!fs.existsSync(jsonPath)) {
    console.error(`❌ File not found: ${jsonPath}`);
    process.exit(1);
  }

  console.log("\n🎬 OMKAR CREATIONS — Bulk Reel Importer");
  console.log("═".repeat(50));

  // ─── Read and parse JSON ───────────────────────────────
  let rawData;
  try {
    const fileContent = fs.readFileSync(jsonPath, "utf-8");
    rawData = JSON.parse(fileContent);
  } catch (e) {
    console.error(`❌ Failed to parse JSON: ${e.message}`);
    process.exit(1);
  }

  // Handle both array and object-with-array formats
  const items = Array.isArray(rawData) ? rawData : rawData.items || rawData.data || rawData.results || [];
  
  if (items.length === 0) {
    console.error("❌ No reels found in the JSON file.");
    process.exit(1);
  }

  console.log(`📂 Found ${items.length} reels in ${path.basename(jsonPath)}`);

  // ─── Filter to only video/reel content ─────────────────
  const reelItems = items.filter((item) => {
    const postType = (item.post_type || item.type || item.media_type || "").toLowerCase();
    const kind = (item.kind || "").toLowerCase();
    // Include reels, videos, clips, and generic posts
    return postType === "reel" || postType === "video" || postType === "clips" ||
           kind === "post" || postType === "";
  });

  console.log(`🎞️  Filtered to ${reelItems.length} video/reel items`);

  // ─── Transform data ────────────────────────────────────
  const transformedReels = reelItems.map((item, idx) => transformReel(item, idx));

  // Mark featured reels (most viewed first)
  if (featuredCount > 0) {
    const sortedByViews = [...transformedReels].sort((a, b) => b.view_count - a.view_count);
    const featuredIds = new Set(sortedByViews.slice(0, featuredCount).map((r) => r.instagram_shortcode));
    transformedReels.forEach((reel) => {
      if (featuredIds.has(reel.instagram_shortcode)) {
        reel.is_featured = true;
      }
    });
    console.log(`⭐ Marked top ${featuredCount} reels as featured (by view count)`);
  }

  // ─── Category breakdown ────────────────────────────────
  const categoryCounts = {};
  transformedReels.forEach((r) => {
    categoryCounts[r.category] = (categoryCounts[r.category] || 0) + 1;
  });
  
  console.log("\n📊 Category breakdown:");
  Object.entries(categoryCounts)
    .sort(([, a], [, b]) => b - a)
    .forEach(([cat, count]) => {
      console.log(`   ${cat.padEnd(20)} ${count} reels`);
    });

  // ─── Preview first 5 ──────────────────────────────────
  console.log("\n🔍 Preview (first 5 reels):");
  transformedReels.slice(0, 5).forEach((reel, i) => {
    console.log(`   ${i + 1}. "${reel.title}" [${reel.category}] — ${reel.view_count} views`);
  });
  if (transformedReels.length > 5) {
    console.log(`   ... and ${transformedReels.length - 5} more`);
  }

  // ─── Dry run exit ──────────────────────────────────────
  if (isDryRun) {
    console.log("\n🏃 DRY RUN — No data written to Firestore.");
    console.log("   Remove --dry-run to actually import.\n");
    
    // Save preview to file
    const previewPath = path.join(__dirname, "import-preview.json");
    fs.writeFileSync(previewPath, JSON.stringify(transformedReels.slice(0, 10), null, 2));
    console.log(`   Preview saved to: ${previewPath}`);
    process.exit(0);
  }

  // ─── Initialize Firebase Admin ─────────────────────────
  if (!fs.existsSync(SERVICE_ACCOUNT_PATH)) {
    console.error(`
❌ Service account key not found!

   Expected at: ${SERVICE_ACCOUNT_PATH}
   
   To get this file:
   1. Go to https://console.firebase.google.com
   2. Select project "omkar-creations"
   3. Settings ⚙️ → Service Accounts
   4. Click "Generate New Private Key"
   5. Save the downloaded JSON as:
      scripts/serviceAccountKey.json
    `);
    process.exit(1);
  }

  const serviceAccount = require(SERVICE_ACCOUNT_PATH);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  const db = admin.firestore();

  // ─── Clear existing posts if requested ─────────────────
  if (shouldClear) {
    console.log("\n🗑️  Clearing existing posts...");
    const existingDocs = await db.collection(COLLECTION_NAME).listDocuments();
    const clearBatches = [];
    let clearBatch = db.batch();
    let clearCount = 0;

    for (const docRef of existingDocs) {
      clearBatch.delete(docRef);
      clearCount++;
      if (clearCount % BATCH_SIZE === 0) {
        clearBatches.push(clearBatch);
        clearBatch = db.batch();
      }
    }
    if (clearCount % BATCH_SIZE !== 0) {
      clearBatches.push(clearBatch);
    }

    for (const batch of clearBatches) {
      await batch.commit();
    }
    console.log(`   Deleted ${clearCount} existing documents.`);
  }

  // ─── Batch write to Firestore ──────────────────────────
  console.log(`\n📤 Importing ${transformedReels.length} reels to Firestore...`);
  
  let written = 0;
  let batchNum = 0;
  let batch = db.batch();

  for (let i = 0; i < transformedReels.length; i++) {
    const reel = transformedReels[i];
    
    // Use the Instagram shortcode as the document ID for deduplication
    const docId = reel.instagram_shortcode || `reel_${i}`;
    const docRef = db.collection(COLLECTION_NAME).doc(docId);
    batch.set(docRef, reel, { merge: true }); // merge: true allows re-running safely
    written++;

    if (written % BATCH_SIZE === 0) {
      batchNum++;
      await batch.commit();
      console.log(`   ✅ Batch ${batchNum}: Wrote ${written}/${transformedReels.length}`);
      batch = db.batch();
    }
  }

  // Commit remaining
  if (written % BATCH_SIZE !== 0) {
    batchNum++;
    await batch.commit();
    console.log(`   ✅ Batch ${batchNum}: Wrote ${written}/${transformedReels.length}`);
  }

  // ─── Summary ───────────────────────────────────────────
  console.log(`
╔══════════════════════════════════════════════════════════╗
║                   ✅ IMPORT COMPLETE                     ║
╠══════════════════════════════════════════════════════════╣
║  Total imported:  ${String(written).padEnd(37)}║
║  Batches used:    ${String(batchNum).padEnd(37)}║
║  Featured reels:  ${String(featuredCount || "none").padEnd(37)}║
║  Collection:      ${COLLECTION_NAME.padEnd(37)}║
╚══════════════════════════════════════════════════════════╝

  Your portfolio site will now display these reels.
  Run 'npm run dev' to verify locally.
  `);

  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Import failed:", err);
  process.exit(1);
});
