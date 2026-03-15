import {
  HeroSection,
  ValuesSection,
  LatestNewsSection,
  UpcomingEventsSection,
  CTASection,
} from "@/components/sections";
import { getLatestMediaPosts } from "@/lib/mediaCache";
import { getCampaignStats } from "@/lib/campaignStats";
import { prisma } from "@/lib/db";
import { safeQuery } from "@/lib/safeDb";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const stats = await getCampaignStats();
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

      <section className="bg-green-700 text-white py-12">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-10">
            Campaign Momentum
          </h2>

          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold">{stats.volunteers}</p>
              <p className="mt-2 text-lg">Volunteers Joined</p>
            </div>

            <div>
              <p className="text-4xl font-bold">{stats.events}</p>
              <p className="mt-2 text-lg">Campaign Events</p>
            </div>

            <div>
              <p className="text-4xl font-bold">{stats.news}</p>
              <p className="mt-2 text-lg">Campaign Updates</p>
            </div>
          </div>
        </div>
      </section>

      <ValuesSection />
      <LatestNewsSection posts={posts} />
      <UpcomingEventsSection events={events} />
      <CTASection />
    </div>
  );
}
