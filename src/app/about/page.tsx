import {
  HeroSection,
  BioSection,
  PrioritiesSection,
} from "@/components/sections";

export default function AboutPage() {
  return (
    <div className="overflow-x-hidden">
      <HeroSection
        variant="page"
        title="About the Candidate"
        subtitle="Otunba Dr. Adetunji Oredipe – distinguished leadership for Ogun State"
      />
      <BioSection />
      <PrioritiesSection />
    </div>
  );
}
