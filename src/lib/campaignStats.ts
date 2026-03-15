import { prisma } from "@/lib/db";

export async function getCampaignStats() {
  try {
    const volunteers = await prisma.volunteer.count();
    const events = await prisma.campaignEvent.count();
    const news = await prisma.mediaPost.count();

    return {
      volunteers,
      events,
      news,
    };
  } catch (error) {
    console.error("Failed to load campaign stats:", error);

    return {
      volunteers: 0,
      events: 0,
      news: 0,
    };
  }
}
