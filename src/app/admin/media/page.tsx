import { unstable_noStore } from "next/cache";
import { prisma } from "@/lib/db";
import { safeQuery } from "@/lib/safeDb";
import { MediaManager } from "@/components/admin/MediaManager";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

export default async function AdminMediaPage() {
  unstable_noStore();

  const posts = await safeQuery(
    () =>
      prisma.mediaPost.findMany({
        orderBy: { createdAt: "desc" },
      }),
    []
  );

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto">
      <MediaManager initialPosts={posts} />
    </div>
  );
}
