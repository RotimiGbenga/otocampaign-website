import { CORE_PRINCIPLES } from "@/lib/campaign";

export function PrioritiesSection() {
  return (
    <section
      className="py-16 sm:py-20 md:py-24 lg:py-32 bg-campaign-green-50"
      aria-labelledby="principles-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-12 sm:mb-16 md:mb-20">
          <p className="text-campaign-green-600 font-semibold text-sm uppercase tracking-wider mb-4">
            Our Foundation
          </p>
          <h2
            id="principles-heading"
            className="section-title text-center"
          >
            Core Principles
          </h2>
        </header>

        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {CORE_PRINCIPLES.map((item, i) => (
            <article
              key={item.title}
              className="p-6 sm:p-8 bg-white rounded-2xl shadow-sm border border-campaign-green-100 hover:shadow-lg hover:border-campaign-green-200 transition-all duration-300"
            >
              <span
                className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-campaign-green-600 text-white font-bold text-sm sm:text-base mb-4 sm:mb-5"
                aria-hidden
              >
                {i + 1}
              </span>
              <h3 className="card-title mb-3 sm:mb-4">
                {item.title}
              </h3>
              <p className="section-lead text-sm sm:text-base text-gray-600">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
