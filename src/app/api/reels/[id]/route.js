import { getReel } from "@/lib/data";
import { normalizeReel } from "@/lib/helpers";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const { id } = await params;
  try {
    const reel = await getReel(id);
    if (!reel) {
      return NextResponse.json({ error: "Reel not found" }, { status: 404 });
    }
    return NextResponse.json(normalizeReel(reel));
  } catch (err) {
    console.error("Error fetching reel:", err);
    return NextResponse.json({ error: "Failed to fetch reel" }, { status: 500 });
  }
}
