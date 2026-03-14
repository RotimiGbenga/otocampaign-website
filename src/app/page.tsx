import {
  HeroSection,
  ValuesSection,
  LatestNewsSection,
  CTASection,
} from "@/components/sections";

export default function HomePage() {
  return (
    <div className="overflow-x-hidden">
      <HeroSection variant="home" />
      <ValuesSection />
      <LatestNewsSection />
      <CTASection />
    </div>
  );
}
