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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto py-10 px-6">
        <Link
          href="/media"
          className="inline-flex items-center gap-1 text-campaign-green-600 hover:text-campaign-green-700 font-medium mb-6"
        >
          ← Back to Media & News
        </Link>

        <Image
          src="/images/campaign-banner.jpeg"
          alt="Otunba Tunji Oredipe Campaign"
          width={900}
          height={500}
          className="rounded-lg mb-8"
          priority
        />

        <article>
          <h1 className="text-4xl font-bold text-green-800 mb-6">
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
                sizes="(max-width: 768px) 100vw, 672px"
              />
            </div>
          )}

          <div
            className="prose max-w-none leading-relaxed text-gray-800
              prose-p:mb-4 prose-p:leading-relaxed prose-p:text-gray-800
              prose-h2:text-2xl prose-h2:font-semibold prose-h2:mt-8 prose-h2:mb-4 prose-h2:text-green-700
              prose-blockquote:border-l-4 prose-blockquote:border-green-700 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:my-6 prose-blockquote:text-gray-700
              prose-a:text-campaign-green-600 prose-a:no-underline hover:prose-a:underline
              prose-strong:text-campaign-green-900
              prose-ul:list-disc prose-ul:pl-6 prose-ul:space-y-2 prose-ul:my-6"
            dangerouslySetInnerHTML={{ __html: formatContent(post.content) }}
          />
        </article>
      </div>
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
        `<h3 class="text-xl font-semibold mt-6 mb-2 text-green-700">${escapeHtml(trimmed)}</h3>`
      );
      i++;
      continue;
    }

    // Quote block: lines starting with ", smart quotes, or > (markdown blockquote)
    const isQuoted =
      /^["\u201C\u2018]/.test(trimmed) ||
      trimmed.startsWith(">") ||
      lines.every((l) => l.trim().startsWith(">"));
    if (isQuoted) {
      const quoteText = lines
        .map((l) => l.replace(/^[">]\s*/, "").replace(/^["\u201C\u2018]|["\u201D\u2019]$/g, "").trim())
        .filter(Boolean)
        .join(" ");
      if (quoteText) {
        parts.push(
          `<blockquote class="border-l-4 border-green-700 pl-4 italic my-6 text-gray-700">${escapeHtml(quoteText)}</blockquote>`
        );
      }
      i++;
      continue;
    }

    // Regular paragraph
    parts.push(
      `<p class="mb-4 leading-relaxed text-gray-800">${escapeHtml(trimmed.replace(/\n/g, "<br />"))}</p>`
    );
    i++;
  }

  return parts.join("");
}
