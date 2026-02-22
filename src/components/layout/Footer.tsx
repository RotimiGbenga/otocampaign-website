import Link from "next/link";
import { CAMPAIGN, CAMPAIGN_CONTACT, NAV_LINKS } from "@/lib/campaign";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-campaign-green-900 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-campaign-gold-500 text-campaign-green-900 font-display font-bold">
                O
              </div>
              <span className="font-display text-lg font-bold">
                {CAMPAIGN.name}
              </span>
            </div>
            <p className="text-campaign-green-200 text-sm">
              Building a better Ogun State. Join our movement for progress,
              unity, and prosperity.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-campaign-gold-400">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-campaign-green-200 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-campaign-gold-400">
              Campaign Headquarters
            </h3>
            <p className="text-campaign-green-200 text-sm space-y-1">
              <span className="block">{CAMPAIGN_CONTACT.address}</span>
              <a
                href={`mailto:${CAMPAIGN_CONTACT.email}`}
                className="block hover:text-white transition-colors"
              >
                {CAMPAIGN_CONTACT.email}
              </a>
              <span className="block mt-1 font-medium text-campaign-gold-300">
                Volunteer Hotlines:
              </span>
              {CAMPAIGN_CONTACT.hotlines.map((h) => (
                <a
                  key={h.number}
                  href={`tel:${h.number.replace(/\s/g, "")}`}
                  className="block hover:text-white transition-colors"
                >
                  {h.number} – {h.name}
                </a>
              ))}
            </p>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-campaign-green-800">
          <p className="text-center text-campaign-green-300 text-sm">
            © {currentYear} {CAMPAIGN.name}. {CAMPAIGN.state} {CAMPAIGN.year}. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
