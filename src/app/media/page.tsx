import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";
import { safeQuery } from "@/lib/safeDb";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Media & News | Ogun State 2027 Campaign",
  description: "Latest campaign updates, press releases, and news from the OTO Campaign.",
};

export const dynamic = "force-dynamic";

export default async function MediaPage() {
  const posts = await safeQuery(
    () =>
      prisma.mediaPost.findMany({
        orderBy: { createdAt: "desc" },
      }),
    []
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <header className="mb-10">
          <h1 className="section-title mb-2">Campaign News</h1>
          <p className="text-gray-600">
            Stay informed with the latest announcements and press releases.
          </p>
        </header>

        {posts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
            <p className="text-gray-600 text-lg">
              No news or updates have been published yet. Check back soon.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {posts.map((post) => (
              <article
                key={post.id}
                className="group bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg transition-shadow flex flex-col"
              >
                <Link href={`/media/${post.id}`} className="flex flex-col flex-1">
                  <div className="aspect-video bg-gray-200 relative overflow-hidden">
                    {post.imageUrl ? (
                      <Image
                        src={post.imageUrl}
                        alt={post.title}
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
                  <div className="p-6 flex flex-col flex-1">
                    <h2 className="card-title mb-2 line-clamp-2 group-hover:text-campaign-green-700">
                      {post.title}
                    </h2>
                    <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-1">
                      {post.summary}
                    </p>
                    <span className="inline-flex items-center justify-center gap-1 w-fit px-4 py-2 text-sm font-semibold text-campaign-green-700 bg-campaign-green-50 rounded-lg border border-campaign-green-200 group-hover:bg-campaign-green-100 group-hover:gap-2 transition-all">
                      Read More →
                    </span>
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
