import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";
import { formatMediaDate } from "@/lib/formatDate";

export const revalidate = 60;

export async function LatestNewsSection() {
  let posts: Awaited<ReturnType<typeof prisma.mediaPost.findMany>> = [];

  try {
    posts = await prisma.mediaPost.findMany({
      orderBy: { createdAt: "desc" },
      take: 3,
    });
  } catch (error) {
    console.error("Media posts could not be loaded:", error);
    posts = [];
  }

  if (posts.length === 0) {
    return null;
  }

  return (
    <section
      className="py-16 sm:py-20 bg-white"
      aria-labelledby="latest-news-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <p className="text-campaign-green-600 font-semibold text-sm uppercase tracking-wider mb-2">
              Campaign Updates
            </p>
            <h2
              id="latest-news-heading"
              className="section-title"
            >
              Latest Campaign News
            </h2>
          </div>
          <Link
            href="/media"
            className="text-campaign-green-600 font-semibold hover:text-campaign-green-700 transition-colors shrink-0"
          >
            View All News →
          </Link>
        </header>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
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
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-campaign-green-100">
                      <span className="text-4xl text-campaign-green-600/50">
                        OTO
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="card-title mb-2 line-clamp-2 group-hover:text-campaign-green-700">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-2 mb-3">
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
      </div>
    </section>
  );
}
