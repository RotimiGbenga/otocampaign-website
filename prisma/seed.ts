import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const DECLARATION_POST = {
  title:
    "Otunba Dr. Adetunji Oredipe to Officially Declare for Ogun State Governorship – March 31, 2026",
  summary:
    "Stakeholders, community leaders, and members of the public are invited to the official governorship declaration of Otunba Dr. Adetunji Oredipe at Legan Hall, Ijebu-Ode.",
  imageUrl: "/images/droredipe.png",
  content: `You are cordially invited to the official governorship declaration of Otunba Dr. Adetunji Oredipe for the 2027 Ogun State gubernatorial election.

Event Details

Date: Tuesday, March 31, 2026
Time: 10:00 AM
Venue: Legan Hall, Opposite Equity Hotel, Erunwon Highway, Ijebu-Ode, Ogun State

Stakeholders, community leaders, party faithful, and members of the public are invited to witness this historic moment as Otunba Dr. Adetunji Oredipe formally declares his intention to run for Governor of Ogun State on a platform of transparency, development, and shared prosperity.

Media Engagement

Members of the press and media houses are welcome to cover the event. A dedicated media desk will be available for accreditation and interviews. Please contact the campaign team for media access and arrangements.

Programme Highlights

• Arrival and accreditation
• National anthem and opening remarks
• Special addresses by dignitaries
• Official declaration by Otunba Dr. Adetunji Oredipe
• Unveiling of campaign vision and priorities
• Reception and photo opportunities

Join Us

This is a defining moment for Ogun State. Be part of a movement committed to building a better Ogun State — one rooted in accountability, economic growth, quality education, accessible healthcare, and security for all.

For enquiries, contact the campaign headquarters:
OTO Campaign HQ, Legan Hall, Opposite Equity Hotel, Erunwon Highway, Ijebu-Ode
Phone: +234 802 326 8296 / +234 805 412 8369
Email: info@otocampaign.com`,
};

async function main() {
  const existing = await prisma.mediaPost.findFirst({
    where: {
      title: {
        contains: "Officially Declare",
      },
    },
  });

  if (existing) {
    console.log("Declaration post already exists. Skipping seed.");
    return;
  }

  const post = await prisma.mediaPost.create({
    data: DECLARATION_POST,
  });

  console.log("Created declaration media post:", post.id);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
