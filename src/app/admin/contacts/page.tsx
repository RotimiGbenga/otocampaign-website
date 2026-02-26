import { unstable_noStore } from "next/cache";
import Link from "next/link";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const PAGE_SIZE = 20;

type PageProps = {
  searchParams: Promise<{ page?: string }>;
};

export default async function AdminContactsPage({ searchParams }: PageProps) {
  unstable_noStore();

  const params = await searchParams;
  const pageNum = Math.max(1, parseInt(params.page ?? "1", 10) || 1);

  let contacts: Awaited<ReturnType<typeof prisma.contact.findMany>> = [];
  let total = 0;

  try {
    const [items, countResult] = await Promise.all([
      prisma.contact.findMany({
        orderBy: { createdAt: "desc" },
        skip: (pageNum - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
      }),
      prisma.contact.count(),
    ]);

    contacts = items;
    total = countResult;
  } catch (err: unknown) {
    const code =
      err && typeof err === "object" && "code" in err
        ? (err as { code?: string }).code
        : undefined;
    const message = err instanceof Error ? err.message : String(err);
    console.error("[ADMIN] Contacts page DB error:", { code, message, err });
  }

  const totalPages = Math.ceil(total / PAGE_SIZE) || 1;
  const hasPrev = pageNum > 1;
  const hasNext = pageNum < totalPages;

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-green-800">
            Contact Messages
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            {total} message{total !== 1 ? "s" : ""} total
          </p>
        </div>
        <a
          href="/api/admin/export/contacts"
          className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          Export to Excel
        </a>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="bg-green-800 text-white">
                <th className="px-4 py-3 text-left text-xs font-medium uppercase">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase hidden md:table-cell">
                  Phone
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase">
                  Message
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {contacts.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    No contact messages yet.
                  </td>
                </tr>
              ) : (
                contacts.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {c.name}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <a
                        href={`mailto:${c.email}`}
                        className="text-green-600 hover:underline"
                      >
                        {c.email}
                      </a>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 hidden md:table-cell">
                      {c.phone ? (
                        <a
                          href={`tel:${c.phone}`}
                          className="text-green-600 hover:underline"
                        >
                          {c.phone}
                        </a>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 max-w-[300px]">
                      <span className="line-clamp-2">{c.message}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {new Date(c.createdAt).toLocaleDateString()}
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
                  href={`/admin/contacts?page=${pageNum - 1}`}
                  className="px-3 py-1 text-sm font-medium text-green-600 hover:bg-green-50 rounded"
                >
                  ← Previous
                </Link>
              )}
              {hasNext && (
                <Link
                  href={`/admin/contacts?page=${pageNum + 1}`}
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
