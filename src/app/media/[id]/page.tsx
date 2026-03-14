import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { safeQuery } from "@/lib/safeDb";
import { formatMediaDate } from "@/lib/formatDate";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const post = await safeQuery(
    () => prisma.mediaPost.findUnique({ where: { id } }),
    null
  );
  if (!post) return { title: "Post Not Found" };
  return {
    title: `${post.title} | Ogun State 2027 Campaign`,
    description: post.summary,
  };
}

export default async function MediaDetailPage({ params }: PageProps) {
  const { id } = await params;

  const post = await safeQuery(
    () => prisma.mediaPost.findUnique({ where: { id } }),
    null
  );

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-6">
      <article className="mx-auto max-w-3xl">
        <Link
          href="/media"
          className="inline-flex items-center gap-1 text-campaign-green-600 hover:text-campaign-green-700 font-medium mb-8"
        >
          ← Back to Media & News
        </Link>

        <h1 className="text-3xl md:text-4xl font-bold text-green-800 mb-6">
          {post.title}
        </h1>

        <p className="text-gray-500 text-sm mb-8">
          Published: {formatMediaDate(post.createdAt)}
        </p>

        {post.imageUrl && (
          <div className="aspect-video relative rounded-xl overflow-hidden mb-8 bg-gray-200">
            <Image
              src={post.imageUrl}
              alt={post.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 672px"
            />
          </div>
        )}

        <div
          className="prose max-w-3xl mx-auto leading-relaxed text-gray-800
            prose-p:text-gray-700 prose-p:leading-relaxed
            prose-headings:text-campaign-green-900
            prose-a:text-campaign-green-600 prose-a:no-underline hover:prose-a:underline
            prose-strong:text-campaign-green-900
            prose-ul:list-disc prose-ul:pl-6 prose-ul:space-y-2"
          dangerouslySetInnerHTML={{ __html: formatContent(post.content) }}
        />
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

function formatContent(content: string): string {
  const blocks = content.split(/\n\n+/);
  const parts: string[] = [];
  let i = 0;

  while (i < blocks.length) {
    const block = blocks[i];
    const trimmed = block.trim();
    if (!trimmed) {
      i++;
      continue;
    }

    const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);

    // Event details block: contains Date:, Time:, Venue:
    if (
      trimmed.includes("Date:") &&
      (trimmed.includes("Time:") || trimmed.includes("Venue:"))
    ) {
      const dateMatch = trimmed.match(/Date:\s*([\s\S]+?)(?=\n|$)/);
      const timeMatch = trimmed.match(/Time:\s*([\s\S]+?)(?=\n|$)/);
      const venueMatch = trimmed.match(/Venue:\s*([\s\S]+?)(?=\n|$)/);
      parts.push(
        `<div class="bg-gray-100 p-4 rounded-lg my-6">` +
          `<p><strong>Date:</strong> ${escapeHtml(dateMatch?.[1]?.trim() ?? "")}</p>` +
          (timeMatch ? `<p><strong>Time:</strong> ${escapeHtml(timeMatch[1].trim())}</p>` : "") +
          (venueMatch ? `<p><strong>Venue:</strong> ${escapeHtml(venueMatch[1].trim())}</p>` : "") +
          `</div>`
      );
      i++;
      continue;
    }

    // Bullet list: lines starting with •
    const bulletLines = lines.filter((l) => l.startsWith("•") || l.startsWith("*"));
    if (bulletLines.length === lines.length && bulletLines.length > 0) {
      const items = bulletLines
        .map((l) => `<li>${escapeHtml(l.replace(/^[•*]\s*/, ""))}</li>`)
        .join("\n");
      parts.push(`<ul class="list-disc pl-6 space-y-2 my-6">${items}</ul>`);
      i++;
      continue;
    }

    // Contact section: OTO Campaign HQ, Phone, Email
    if (
      (trimmed.includes("OTO Campaign HQ") || trimmed.includes("campaign headquarters")) &&
      (trimmed.includes("Phone:") || trimmed.includes("Email:"))
    ) {
      const contactLines = trimmed.split("\n").filter((l) => l.trim());
      const contactHtml = contactLines
        .map((line) => {
          const l = line.trim();
          if (!l || l.toLowerCase().startsWith("for enquiries")) return "";
          const escaped = escapeHtml(l);
          if (l.startsWith("OTO Campaign HQ")) {
            return `<p><strong>${escaped}</strong></p>`;
          }
          if (l.startsWith("Phone:")) {
            return `<p class="mt-2">${escaped}</p>`;
          }
          return `<p>${escaped}</p>`;
        })
        .filter(Boolean)
        .join("");
      if (contactHtml) {
        parts.push(
          `<div class="mt-10 border-t pt-6 text-sm text-gray-600">${contactHtml}</div>`
        );
      }
      i++;
      continue;
    }

    // Section heading (h2): single line, 2–80 chars, title-like
    if (
      lines.length === 1 &&
      trimmed.length >= 2 &&
      trimmed.length <= 80 &&
      !trimmed.startsWith("•") &&
      !trimmed.startsWith("*") &&
      !trimmed.startsWith('"')
    ) {
      const nextBlock = blocks[i + 1]?.trim() ?? "";
      const nextIsList = nextBlock.split("\n").every((l) =>
        l.trim().startsWith("•") || l.trim().startsWith("*")
      );
      const nextIsEvent = nextBlock.includes("Date:") && nextBlock.includes("Time:");
      const nextIsShort = nextBlock.length <= 100;
      if (
        nextIsList ||
        nextIsEvent ||
        nextIsShort ||
        /^(Event|Media|Programme|Join|Key|Inclusive|Building)/i.test(trimmed)
      ) {
        parts.push(
          `<h2 class="text-2xl font-semibold mt-8 mb-4 text-green-700">${escapeHtml(trimmed)}</h2>`
        );
        i++;
        continue;
      }
    }

    // Subsection heading (h3): single line within a section (e.g. pillar names)
    if (
      lines.length === 1 &&
      trimmed.length >= 3 &&
      trimmed.length <= 60 &&
      !trimmed.startsWith("•") &&
      !trimmed.startsWith('"') &&
      /^(Economic|Agricultural|Quality|Healthcare|Infrastructure|Security|Data|Transport|Phone|Canvassing|Social)/i.test(
        trimmed
      )
    ) {
      parts.push(
        `<h3 class="text-xl font-semibold mt-6 mb-2">${escapeHtml(trimmed)}</h3>`
      );
      i++;
      continue;
    }

    // Regular paragraph
    parts.push(
      `<p class="mb-4">${escapeHtml(trimmed.replace(/\n/g, "<br />"))}</p>`
    );
    i++;
  }

  return parts.join("");
}
