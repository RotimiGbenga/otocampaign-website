import type { Prisma } from "@prisma/client";

export type BroadcastFilters = {
  all?: boolean;
  lgas?: string[];
  skills?: string[];
  availability?: string[];
};

/**
 * Builds Prisma where clause for volunteer broadcast filters.
 * Message format: "Skills: X, Y | Availability: A, B"
 */
export function buildVolunteerWhereClause(
  filters: BroadcastFilters
): Prisma.VolunteerWhereInput {
  if (filters.all || (!filters.lgas?.length && !filters.skills?.length && !filters.availability?.length)) {
    return {};
  }

  const conditions: Prisma.VolunteerWhereInput[] = [];

  if (filters.lgas?.length) {
    conditions.push({ lga: { in: filters.lgas } });
  }

  if (filters.skills?.length) {
    conditions.push({
      OR: filters.skills.map((s) => ({
        message: { contains: s, mode: "insensitive" },
      })),
    });
  }

  if (filters.availability?.length) {
    conditions.push({
      OR: filters.availability.map((a) => ({
        message: { contains: a, mode: "insensitive" },
      })),
    });
  }

  return conditions.length === 1 ? conditions[0]! : { AND: conditions };
}
