import Image from "next/image";
import { CAMPAIGN } from "@/lib/campaign";

export function BioSection() {
  return (
    <section
      className="py-16 sm:py-20 md:py-24 lg:py-32 bg-white"
      aria-labelledby="candidate-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-12 lg:gap-20 xl:gap-24 items-center">
          {/* Candidate Image */}
          <div className="order-2 lg:order-1 relative aspect-[4/5] min-h-[320px] sm:min-h-[400px] rounded-2xl overflow-hidden shadow-2xl bg-campaign-green-100 ring-2 ring-campaign-green-100">
            <Image
              src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&q=80"
              alt="Otunba Dr. Adetunji Oredipe - Candidate for Ogun State Governor"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-campaign-green-900/70 via-campaign-green-900/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 text-white">
              <p className="font-display text-xl sm:text-2xl font-bold">
                Otunba Dr. Adetunji Oredipe
              </p>
              <p className="text-white/90 text-sm sm:text-base mt-1">
                Candidate for Governor, {CAMPAIGN.state} {CAMPAIGN.year}
              </p>
            </div>
          </div>

          {/* Biography Content */}
          <div className="order-1 lg:order-2 space-y-6 sm:space-y-8">
            <header>
              <p className="text-campaign-green-600 font-semibold text-sm uppercase tracking-wider mb-3">
                The Candidate
              </p>
              <h2
                id="candidate-heading"
                className="section-title text-2xl sm:text-3xl md:text-4xl"
              >
                Otunba Dr. Adetunji Oredipe
              </h2>
            </header>

            <div className="space-y-5 sm:space-y-6">
              <p className="section-lead text-gray-600">
                Otunba Dr. Adetunji Oredipe is a distinguished leader whose
                reputation is built on sincerity, humility, integrity, and an
                unwavering commitment to public service. With decades of
                professional experience and deep-rooted engagement in community
                development, he represents the visionary leadership {CAMPAIGN.state}{" "}
                needs at this critical time.
              </p>
              <p className="section-lead text-gray-600">
                Dr. Oredipe&apos;s journey reflects dedication to service,
                accountability, and inclusive governance. His leadership
                philosophy is centered on monumental development that bridges
                the gap between urban advancement and rural prosperity, ensuring
                that no community is left behind.
              </p>
              <p className="section-lead text-gray-600">
                He envisions a progressive {CAMPAIGN.state} where economic
                opportunities thrive, infrastructure is modern and sustainable,
                education is globally competitive, and every citizen has the
                opportunity to reach their full potential in a safe and enabling
                environment.
              </p>
            </div>

            <blockquote className="mt-10 sm:mt-12 p-6 sm:p-8 rounded-2xl bg-campaign-green-50 border-l-4 border-campaign-gold-500 border border-campaign-green-100">
              <h3 className="font-display font-bold text-campaign-green-900 text-base sm:text-lg mb-2">
                Campaign Slogan
              </h3>
              <p className="text-campaign-green-800 text-xl sm:text-2xl italic leading-relaxed">
                &ldquo;{CAMPAIGN.slogan}&rdquo;
              </p>
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  );
}
