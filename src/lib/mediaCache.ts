import { prisma } from "@/lib/db";
import { unstable_cache } from "next/cache";

export const getLatestMediaPosts = unstable_cache(
  async () => {
    return await prisma.mediaPost.findMany({
      orderBy: { createdAt: "desc" },
      take: 3,
    });
  },
  ["latest-media-posts"],
  {
    revalidate: 300,
  }
);
