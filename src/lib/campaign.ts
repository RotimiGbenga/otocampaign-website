/**
 * Campaign content and configuration.
 * Centralize copy and data for easy updates and scalability.
 */

export const CAMPAIGN = {
  name: "OTO Campaign",
  slogan: "Building a Better Ogun State",
  year: "2027",
  state: "Ogun State",
} as const;

export const CAMPAIGN_CONTACT = {
  address:
    "OTO Campaign HQ, Legan Hall, Opposite Equity Hotel, Erunwon Highway, Ijebu-Ode, Ogun State, Nigeria",
  email: "info@otocampaign.com",
  hotlines: [
    { number: "+234 802 326 8296", name: "Rotimi" },
    { number: "+234 805 412 8369", name: "Kayode" },
  ],
} as const;

export const OGUN_STATE_LGAS = [
  "Abeokuta North",
  "Abeokuta South",
  "Ado-Odo/Ota",
  "Ewekoro",
  "Ifo",
  "Ijebu East",
  "Ijebu North",
  "Ijebu North East",
  "Ijebu Ode",
  "Ikenne",
  "Imeko-Afon",
  "Ipokia",
  "Obafemi Owode",
  "Odeda",
  "Odogbolu",
  "Ogun Waterside",
  "Remo North",
  "Sagamu",
  "Yewa North",
  "Yewa South",
] as const;

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/get-involved", label: "Get Involved" },
  { href: "/contact", label: "Contact" },
] as const;

export const VISION_ITEMS = [
  {
    title: "Economic Prosperity & Job Creation",
    description:
      "To transform Ogun State into a leading investment hub by creating a business-friendly environment, supporting SMEs, and investing in technology and innovation to generate sustainable employment opportunities for our youth and skilled workforce.",
  },
  {
    title: "Agricultural Revolution",
    description:
      "We will leverage Ogun State's vast agricultural potential by mechanizing farming, providing farmers with access to credit, modern inputs, and extension services, and establishing agro-processing and food value chain zones to boost productivity and ensure food security.",
  },
  {
    title: "Quality Education for All",
    description:
      "Our administration will revitalize the education sector through school renovation, teacher retraining, curriculum modernization, and the integration of digital learning tools. Every child in Ogun State will have access to quality, affordable, and future-ready education.",
  },
  {
    title: "Accessible & Affordable Healthcare",
    description:
      "We will strengthen primary healthcare delivery, equip hospitals with modern medical facilities, and expand health insurance coverage so that every citizen, regardless of status or location, can access quality and affordable healthcare services.",
  },
  {
    title: "Infrastructural Development",
    description:
      "We will embark on strategic urban and rural infrastructural renewal by constructing durable roads, improving water supply, enhancing power infrastructure, and developing transport systems that stimulate economic growth and improve quality of life.",
  },
  {
    title: "Security of Lives & Property",
    description:
      "We will enhance the effectiveness of security agencies through technology-driven surveillance, training, intelligence collaboration, and community policing initiatives to ensure a safe and secure Ogun State for residents, investors, and businesses.",
  },
] as const;

export const CORE_PRINCIPLES = [
  {
    title: "Proven Leadership",
    description:
      "Decades of experience in public service, finance, and strategic development with a strong record of delivering impactful and measurable results.",
  },
  {
    title: "Economic Prosperity",
    description:
      "A well-structured economic agenda focused on job creation, industrial growth, SME empowerment, and attracting local and international investment into Ogun State.",
  },
  {
    title: "Community First",
    description:
      "A people-centered governance approach that prioritizes the needs of communities across all local governments, from urban centers to rural settlements.",
  },
  {
    title: "A Secure Future",
    description:
      "A firm commitment to the protection of lives and property through modern security strategies, community engagement, and institutional collaboration.",
  },
] as const;

export const PRIORITIES = CORE_PRINCIPLES.map((p) => p.title);

export const WAYS_TO_HELP = [
  { title: "Canvassing", desc: "Door-to-door outreach in your community" },
  { title: "Phone Banking", desc: "Reach voters by phone from anywhere" },
  { title: "Events", desc: "Help organize and staff campaign events" },
  { title: "Social Media", desc: "Spread the message online" },
] as const;
