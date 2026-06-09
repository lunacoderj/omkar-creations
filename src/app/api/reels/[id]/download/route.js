import { NextResponse } from "next/server";

export async function POST(request, { params }) {
  const { id } = await params;
  // In production, increment download_count in Firestore
  // For now, just acknowledge the download
  console.log(`Download tracked for reel: ${id}`);
  return NextResponse.json({ success: true, reelId: id });
}
