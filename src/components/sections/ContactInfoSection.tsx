import { CAMPAIGN_CONTACT } from "@/lib/campaign";

export function ContactInfoSection() {
  return (
    <div className="mt-12 grid sm:grid-cols-1 md:grid-cols-3 gap-6">
      <div className="p-6 rounded-xl bg-campaign-green-50 border border-campaign-green-100">
        <h3 className="font-display font-bold text-campaign-green-900 mb-2">
          Campaign Headquarters
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed">
          {CAMPAIGN_CONTACT.address}
        </p>
      </div>
      <div className="p-6 rounded-xl bg-campaign-green-50 border border-campaign-green-100">
        <h3 className="font-display font-bold text-campaign-green-900 mb-2">
          Email
        </h3>
        <a
          href={`mailto:${CAMPAIGN_CONTACT.email}`}
          className="text-campaign-green-600 hover:text-campaign-green-700 font-medium text-sm"
        >
          {CAMPAIGN_CONTACT.email}
        </a>
      </div>
      <div className="p-6 rounded-xl bg-campaign-green-50 border border-campaign-green-100">
        <h3 className="font-display font-bold text-campaign-green-900 mb-2">
          Volunteer Hotlines
        </h3>
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
  );
}
