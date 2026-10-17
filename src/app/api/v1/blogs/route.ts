import { NextRequest, NextResponse } from "next/server";
import { Store } from "@/lib/store";
import { BlogPost } from "@/lib/types";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const slug = url.searchParams.get("slug");
  if (slug) {
    const blog = Store.getBlogBySlug(slug);
    if (!blog) return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    return NextResponse.json(blog);
  }
  const blogs = Store.getBlogs();
  return NextResponse.json(blogs);
}

export async function POST(req: NextRequest) {
  try {
    const body: BlogPost = await req.json();
    if (!body.title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }
    if (!body.slug) {
      body.slug = body.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
    }
    const saved = Store.saveBlog(body);
    return NextResponse.json(saved, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
  const ok = Store.deleteBlog(id);
  return NextResponse.json({ success: ok });
}
