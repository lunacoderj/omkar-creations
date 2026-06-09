import { getReels, getFeaturedReels } from "@/lib/data";
import { normalizeReel } from "@/lib/helpers";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const limit = searchParams.get("limit");
  const featured = searchParams.get("featured");

  try {
    let reels;
    if (featured === "true") {
      reels = await getFeaturedReels();
    } else {
      reels = await getReels(limit ? parseInt(limit) : null);
    }
    const normalized = reels.map(normalizeReel);
    return NextResponse.json({ reels: normalized });
  } catch (err) {
    console.error("Error fetching reels:", err);
    return NextResponse.json({ reels: [], error: "Failed to fetch reels" }, { status: 500 });
  }
}
