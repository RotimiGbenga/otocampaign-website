import { unstable_noStore } from "next/cache";
import { CommunicationsBroadcast } from "./CommunicationsBroadcast";
import { OGUN_STATE_LGAS } from "@/lib/campaign";
import { BROADCAST_SKILLS, BROADCAST_AVAILABILITY } from "@/lib/communications";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function AdminCommunicationsPage() {
  unstable_noStore();

  return (
    <div className="p-6 lg:p-10 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-green-800">
          Campaign Communications
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Send targeted email broadcasts to volunteers
        </p>
      </div>

      <CommunicationsBroadcast
        lgas={[...OGUN_STATE_LGAS]}
        skills={[...BROADCAST_SKILLS]}
        availability={[...BROADCAST_AVAILABILITY]}
      />
    </div>
  );
}
