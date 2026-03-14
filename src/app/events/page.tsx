import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";
import { safeQuery } from "@/lib/safeDb";
import { formatEventDateShort } from "@/lib/formatDate";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Campaign Events | Ogun State 2027",
  description:
    "Upcoming campaign events, rallies, town halls, and community engagements.",
};

export const dynamic = "force-dynamic";

export default async function EventsPage() {
  const now = new Date();
  const events = await safeQuery(
    () =>
      prisma.campaignEvent.findMany({
        where: { date: { gte: now } },
        orderBy: { date: "asc" },
      }),
    []
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <header className="mb-10">
          <h1 className="section-title mb-2">Upcoming Campaign Events</h1>
          <p className="text-gray-600">
            Join us at rallies, town halls, and community engagements across
            Ogun State.
          </p>
        </header>

        {events.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
            <p className="text-gray-600 text-lg">
              No upcoming events at the moment. Check back soon.
            </p>
            <Link
              href="/get-involved"
              className="inline-block mt-6 text-campaign-green-600 font-semibold hover:text-campaign-green-700"
            >
              Get Involved →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {events.map((event) => (
              <article
                key={event.id}
                className="group bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
              >
                <Link href={`/events/${event.id}`} className="block">
                  <div className="aspect-video bg-gray-200 relative overflow-hidden">
                    {event.imageUrl ? (
                      <Image
                        src={event.imageUrl}
                        alt={event.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-campaign-green-100">
                        <span className="text-4xl text-campaign-green-600/50">
                          OTO
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h2 className="card-title mb-2 line-clamp-2 group-hover:text-campaign-green-700">
                      {event.title}
                    </h2>
                    <p className="text-sm text-gray-500 mb-1">
                      📅 {formatEventDateShort(event.date)}
                    </p>
                    <p className="text-sm text-gray-600">
                      📍 {event.location}
                    </p>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
