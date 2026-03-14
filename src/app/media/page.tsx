import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";
import { formatMediaDate } from "@/lib/formatDate";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Media & News | Ogun State 2027 Campaign",
  description: "Latest campaign updates, press releases, and news from the OTO Campaign.",
};

export const revalidate = 60;

export default async function MediaPage() {
  const posts = await prisma.mediaPost.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-6">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="mb-12 text-center">
          <h1 className="section-title mb-4">Campaign News & Updates</h1>
          <p className="section-subtitle mx-auto">
            Stay informed with the latest announcements, press releases, and
            campaign updates.
          </p>
        </header>

        {posts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
            <p className="text-gray-600 text-lg">
              No news or updates have been published yet. Check back soon.
            </p>
          </div>
        ) : (
          <div className={`grid gap-6 sm:gap-8 ${posts.length >= 3 ? "sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1 sm:grid-cols-2"}`}>
            {posts.map((post) => (
              <article
                key={post.id}
                className="group bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
              >
                <Link href={`/media/${post.id}`} className="block">
                  <div className="aspect-video bg-gray-200 relative overflow-hidden">
                    {post.imageUrl ? (
                      <Image
                        src={post.imageUrl}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 100vw, 50vw"
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
                      {post.title}
                    </h2>
                    <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                      {post.summary}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatMediaDate(post.createdAt)}
                    </p>
                    <span className="inline-flex items-center gap-1 text-campaign-green-600 font-semibold text-sm mt-2 group-hover:gap-2 transition-all">
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
