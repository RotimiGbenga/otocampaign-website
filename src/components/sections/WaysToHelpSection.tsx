import { WAYS_TO_HELP } from "@/lib/campaign";

export function WaysToHelpSection() {
  return (
    <section className="py-16 bg-campaign-green-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="section-title text-center mb-12">Ways You Can Help</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {WAYS_TO_HELP.map((item) => (
            <div
              key={item.title}
              className="p-6 bg-white rounded-xl shadow-sm border border-campaign-green-100"
            >
              <h3 className="font-display font-bold text-campaign-green-900 mb-2">
                {item.title}
              </h3>
              <p className="text-gray-600 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
