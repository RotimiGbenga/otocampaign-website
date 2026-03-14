import {
  HeroSection,
  ValuesSection,
  LatestNewsSection,
  UpcomingEventsSection,
  CTASection,
} from "@/components/sections";
import { getLatestMediaPosts } from "@/lib/mediaCache";
import { prisma } from "@/lib/db";
import { safeQuery } from "@/lib/safeDb";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const posts = await safeQuery(() => getLatestMediaPosts(), []);

  const now = new Date();
  const events = await safeQuery(
    () =>
      prisma.campaignEvent.findMany({
        where: { date: { gte: now } },
        orderBy: { date: "asc" },
        take: 2,
      }),
    []
  );

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
