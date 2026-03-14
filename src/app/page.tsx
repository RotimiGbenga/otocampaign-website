import {
  HeroSection,
  ValuesSection,
  LatestNewsSection,
  UpcomingEventsSection,
  CTASection,
} from "@/components/sections";
import { getLatestMediaPosts } from "@/lib/mediaCache";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let posts: Awaited<ReturnType<typeof getLatestMediaPosts>> = [];
  let events: Awaited<ReturnType<typeof prisma.campaignEvent.findMany>> = [];

  try {
    posts = await getLatestMediaPosts();
  } catch (error) {
    console.error("Media posts could not be loaded:", error);
    posts = [];
  }

  try {
    const now = new Date();
    events = await prisma.campaignEvent.findMany({
      where: { date: { gte: now } },
      orderBy: { date: "asc" },
      take: 2,
    });
  } catch (error) {
    console.error("Events could not be loaded:", error);
    events = [];
  }

  return (
    <div className="overflow-x-hidden">
      <HeroSection variant="home" />
      <ValuesSection />
      <LatestNewsSection posts={posts} />
      <UpcomingEventsSection events={events} />
      <CTASection />
    </div>
  );
}
