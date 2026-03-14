import { unstable_noStore } from "next/cache";
import { prisma } from "@/lib/db";
import { EventManager } from "@/components/admin/EventManager";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

export default async function AdminEventsPage() {
  unstable_noStore();

  let events: Awaited<ReturnType<typeof prisma.campaignEvent.findMany>> = [];

  try {
    events = await prisma.campaignEvent.findMany({
      orderBy: { date: "asc" },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[ADMIN] Events page DB error:", { message, err });
  }

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto">
      <EventManager initialEvents={events} />
    </div>
  );
}
