import { VISION_ITEMS } from "@/lib/campaign";

export function ValuesSection() {
  return (
    <section
      className="py-16 sm:py-20 md:py-24 lg:py-32 bg-white"
      aria-labelledby="vision-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-12 sm:mb-16 md:mb-20">
          <p className="text-campaign-green-600 font-semibold text-sm uppercase tracking-wider mb-4">
            Our Blueprint
          </p>
          <h2
            id="vision-heading"
            className="section-title text-center mb-6 sm:mb-8"
          >
            Vision – Our Vision for Ogun State
          </h2>
          <p className="section-subtitle mx-auto text-center">
            A comprehensive blueprint for monumental development, shared
            prosperity, and a secure future for every indigene and resident of
            our great state.
          </p>
        </header>

        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
          {VISION_ITEMS.map((item, i) => (
            <article
              key={item.title}
              className="group p-6 sm:p-8 rounded-2xl bg-campaign-green-50/80 border border-campaign-green-100 hover:shadow-xl hover:border-campaign-green-200 transition-all duration-300"
            >
              <span
                className="inline-flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-campaign-green-600 text-white font-bold text-base sm:text-lg mb-5 sm:mb-6"
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
