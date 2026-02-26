import { unstable_noStore } from "next/cache";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { ExportButton } from "@/components/admin/ExportButton";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function AdminPage() {
  unstable_noStore();

  let totalVolunteers = 0;
  let totalContacts = 0;
  let volunteersLast7Days = 0;
  let volunteersByLga: { lga: string; _count: number }[] = [];
  let recentVolunteers: Awaited<ReturnType<typeof prisma.volunteer.findMany>> =
    [];

  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const [volCount, contactCount, last7Count, lgaStats, recent] =
      await Promise.all([
        prisma.volunteer.count(),
        prisma.contact.count(),
        prisma.volunteer.count({
          where: { createdAt: { gte: sevenDaysAgo } },
        }),
        prisma.volunteer.groupBy({
          by: ["lga"],
          _count: { id: true },
          orderBy: { _count: { id: "desc" } },
        }),
        prisma.volunteer.findMany({
          orderBy: { createdAt: "desc" },
          take: 10,
        }),
      ]);

    totalVolunteers = volCount;
    totalContacts = contactCount;
    volunteersLast7Days = last7Count;
    volunteersByLga = lgaStats.map((s) => ({
      lga: s.lga,
      _count: s._count.id,
    }));
    recentVolunteers = recent;
  } catch (err: unknown) {
    const code =
      err && typeof err === "object" && "code" in err
        ? (err as { code?: string }).code
        : undefined;
    const message = err instanceof Error ? err.message : String(err);
    console.error("[ADMIN] Dashboard DB error:", { code, message, err });
  }

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-green-800">
            Campaign Command Center
          </h1>
          <p className="mt-1 text-gray-600">
            Real-time campaign intelligence from volunteer and contact data
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <ExportButton
            url="/api/admin/export/volunteers"
            label="Export Volunteers"
          />
          <ExportButton
            url="/api/admin/export/contacts"
            label="Export Contacts"
          />
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Total Volunteers
              </p>
              <p className="mt-1 text-3xl font-bold text-green-800">
                {totalVolunteers}
              </p>
              <Link
                href="/admin/volunteers"
                className="mt-2 text-sm font-medium text-green-600 hover:text-green-800"
              >
                View all →
              </Link>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-700">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Contact Messages
              </p>
              <p className="mt-1 text-3xl font-bold text-green-800">
                {totalContacts}
              </p>
              <Link
                href="/admin/contacts"
                className="mt-2 text-sm font-medium text-green-600 hover:text-green-800"
              >
                View all →
              </Link>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-700">
              <svg
                className="w-6 h-6"
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
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Last 7 Days
              </p>
              <p className="mt-1 text-3xl font-bold text-green-800">
                {volunteersLast7Days}
              </p>
              <p className="mt-2 text-xs text-gray-500">
                New volunteers
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-700">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                LGAs with Volunteers
              </p>
              <p className="mt-1 text-3xl font-bold text-green-800">
                {volunteersByLga.length}
              </p>
              <Link
                href="/admin/analytics"
                className="mt-2 text-sm font-medium text-green-600 hover:text-green-800"
              >
                See breakdown →
              </Link>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-700">
              <svg
                className="w-6 h-6"
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
          </div>
        </div>
      </div>

      {/* LGA ANALYTICS – Card Grid */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold text-green-800 mb-1">
          LGA Analytics
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Volunteers grouped by Local Government Area
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {volunteersByLga.length === 0 ? (
            <p className="col-span-full p-6 bg-white rounded-xl border border-gray-100 text-gray-500 text-sm">
              No volunteer data yet.
            </p>
          ) : (
            volunteersByLga.map((row) => (
              <div
                key={row.lga}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition"
              >
                <p className="text-sm font-medium text-gray-800 truncate" title={row.lga}>
                  {row.lga}
                </p>
                <p className="mt-1 text-2xl font-bold text-green-700">
                  {row._count}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      <div>

        {/* RECENT ACTIVITY TABLE */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-green-800">
                Recent Activity
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">
                Latest 10 volunteers, sorted by registration date
              </p>
            </div>
            <Link
              href="/admin/volunteers"
              className="text-sm font-medium text-green-600 hover:text-green-800"
            >
              View all →
            </Link>
          </div>
          <div className="overflow-x-auto">
            {recentVolunteers.length === 0 ? (
              <p className="p-6 text-gray-500 text-sm">
                No volunteers registered yet.
              </p>
            ) : (
              <table className="w-full min-w-[420px]">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Full Name
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Phone
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      LGA
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Created Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recentVolunteers.map((v) => (
                    <tr key={v.id} className="hover:bg-gray-50">
                      <td className="px-4 sm:px-6 py-3 font-medium text-gray-800">
                        {v.fullName}
                      </td>
                      <td className="px-4 sm:px-6 py-3 text-sm text-gray-600">
                        <a
                          href={`tel:${v.phone}`}
                          className="text-green-600 hover:underline"
                        >
                          {v.phone}
                        </a>
                      </td>
                      <td className="px-4 sm:px-6 py-3 text-sm text-gray-600">
                        {v.lga}
                      </td>
                      <td className="px-4 sm:px-6 py-3 text-sm text-gray-500">
                        {new Date(v.createdAt).toLocaleDateString("en-NG", {
                          dateStyle: "medium",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
