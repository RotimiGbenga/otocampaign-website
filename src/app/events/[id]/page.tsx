import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { formatEventDate } from "@/lib/formatDate";
import type { Metadata } from "next";

export const revalidate = 60;

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const event = await prisma.campaignEvent.findUnique({ where: { id } });
  if (!event) return { title: "Event Not Found" };
  return {
    title: `${event.title} | Ogun State 2027 Campaign`,
    description: event.description.slice(0, 160),
  };
}

export default async function EventDetailPage({ params }: PageProps) {
  const { id } = await params;

  const event = await prisma.campaignEvent.findUnique({
    where: { id },
  });

  if (!event) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-6">
      <article className="mx-auto max-w-3xl">
        <Link
          href="/events"
          className="inline-flex items-center gap-1 text-campaign-green-600 hover:text-campaign-green-700 font-medium mb-8"
        >
          ← Back to Events
        </Link>

        <h1 className="text-3xl md:text-4xl font-bold text-green-800 mb-6">
          {event.title}
        </h1>

        <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-6">
          <p>
            <strong>Date & Time:</strong> {formatEventDate(event.date)}
          </p>
          <p>
            <strong>Location:</strong> {event.location}
          </p>
        </div>

        {event.imageUrl && (
          <div className="aspect-video relative rounded-xl overflow-hidden mb-8 bg-gray-200">
            <Image
              src={event.imageUrl}
              alt={event.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 672px"
            />
          </div>
        )}

        <div className="prose max-w-none text-gray-700 leading-relaxed">
          <div
            className="whitespace-pre-wrap"
            dangerouslySetInnerHTML={{
              __html: event.description
                .split("\n\n")
                .map((p) => `<p class="mb-4">${escapeHtml(p.replace(/\n/g, "<br />"))}</p>`)
                .join(""),
            }}
          />
        </div>
      </article>
    </div>
  );
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
