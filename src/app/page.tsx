import {
  HeroSection,
  ValuesSection,
  LatestNewsSection,
  CTASection,
} from "@/components/sections";
import { getLatestMediaPosts } from "@/lib/mediaCache";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let posts: Awaited<ReturnType<typeof getLatestMediaPosts>> = [];

  try {
    posts = await getLatestMediaPosts();
  } catch (error) {
    console.error("Media posts could not be loaded:", error);
    posts = [];
  }

  return (
    <div className="overflow-x-hidden">
      <HeroSection variant="home" />
      <ValuesSection />
      <LatestNewsSection posts={posts} />
      <CTASection />
    </div>
  );
}
