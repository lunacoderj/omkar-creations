import { getReels, getFeaturedReels, createReel } from "@/lib/data";
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

export async function POST(request) {
  try {
    const reelData = await request.json();
    const result = await createReel(reelData);
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    return NextResponse.json({ success: true, id: result.id });
  } catch (err) {
    console.error("Error creating reel:", err);
    return NextResponse.json({ error: "Failed to create reel" }, { status: 500 });
  }
}
