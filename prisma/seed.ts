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

const VISION_ARTICLE = {
  title: "OTO Campaign Unveils Vision for Monumental Development in Ogun State",
  summary:
    "The OTO Campaign Organization has unveiled its Vision for Monumental Development, outlining the key policy priorities of Otunba Dr. Adetunji Tunji Oredipe ahead of the 2027 Ogun State gubernatorial election.",
  imageUrl: "/images/campaign-banner.jpeg",
  content: `OTO Campaign Unveils Vision for Monumental Development in Ogun State

The OTO Campaign Organization has officially unveiled its Vision for Monumental Development, a strategic framework outlining the priorities and policy direction of Otunba Dr. Adetunji "Tunji" Oredipe as he prepares to contest the 2027 Ogun State gubernatorial election.

The vision presents a roadmap aimed at accelerating economic growth, strengthening social development, and ensuring both urban and rural communities benefit from sustainable progress.

Key Pillars of the Vision

Economic Growth and Job Creation
The campaign prioritizes a diversified economy that promotes investment, entrepreneurship, and industrial growth.

Agricultural Transformation
Mechanization, improved farmer financing, and agro-processing zones will boost food production and value chains.

Quality Education
Improving school infrastructure, training teachers, and integrating technology into education.

Healthcare Development
Strengthening primary healthcare systems and expanding health insurance coverage.

Infrastructure and Urban Renewal
Developing durable roads, reliable water supply, electricity improvements, and modern urban infrastructure.

Security and Public Safety
Collaboration with security agencies and community policing to protect citizens and investors.`,
};

const DECLARATION_EVENT = {
  title: "Official Governorship Declaration of Otunba Dr. Adetunji Oredipe",
  description: `You are cordially invited to the official governorship declaration of Otunba Dr. Adetunji Oredipe for the 2027 Ogun State gubernatorial election.

Stakeholders, community leaders, party faithful, and members of the public are invited to witness this historic moment.

Programme Highlights:
• Arrival and accreditation
• Opening remarks
• Special addresses by dignitaries
• Official declaration speech
• Unveiling of campaign vision
• Reception and photo opportunities`,
  location:
    "Legan Hall, Opposite Equity Hotel, Erunwon Highway, Ijebu-Ode, Ogun State",
  date: new Date("2026-03-31T10:00:00"),
  imageUrl: "/images/campaign-banner.jpeg",
};

async function main() {
  const declarationExists = await prisma.mediaPost.findFirst({
    where: { title: { contains: "Officially Declare" } },
  });
  if (!declarationExists) {
    const post = await prisma.mediaPost.create({ data: DECLARATION_POST });
    console.log("Created declaration media post:", post.id);
  } else {
    console.log("Declaration post already exists. Skipping.");
  }

  const visionExists = await prisma.mediaPost.findFirst({
    where: { title: { contains: "Vision for Monumental Development" } },
  });
  if (!visionExists) {
    const post = await prisma.mediaPost.create({ data: VISION_ARTICLE });
    console.log("Created vision article:", post.id);
  } else {
    await prisma.mediaPost.update({
      where: { id: visionExists.id },
      data: {
        title: VISION_ARTICLE.title,
        summary: VISION_ARTICLE.summary,
        content: VISION_ARTICLE.content,
        imageUrl: VISION_ARTICLE.imageUrl,
      },
    });
    console.log("Updated vision article with campaign banner:", visionExists.id);
  }

  const declarationEventExists = await prisma.campaignEvent.findFirst({
    where: { title: { contains: "Official Governorship Declaration" } },
  });
  if (!declarationEventExists) {
    const event = await prisma.campaignEvent.create({
      data: DECLARATION_EVENT,
    });
    console.log("Created declaration event:", event.id);
  } else {
    await prisma.campaignEvent.update({
      where: { id: declarationEventExists.id },
      data: DECLARATION_EVENT,
    });
    console.log("Updated declaration event:", declarationEventExists.id);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
