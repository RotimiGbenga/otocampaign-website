import ContactForm from "@/components/forms/ContactForm";
import { CAMPAIGN_CONTACT } from "@/lib/campaign";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-campaign-green-800 mb-2">
          Contact the Campaign
        </h1>
        <p className="mb-10 text-lg text-gray-700">
          Reach out to the OTO Campaign Organization for enquiries,
          partnerships, and support.
        </p>

        {/* Campaign Headquarters Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-campaign-green-800 mb-6">
            Campaign Headquarters
          </h2>
          <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-white border border-campaign-green-100 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-campaign-green-100 text-campaign-green-600">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold text-campaign-green-900">Address</h3>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                {CAMPAIGN_CONTACT.address}
              </p>
            </div>
            <div className="p-6 rounded-xl bg-white border border-campaign-green-100 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-campaign-green-100 text-campaign-green-600">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold text-campaign-green-900">Email</h3>
              </div>
              <a
                href={`mailto:${CAMPAIGN_CONTACT.email}`}
                className="text-campaign-green-600 hover:text-campaign-green-700 font-medium text-sm"
              >
                {CAMPAIGN_CONTACT.email}
              </a>
            </div>
            <div className="p-6 rounded-xl bg-white border border-campaign-green-100 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-campaign-green-100 text-campaign-green-600">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold text-campaign-green-900">
                  Volunteer Hotlines
                </h3>
              </div>
              <div className="space-y-1 text-sm">
                {CAMPAIGN_CONTACT.hotlines.map((h) => (
                  <a
                    key={h.number}
                    href={`tel:${h.number.replace(/\s/g, "")}`}
                    className="block text-campaign-green-600 hover:text-campaign-green-700 font-medium"
                  >
                    {h.number} – {h.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <ContactForm />
      </div>
    </div>
  );
}
