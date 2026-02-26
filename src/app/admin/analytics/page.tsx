import { unstable_noStore } from "next/cache";
import { prisma } from "@/lib/db";
import { AnalyticsCharts } from "./AnalyticsCharts";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function buildGrowthTrendData(
  volunteers: { createdAt: Date }[],
  daysBack: number
): { date: string; count: number; displayDate: string }[] {
  const now = new Date();
  const start = new Date(now);
  start.setDate(start.getDate() - daysBack);
  start.setHours(0, 0, 0, 0);

  const map = new Map<string, number>();
  for (let i = 0; i <= daysBack; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    const key = d.toISOString().slice(0, 10);
    map.set(key, 0);
  }

  for (const v of volunteers) {
    const d = new Date(v.createdAt);
    if (d >= start) {
      const key = d.toISOString().slice(0, 10);
      const cur = map.get(key) ?? 0;
      map.set(key, cur + 1);
    }
  }

  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => ({
      date,
      count,
      displayDate: new Date(date + "T12:00:00").toLocaleDateString("en-NG", {
        month: "short",
        day: "numeric",
      }),
    }));
}

function parseSkillsAndAvailability(
  volunteers: { message: string | null }[]
): { skills: Record<string, number>; availability: Record<string, number> } {
  const skills: Record<string, number> = {};
  const availability: Record<string, number> = {};
  let weekdayCount = 0;
  let weekendCount = 0;

  const weekdayKeywords = [
    "Weekday Mornings",
    "Weekday Afternoons",
    "Weekday Evenings",
  ];

  for (const v of volunteers) {
    const msg = v.message ?? "";
    if (msg.includes("Skills:")) {
      const skillsMatch = msg.match(/Skills:\s*([^|]+)/);
      if (skillsMatch) {
        const list = skillsMatch[1]
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
        for (const s of list) {
          skills[s] = (skills[s] ?? 0) + 1;
        }
      }
    }
    if (msg.includes("Availability:")) {
      const availMatch = msg.match(/Availability:\s*([^|]+)/);
      if (availMatch) {
        const list = availMatch[1]
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
        for (const a of list) {
          if (weekdayKeywords.includes(a)) weekdayCount += 1;
          else if (a === "Weekends") weekendCount += 1;
        }
      }
    }
  }

  if (weekdayCount > 0 || weekendCount > 0) {
    availability["Weekday"] = weekdayCount;
    availability["Weekend"] = weekendCount;
  }

  return { skills, availability };
}

export default async function AdminAnalyticsPage() {
  unstable_noStore();

  let volunteersByLga: { lga: string; count: number }[] = [];
  let skillsData: { name: string; value: number }[] = [];
  let availabilityData: { name: string; value: number }[] = [];
  let growthData: { date: string; count: number; displayDate: string }[] = [];

  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    thirtyDaysAgo.setHours(0, 0, 0, 0);

    const [lgaStats, volunteers, recentVolunteers] = await Promise.all([
      prisma.volunteer.groupBy({
        by: ["lga"],
        _count: { id: true },
        orderBy: { _count: { id: "desc" } },
      }),
      prisma.volunteer.findMany({
        select: { message: true },
      }),
      prisma.volunteer.findMany({
        where: { createdAt: { gte: thirtyDaysAgo } },
        select: { createdAt: true },
      }),
    ]);

    volunteersByLga = lgaStats.map((s) => ({
      lga: s.lga,
      count: s._count.id,
    }));

    const { skills, availability } = parseSkillsAndAvailability(volunteers);

    skillsData = Object.entries(skills)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 12);

    availabilityData = Object.entries(availability)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    growthData = buildGrowthTrendData(recentVolunteers, 30);
  } catch (err: unknown) {
    const code =
      err && typeof err === "object" && "code" in err
        ? (err as { code?: string }).code
        : undefined;
    const message = err instanceof Error ? err.message : String(err);
    console.error("[ADMIN] Analytics DB error:", { code, message, err });
  }

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-green-800">
          Campaign Intelligence
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Real-time campaign intelligence for strategic decision making
        </p>
      </div>

      <AnalyticsCharts
        lgaData={volunteersByLga}
        skillsData={skillsData}
        availabilityData={availabilityData}
        growthData={growthData}
      />
    </div>
  );
}
