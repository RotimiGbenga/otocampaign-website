import {
  HeroSection,
  ValuesSection,
  CTASection,
} from "@/components/sections";

export default function HomePage() {
  return (
    <div className="overflow-x-hidden">
      <HeroSection variant="home" />
      <ValuesSection />
      <CTASection />
    </div>
  );
}
