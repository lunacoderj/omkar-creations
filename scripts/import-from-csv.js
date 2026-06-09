/**
 * ========================================================
 * OMKAR CREATIONS — Manual CSV/JSON Bulk Import
 * ========================================================
 * 
 * Alternative to the Apify importer. The client can fill
 * in a simple CSV (from Google Sheets or Excel) with their
 * reel URLs, and this script will create Firestore entries.
 * 
 * USAGE:
 *   node scripts/import-from-csv.js <csv-file>
 * 
 * CSV FORMAT (comma-separated, first row is header):
 *   title,instagram_url,category,is_featured
 *   QALB Mass Edit,https://www.instagram.com/reel/ABC123/,mass_edit,true
 *   DC Motion Poster,https://www.instagram.com/reel/DEF456/,motion_poster,false
 * 
 * VALID CATEGORIES:
 *   mass_edit, anime, motion_poster, song_promo,
 *   devotional, cinema, tutorial, collab, other
 * ========================================================
 */

const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

const SERVICE_ACCOUNT_PATH = path.join(__dirname, "serviceAccountKey.json");
const COLLECTION_NAME = "posts";
const BATCH_SIZE = 450;

// ─── Extract shortcode from Instagram URL ────────────────
function extractShortcode(url) {
  if (!url) return "";
  const match = url.match(/\/reel\/([A-Za-z0-9_-]+)/);
  return match ? match[1] : "";
}

// ─── Parse CSV ──────────────────────────────────────────
function parseCSV(content) {
  const lines = content.split("\n").map((l) => l.trim()).filter((l) => l.length > 0);
  if (lines.length < 2) return [];

  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    // Handle quoted fields with commas
    const values = [];
    let current = "";
    let inQuotes = false;
    
    for (const char of lines[i]) {
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === "," && !inQuotes) {
        values.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }
    values.push(current.trim());

    const row = {};
    headers.forEach((header, idx) => {
      row[header] = values[idx] || "";
    });
    rows.push(row);
  }

  return rows;
}

// ─── Transform CSV Row → Firestore Document ─────────────
function transformRow(row) {
  const instagramUrl = row.instagram_url || row.url || row.link || "";
  const shortCode = extractShortcode(instagramUrl);

  return {
    title: row.title || row.name || "Untitled Reel",
    category: row.category || row.type || "other",
    description: row.description || row.desc || "",
    instagram_url: instagramUrl,
    instagram_shortcode: shortCode,
    embed_url: shortCode ? `https://www.instagram.com/reel/${shortCode}/embed` : "",
    thumbnail_url: row.thumbnail_url || row.thumbnail || "",
    project_file_url: row.project_file_url || row.download_url || "",
    project_file_type: row.project_file_type || "",
    is_featured: ["true", "yes", "1"].includes((row.is_featured || "").toLowerCase()),
    is_visible: row.is_visible ? ["true", "yes", "1"].includes(row.is_visible.toLowerCase()) : true,
    download_count: parseInt(row.download_count, 10) || 0,
    view_count: parseInt(row.view_count || row.views, 10) || 0,
    likes_count: parseInt(row.likes_count || row.likes, 10) || 0,
    comments_count: parseInt(row.comments_count || row.comments, 10) || 0,
    hashtags: (row.hashtags || "").split(";").map((h) => h.trim()).filter(Boolean),
    created_at: row.created_at || row.date || new Date().toISOString(),
    imported_at: new Date().toISOString(),
    source: "csv_import",
  };
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log(`
╔══════════════════════════════════════════════════════════╗
║       OMKAR CREATIONS — CSV/Manual Bulk Importer        ║
╠══════════════════════════════════════════════════════════╣
║                                                          ║
║  Usage:                                                  ║
║    node scripts/import-from-csv.js <csv-file>            ║
║                                                          ║
║  CSV Header (minimum):                                   ║
║    title,instagram_url,category                          ║
║                                                          ║
║  CSV Header (full):                                      ║
║    title,instagram_url,category,description,             ║
║    is_featured,thumbnail_url,view_count,likes_count      ║
║                                                          ║
║  Options:                                                ║
║    --dry-run    Preview without writing to Firestore     ║
║    --clear      Delete all existing posts first          ║
║                                                          ║
║  Example:                                                ║
║    node scripts/import-from-csv.js my-reels.csv          ║
║    node scripts/import-from-csv.js my-reels.csv --dry-run║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
    `);
    process.exit(0);
  }

  const csvFile = args[0];
  const isDryRun = args.includes("--dry-run");
  const shouldClear = args.includes("--clear");

  const csvPath = path.resolve(csvFile);
  if (!fs.existsSync(csvPath)) {
    console.error(`❌ File not found: ${csvPath}`);
    process.exit(1);
  }

  console.log("\n🎬 OMKAR CREATIONS — CSV Bulk Importer");
  console.log("═".repeat(50));

  // Parse CSV
  const content = fs.readFileSync(csvPath, "utf-8");
  const rows = parseCSV(content);

  if (rows.length === 0) {
    console.error("❌ No data rows found in CSV.");
    process.exit(1);
  }

  console.log(`📂 Found ${rows.length} entries in ${path.basename(csvPath)}`);

  // Transform
  const transformedReels = rows.map((row) => transformRow(row));

  // Preview
  console.log("\n🔍 Preview (first 5):");
  transformedReels.slice(0, 5).forEach((reel, i) => {
    console.log(`   ${i + 1}. "${reel.title}" [${reel.category}] — ${reel.instagram_url}`);
  });

  if (isDryRun) {
    console.log("\n🏃 DRY RUN — No data written.\n");
    process.exit(0);
  }

  // Initialize Firebase
  if (!fs.existsSync(SERVICE_ACCOUNT_PATH)) {
    console.error(`❌ Service account key not found at: ${SERVICE_ACCOUNT_PATH}`);
    process.exit(1);
  }

  const serviceAccount = require(SERVICE_ACCOUNT_PATH);
  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
  const db = admin.firestore();

  // Clear if requested
  if (shouldClear) {
    console.log("\n🗑️  Clearing existing posts...");
    const existingDocs = await db.collection(COLLECTION_NAME).listDocuments();
    const clearBatch = db.batch();
    existingDocs.forEach((doc) => clearBatch.delete(doc));
    if (existingDocs.length > 0) await clearBatch.commit();
    console.log(`   Deleted ${existingDocs.length} existing documents.`);
  }

  // Batch write
  console.log(`\n📤 Importing ${transformedReels.length} reels...`);
  let batch = db.batch();
  let written = 0;

  for (const reel of transformedReels) {
    const docId = reel.instagram_shortcode || `csv_${written}`;
    const docRef = db.collection(COLLECTION_NAME).doc(docId);
    batch.set(docRef, reel, { merge: true });
    written++;

    if (written % BATCH_SIZE === 0) {
      await batch.commit();
      console.log(`   ✅ Wrote ${written}/${transformedReels.length}`);
      batch = db.batch();
    }
  }

  if (written % BATCH_SIZE !== 0) {
    await batch.commit();
  }

  console.log(`\n✅ Successfully imported ${written} reels to Firestore!\n`);
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Import failed:", err);
  process.exit(1);
});
