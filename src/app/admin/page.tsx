import { prisma } from "@/lib/db";
import { LogoutButton } from "@/components/admin/LogoutButton";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const volunteers = await prisma.volunteer.findMany({
    orderBy: { createdAt: "desc" },
  });

  const contacts = await prisma.contact.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-10 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold text-green-800">
          Campaign Admin Dashboard
        </h1>
        <LogoutButton />
      </div>

      {/* VOLUNTEERS SECTION */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-4 text-green-700">
          Registered Supporters / Volunteers
        </h2>

        {volunteers.length === 0 ? (
          <p className="text-gray-600">No volunteers registered yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border bg-white shadow">
              <thead className="bg-green-700 text-white">
                <tr>
                  <th className="p-3 text-left">Full Name</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Phone</th>
                  <th className="p-3 text-left">LGA</th>
                  <th className="p-3 text-left">Message</th>
                  <th className="p-3 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {volunteers.map((v) => (
                  <tr key={v.id} className="border-b">
                    <td className="p-3 font-semibold">{v.fullName}</td>
                    <td className="p-3">{v.email}</td>
                    <td className="p-3">{v.phone}</td>
                    <td className="p-3">{v.lga}</td>
                    <td className="p-3">{v.message || "-"}</td>
                    <td className="p-3">
                      {new Date(v.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CONTACT MESSAGES SECTION */}
      <div>
        <h2 className="text-2xl font-bold mb-4 text-green-700">
          Contact Messages
        </h2>

        {contacts.length === 0 ? (
          <p className="text-gray-600">No contact messages yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border bg-white shadow">
              <thead className="bg-green-800 text-white">
                <tr>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Phone</th>
                  <th className="p-3 text-left">Message</th>
                  <th className="p-3 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {contacts.map((c) => (
                  <tr key={c.id} className="border-b">
                    <td className="p-3 font-semibold">{c.name}</td>
                    <td className="p-3">{c.email}</td>
                    <td className="p-3">{c.phone || "-"}</td>
                    <td className="p-3">{c.message}</td>
                    <td className="p-3">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}