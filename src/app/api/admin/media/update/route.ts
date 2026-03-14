import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyAdminSession } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function PUT(request: NextRequest) {
  const isAuth = await verifyAdminSession();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, title, summary, content, imageUrl } = body;

    if (!id || typeof id !== "string" || !id.trim()) {
      return NextResponse.json(
        { error: "Post ID is required" },
        { status: 400 }
      );
    }
    if (!title || typeof title !== "string" || !title.trim()) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }
    if (!summary || typeof summary !== "string" || !summary.trim()) {
      return NextResponse.json(
        { error: "Summary is required" },
        { status: 400 }
      );
    }
    if (!content || typeof content !== "string" || !content.trim()) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    const post = await prisma.mediaPost.update({
      where: { id: id.trim() },
      data: {
        title: title.trim(),
        summary: summary.trim(),
        content: content.trim(),
        imageUrl:
          typeof imageUrl === "string" && imageUrl.trim()
            ? imageUrl.trim()
            : null,
      },
    });

    return NextResponse.json({ success: true, data: post });
  } catch (error: unknown) {
    const msg = error && typeof error === "object" && "code" in error
      ? (error as { code?: string }).code
      : null;
    if (msg === "P2025") {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    console.error("[ADMIN MEDIA] Update failed:", error);
    return NextResponse.json(
      { error: "Failed to update media post" },
      { status: 500 }
    );
  }
}
