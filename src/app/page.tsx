import {
  HeroSection,
  ValuesSection,
  LatestNewsSection,
  CTASection,
} from "@/components/sections";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let posts: Awaited<ReturnType<typeof prisma.mediaPost.findMany>> = [];

  try {
    posts = await prisma.mediaPost.findMany({
      orderBy: { createdAt: "desc" },
      take: 3,
    });
  } catch (error) {
    console.error("Failed to load media posts:", error);
    posts = [];
  }

  return (
    <div className="overflow-x-hidden">
      <HeroSection variant="home" />
      <ValuesSection />
      <LatestNewsSection posts={posts} />
      <CTASection />
    </div>
  );
}
