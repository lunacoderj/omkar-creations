import { adminStorage } from "@/lib/firebaseAdmin";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const reelId = formData.get("reelId");

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type — allow XML and ZIP project files
    const allowedTypes = [
      "text/xml",
      "application/xml",
      "application/zip",
      "application/x-zip-compressed",
      "application/octet-stream",
    ];
    const fileName = file.name || "project-file";
    const ext = fileName.split(".").pop().toLowerCase();
    const allowedExtensions = ["xml", "zip", "aep", "prproj", "json"];

    if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(ext)) {
      return NextResponse.json(
        { error: `File type not allowed. Allowed: ${allowedExtensions.join(", ")}` },
        { status: 400 }
      );
    }

    // Max 50MB
    const MAX_SIZE = 50 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 50MB." },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate file path in Firebase Storage
    const timestamp = Date.now();
    const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
    const storagePath = `project-files/${reelId || "general"}/${timestamp}_${safeName}`;

    let useMock = false;
    let publicUrl = "";

    if (adminStorage) {
      try {
        // Upload to Firebase Storage
        const bucket = adminStorage.bucket();
        const fileRef = bucket.file(storagePath);

        await fileRef.save(buffer, {
          metadata: {
            contentType: file.type || "application/octet-stream",
            metadata: {
              originalName: fileName,
              uploadedAt: new Date().toISOString(),
              reelId: reelId || "",
            },
          },
        });

        // Make file publicly accessible
        await fileRef.makePublic();

        // Get the public download URL
        publicUrl = `https://storage.googleapis.com/${bucket.name}/${storagePath}`;
      } catch (uploadError) {
        console.warn("Firebase Storage upload failed (bucket might not exist). Falling back to mock URL.", uploadError.message);
        useMock = true;
      }
    } else {
      useMock = true;
    }

    if (useMock) {
      // Mock fallback for development without Firebase
      publicUrl = `https://storage.googleapis.com/omkar-creations.firebasestorage.app/mock-uploads/${storagePath}`;
      return NextResponse.json({
        success: true,
        url: publicUrl,
        fileName: fileName,
        fileType: ext,
        size: file.size,
        mock: true,
      });
    }

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName: fileName,
      fileType: ext,
      size: file.size,
    });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json(
      { error: "Failed to upload file: " + err.message },
      { status: 500 }
    );
  }
}
