import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Supported image extensions and mimes
const ALLOWED_EXTS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif"]);

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";
    const uploadDir = path.join(process.cwd(), "public", "uploads", "resorts");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const savedUrls: string[] = [];

    // Case 1: multipart/form-data
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const files = formData.getAll("files") as File[];
      const singleFile = formData.get("file") as File | null;
      const allFiles = files.length > 0 ? files : singleFile ? [singleFile] : [];

      if (allFiles.length === 0) {
        return NextResponse.json({ error: "No files provided" }, { status: 400 });
      }

      for (const file of allFiles) {
        if (!file || typeof file.arrayBuffer !== "function") continue;
        const origExt = path.extname(file.name || "image.jpg").toLowerCase() || ".jpg";
        const ext = ALLOWED_EXTS.has(origExt) ? origExt : ".jpg";
        const cleanBase = (file.name || "photo").replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 30);
        const fileName = `resort-${Date.now()}-${Math.floor(Math.random() * 10000)}-${cleanBase}${ext}`;
        const filePath = path.join(uploadDir, fileName);

        const buffer = Buffer.from(await file.arrayBuffer());
        fs.writeFileSync(filePath, buffer);
        savedUrls.push(`/uploads/resorts/${fileName}`);
      }
    } 
    // Case 2: application/json (Base64 data URL convert to physical file on disk)
    else if (contentType.includes("application/json")) {
      const body = await req.json();
      const items = Array.isArray(body.items) ? body.items : [body];

      for (const item of items) {
        const dataUrl = item.dataUrl || item.base64;
        if (!dataUrl || typeof dataUrl !== "string") continue;

        // Parse data:image/xxx;base64,...
        const match = dataUrl.match(/^data:image\/([a-zA-Z0-9+.-]+);base64,(.+)$/);
        let ext = ".jpg";
        let base64Data = dataUrl;

        if (match) {
          const type = match[1].toLowerCase();
          ext = type === "jpeg" ? ".jpg" : `.${type}`;
          base64Data = match[2];
        }

        const cleanBase = (item.name || "photo").replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 30);
        const fileName = `resort-${Date.now()}-${Math.floor(Math.random() * 10000)}-${cleanBase}${ext}`;
        const filePath = path.join(uploadDir, fileName);

        const buffer = Buffer.from(base64Data, "base64");
        fs.writeFileSync(filePath, buffer);
        savedUrls.push(`/uploads/resorts/${fileName}`);
      }
    } else {
      return NextResponse.json({ error: "Unsupported content type" }, { status: 400 });
    }

    if (savedUrls.length === 0) {
      return NextResponse.json({ error: "No valid image files were uploaded" }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      url: savedUrls[0],
      urls: savedUrls
    }, { status: 201 });

  } catch (err: any) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: err.message || "Upload failed" }, { status: 500 });
  }
}
