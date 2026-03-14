import { unstable_noStore } from "next/cache";
import { prisma } from "@/lib/db";
import { safeQuery } from "@/lib/safeDb";
import { EventManager } from "@/components/admin/EventManager";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

export default async function AdminEventsPage() {
  unstable_noStore();

  const events = await safeQuery(
    () =>
      prisma.campaignEvent.findMany({
        orderBy: { date: "asc" },
      }),
    []
  );

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto">
      <EventManager initialEvents={events} />
    </div>
  );
}
