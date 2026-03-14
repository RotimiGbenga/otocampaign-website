import { unstable_noStore } from "next/cache";
import { prisma } from "@/lib/db";
import { MediaManager } from "@/components/admin/MediaManager";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

export default async function AdminMediaPage() {
  unstable_noStore();

  let posts: Awaited<ReturnType<typeof prisma.mediaPost.findMany>> = [];

  try {
    posts = await prisma.mediaPost.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[ADMIN] Media page DB error:", { message, err });
  }

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto">
      <MediaManager initialPosts={posts} />
    </div>
  );
}
