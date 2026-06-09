import { getReel, updateReel, deleteReel } from "@/lib/data";
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

export async function PUT(request, { params }) {
  const { id } = await params;
  try {
    const updates = await request.json();
    const result = await updateReel(id, updates);
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error updating reel:", err);
    return NextResponse.json({ error: "Failed to update reel" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  try {
    const result = await deleteReel(id);
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error deleting reel:", err);
    return NextResponse.json({ error: "Failed to delete reel" }, { status: 500 });
  }
}
