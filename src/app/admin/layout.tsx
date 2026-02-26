import { ReactNode } from "react";
import Link from "next/link";
import { LogoutButton } from "@/components/admin/LogoutButton";
import { ActivityTracker } from "@/components/admin/ActivityTracker";
import { AdminNav } from "@/components/admin/AdminNav";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-green-800 text-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <nav className="flex items-center gap-6">
              <Link
                href="/admin"
                className="font-bold text-lg text-white hover:text-green-200 transition"
              >
                Campaign Command Center
              </Link>
              <AdminNav />
            </nav>
            <LogoutButton variant="header" />
          </div>
        </div>
      </header>
      <main>
        <ActivityTracker />
        {children}
      </main>
    </div>
  );
}
