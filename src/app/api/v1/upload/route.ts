import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Supported image extensions and mimes
const ALLOWED_EXTS = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".avif",
  ".gif",
  ".jfif",
  ".heic",
  ".heif",
  ".bmp",
  ".tiff",
  ".svg"
]);

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";
    const uploadDir = path.join(process.cwd(), "public", "uploads", "resorts");

    const savedUrls: string[] = [];

    // Case 1: multipart/form-data
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const files = formData.getAll("files") as (File | string)[];
      const singleFile = formData.get("file") as File | null;
      const allFiles = files.length > 0 ? files : singleFile ? [singleFile] : [];

      if (allFiles.length === 0) {
        return NextResponse.json({ error: "No files received in request" }, { status: 400 });
      }

      for (const item of allFiles) {
        if (!item || typeof item === "string" || typeof item.arrayBuffer !== "function") {
          continue;
        }

        const file = item as File;
        if (file.size === 0) {
          continue;
        }

        const origExt = path.extname(file.name || "image.jpg").toLowerCase() || ".jpg";
        const ext = ALLOWED_EXTS.has(origExt) ? origExt : ".jpg";
        const cleanBase = (file.name || "photo").replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 35);
        const fileName = `resort-${Date.now()}-${Math.floor(Math.random() * 10000)}-${cleanBase}${ext}`;

        const buffer = Buffer.from(await file.arrayBuffer());
        let savedOnDisk = false;

        // Attempt writing to public disk (writable on local dev / VPS)
        try {
          if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
          }
          const filePath = path.join(uploadDir, fileName);
          fs.writeFileSync(filePath, buffer);
          savedUrls.push(`/uploads/resorts/${fileName}`);
          savedOnDisk = true;
        } catch (fsErr: any) {
          // Vercel serverless / read-only filesystem (EROFS): fallback to permanent high-res data URL
          console.warn("Filesystem is read-only (Vercel serverless). Using data URL fallback:", fsErr?.message);
        }

        // Resilient Fallback: if server filesystem is read-only (Vercel), store as permanent Data URL directly into Supabase
        if (!savedOnDisk) {
          const mime = ext === ".png" ? "image/png" : ext === ".webp" ? "image/webp" : "image/jpeg";
          const dataUrl = `data:${mime};base64,${buffer.toString("base64")}`;
          savedUrls.push(dataUrl);
        }
      }
    } 
    // Case 2: application/json (Base64 data URL convert)
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

        const cleanBase = (item.name || "photo").replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 35);
        const fileName = `resort-${Date.now()}-${Math.floor(Math.random() * 10000)}-${cleanBase}${ext}`;

        let savedOnDisk = false;
        try {
          if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
          }
          const filePath = path.join(uploadDir, fileName);
          const buffer = Buffer.from(base64Data, "base64");
          fs.writeFileSync(filePath, buffer);
          savedUrls.push(`/uploads/resorts/${fileName}`);
          savedOnDisk = true;
        } catch (fsErr: any) {
          console.warn("Filesystem read-only. Retaining data URL:", fsErr?.message);
        }

        if (!savedOnDisk) {
          savedUrls.push(dataUrl);
        }
      }
    } else {
      return NextResponse.json({ error: "Unsupported content type: " + contentType }, { status: 400 });
    }

    if (savedUrls.length === 0) {
      return NextResponse.json({ error: "No valid image files were found to save" }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      url: savedUrls[0],
      urls: savedUrls
    }, { status: 201 });

  } catch (err: any) {
    console.error("Upload route error:", err);
    return NextResponse.json({ error: err.message || "Server error while saving uploaded photos" }, { status: 500 });
  }
}
