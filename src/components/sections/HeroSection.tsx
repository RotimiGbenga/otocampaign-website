import Link from "next/link";

type HeroSectionProps =
  | {
      variant: "home";
      title?: never;
      subtitle?: never;
    }
  | {
      variant: "page";
      title: string;
      subtitle: string;
    };

export function HeroSection(props: HeroSectionProps) {
  if (props.variant === "home") {
    return (
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-hero-gradient" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.03%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white/90 text-sm font-medium mb-8">
            <span className="w-2 h-2 rounded-full bg-campaign-gold-400 animate-pulse" />
            Ogun State 2027
          </div>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Building a Better
            <br />
            <span className="text-campaign-gold-300">Ogun State</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto mb-10">
            Join our movement for progress, unity, and prosperity. Together we
            can create lasting change for our people.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/get-involved" className="btn-gold">
              Get Involved
            </Link>
            <Link href="/about" className="btn-secondary !text-white !border-white hover:!bg-white/10">
              Learn More
            </Link>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
      </section>
    );
  }

  return (
    <section className="bg-hero-gradient py-16 sm:py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white">
          {props.title}
        </h1>
        <p className="text-white/90 mt-4 sm:mt-6 max-w-2xl mx-auto text-lg sm:text-xl">
          {props.subtitle}
        </p>
      </div>
    </section>
  );
}
