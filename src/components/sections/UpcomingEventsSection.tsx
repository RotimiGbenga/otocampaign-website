import Link from "next/link";
import type { CampaignEvent } from "@prisma/client";
import { formatEventDateShort } from "@/lib/formatDate";

type UpcomingEventsSectionProps = {
  events: CampaignEvent[];
};

export function UpcomingEventsSection({ events }: UpcomingEventsSectionProps) {
  if (events.length === 0) {
    return (
      <section
        className="py-16 sm:py-20 bg-campaign-green-50"
        aria-labelledby="upcoming-events-heading"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2
            id="upcoming-events-heading"
            className="section-title mb-4"
          >
            Upcoming Campaign Events
          </h2>
          <p className="text-gray-500 text-sm">
            Campaign events will appear here soon.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      className="py-16 sm:py-20 bg-campaign-green-50"
      aria-labelledby="upcoming-events-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <p className="text-campaign-green-600 font-semibold text-sm uppercase tracking-wider mb-2">
              Get Involved
            </p>
            <h2
              id="upcoming-events-heading"
              className="section-title"
            >
              Upcoming Campaign Events
            </h2>
          </div>
          <Link
            href="/events"
            className="text-campaign-green-600 font-semibold hover:text-campaign-green-700 transition-colors shrink-0"
          >
            View All Events →
          </Link>
        </header>

        <ul className="space-y-4">
          {events.map((event) => (
            <li key={event.id}>
              <Link
                href={`/events/${event.id}`}
                className="block p-4 sm:p-5 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-campaign-green-200 transition-all"
              >
                <h3 className="card-title mb-2 group-hover:text-campaign-green-700">
                  {event.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {formatEventDateShort(event.date)} · {event.location}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
