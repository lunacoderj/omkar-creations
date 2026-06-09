import { getStats, getAllReels, getInteractions } from "@/lib/data";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const stats = await getStats();
    const reels = await getAllReels();
    const interactions = await getInteractions(10);
    return NextResponse.json({ stats, reels, interactions });
  } catch (err) {
    console.error("Error fetching admin data:", err);
    return NextResponse.json({ error: "Failed to fetch admin data" }, { status: 500 });
  }
}
