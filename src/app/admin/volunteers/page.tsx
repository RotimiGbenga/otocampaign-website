import { unstable_noStore } from "next/cache";
import Link from "next/link";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { OGUN_STATE_LGAS } from "@/lib/campaign";
import { Suspense } from "react";
import { VolunteersFilters } from "./VolunteersFilters";
import { ExportButton } from "@/components/admin/ExportButton";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const PAGE_SIZE = 20;

type PageProps = {
  searchParams: Promise<{ q?: string; lga?: string; page?: string }>;
};

export default async function AdminVolunteersPage({ searchParams }: PageProps) {
  unstable_noStore();

  const params = await searchParams;
  const search = (params.q ?? "").trim();
  const lgaFilter = (params.lga ?? "").trim();
  const pageNum = Math.max(1, parseInt(params.page ?? "1", 10) || 1);

  let volunteers: Awaited<ReturnType<typeof prisma.volunteer.findMany>> = [];
  let total = 0;

  try {
    const where: Prisma.VolunteerWhereInput = {};

    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    if (lgaFilter) {
      where.lga = lgaFilter;
    }

    const [items, countResult] = await Promise.all([
      prisma.volunteer.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (pageNum - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
      }),
      prisma.volunteer.count({ where }),
    ]);

    volunteers = items;
    total = countResult;
  } catch (err: unknown) {
    const code =
      err && typeof err === "object" && "code" in err
        ? (err as { code?: string }).code
        : undefined;
    const message = err instanceof Error ? err.message : String(err);
    console.error("[ADMIN] Volunteers page DB error:", { code, message, err });
  }

  const totalPages = Math.ceil(total / PAGE_SIZE) || 1;
  const hasPrev = pageNum > 1;
  const hasNext = pageNum < totalPages;

  const query = new URLSearchParams();
  if (search) query.set("q", search);
  if (lgaFilter) query.set("lga", lgaFilter);

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-green-800">
            Volunteers Management
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            {total} volunteer{total !== 1 ? "s" : ""} total
          </p>
        </div>
        <ExportButton
          url={`/api/admin/export/volunteers?${query.toString()}`}
          label="Export to Excel"
        />
      </div>

      <Suspense fallback={<div className="h-10 bg-gray-100 rounded animate-pulse" />}>
        <VolunteersFilters
          search={search}
          lgaFilter={lgaFilter}
          lgas={OGUN_STATE_LGAS}
        />
      </Suspense>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-4">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="bg-green-800 text-white">
                <th className="px-4 py-3 text-left text-xs font-medium uppercase">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase">
                  Phone
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase hidden md:table-cell">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase">
                  LGA
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase hidden lg:table-cell">
                  Message
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {volunteers.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    No volunteers found.
                  </td>
                </tr>
              ) : (
                volunteers.map((v) => (
                  <tr key={v.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {v.fullName}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      <a
                        href={`tel:${v.phone}`}
                        className="text-green-600 hover:underline"
                      >
                        {v.phone}
                      </a>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 hidden md:table-cell">
                      <a
                        href={`mailto:${v.email}`}
                        className="text-green-600 hover:underline truncate block max-w-[180px]"
                      >
                        {v.email}
                      </a>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">{v.lga}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 hidden lg:table-cell max-w-[200px] truncate">
                      {v.message || "-"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {new Date(v.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Page {pageNum} of {totalPages}
            </p>
            <div className="flex gap-2">
              {hasPrev && (
                <Link
                  href={`/admin/volunteers?${new URLSearchParams({
                    ...Object.fromEntries(query.entries()),
                    page: String(pageNum - 1),
                  })}`}
                  className="px-3 py-1 text-sm font-medium text-green-600 hover:bg-green-50 rounded"
                >
                  ← Previous
                </Link>
              )}
              {hasNext && (
                <Link
                  href={`/admin/volunteers?${new URLSearchParams({
                    ...Object.fromEntries(query.entries()),
                    page: String(pageNum + 1),
                  })}`}
                  className="px-3 py-1 text-sm font-medium text-green-600 hover:bg-green-50 rounded"
                >
                  Next →
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
